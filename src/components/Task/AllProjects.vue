<template>
  <v-layout row >
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <v-btn @click.stop="dialog = true">Create New Project</v-btn>
          <v-spacer/>
          <v-text-field
            append-icon="search"
            label="Search"
            single-line
            hide-details
            v-model="search"/>
        </v-card-title>

        <v-data-table  :headers="headers"
                       :items="items"
                       hide-actions
                       class="elevation-1"
                       :search="search">

          <template slot="items" slot-scope="props">
            <td>
              <span style="font-size: 17px" >
                <router-link :to="`/projects/${props.item._id}`">
                    <v-icon class="">folder</v-icon>{{ props.item.name }}
                </router-link>
              </span>
              <v-chip small outline color="green" v-if="props.item.startDate">{{ props.item.startDate }}</v-chip>
              <v-chip small outline color="red" v-if="props.item.dueDate" >{{ props.item.dueDate }}</v-chip>
            </td>
            <td class="text-xs-right">{{ props.item.ownerName }}</td>
            <td class="text-xs-right">{{ props.item.localDate }}</td>

            <td class="justify-center layout px-0">
              <v-btn icon ripple @click="editItem(props.item)">
                <v-icon color="grey lighten-1">info</v-icon>
              </v-btn>
            </td>
          </template>
          <template slot="no-data">
            <v-alert :value="true" color="error" icon="warning">
              Sorry, nothing to display here :(
            </v-alert>
          </template>
        </v-data-table>



        <v-dialog v-model="dialog" max-width="500px">
          <v-card fluid justify-center>
            <v-card-title>
              <h2>Create Project</h2>
            </v-card-title>
            <v-card-text>

              <v-container grid-list-md>
                <v-layout row wrap>
                  <v-flex xs12 md6>
                    <v-text-field label="Project Name" v-model="project.name" required/>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-text-field label="Project Code" v-model="project.code" required/>
                  </v-flex>
                  <v-flex xs12 md12>
                    <v-text-field
                      label="Client"
                      v-model="project.client"
                      persistent-hint
                      required/>
                  </v-flex>
                  <v-flex xs12 md12>
                    <v-text-field label="Part Number" v-model="project.partNumber" multi-line required/>
                  </v-flex>

                </v-layout>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-layout row justify-center text-xs-center>
                <v-flex xs6>
                  <v-btn color="blue darken-1" flat @click.stop="createProject">Save</v-btn>
                </v-flex>
                <v-flex xs6>
                  <v-btn color="primary" flat @click.stop="closeCreate">Close</v-btn>
                </v-flex>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="editedShow" max-width="500px"
                  transition="dialog-bottom-transition"
                  :overlay="false"
                  scrollable>

          <v-card tile id="leaf_card" justify-center text-xs-center>

            <v-toolbar card dark color="primary">
              <v-btn icon @click.native="editedShow = false" dark>
                <v-icon>close</v-icon>
              </v-btn>
              <v-toolbar-title>
                <v-text-field class="edit_data" v-model="editedItem.name" :disabled="disable" style="font-size: 20px;"/>
              </v-toolbar-title>
              <v-spacer/>
              <v-toolbar-items>
                  <v-btn icon @click=" disable = !disable " v-if="disable"><i class="material-icons" >edit</i></v-btn>
                  <v-btn icon  @click="onSave" v-if="!disable"><i class="material-icons">save</i></v-btn>
                  <v-menu bottom right offset-y>
                    <v-btn slot="activator" dark icon>
                      <v-icon>more_vert</v-icon>
                    </v-btn>
                    <v-list>
                      <v-list-tile @click="">
                        <v-list-tile-title>Change Owner</v-list-tile-title>
                      </v-list-tile>
                      <v-list-tile @click="deleteProject(editedItem)">
                        <v-list-tile-title>Delete</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
              </v-toolbar-items>
            </v-toolbar>

            <v-card-text>
              <v-container>
                  <v-subheader>Progress:
                    <v-progress-linear
                    :value="progress_value"
                    height="7"
                    color="success"
                    />
                    {{progress_value}}%
                  </v-subheader>


                  <v-layout row wrap>
                    <v-flex xs3>
                      <v-subheader >Start
                        <v-menu
                          transition="slide-x-transition"
                          bottom
                          right
                          :disabled="disable"
                        >
                          <v-btn icon slot="activator">
                            <i class="material-icons">access_time</i>
                          </v-btn>
                          <v-date-picker v-model="editedItem.startDate" no-title scrollable/>
                        </v-menu>
                      </v-subheader>
                    </v-flex>

                    <v-flex xs3>
                      <v-chip v-if="editedItem.startDate!=null" color="success">{{editedItem.startDate}}</v-chip>
                    </v-flex>

                    <v-flex xs3>
                      <v-subheader >Due
                        <v-menu
                          transition="slide-x-transition"
                          bottom
                          right
                          :disabled="disable"
                        >
                          <v-btn icon slot="activator" >
                            <i class="material-icons">access_time</i>
                          </v-btn>
                          <v-date-picker v-model="editedItem.dueDate" no-title scrollable/>
                        </v-menu>
                      </v-subheader>
                    </v-flex>

                    <v-flex xs3>
                      <v-chip v-if="editedItem.dueDate!=null" color="red" class="time">{{editedItem.dueDate}}</v-chip>
                    </v-flex>
                  </v-layout>



                  <v-layout row wrap>
                    <v-flex xs2>
                      <v-subheader>Member</v-subheader>
                    </v-flex>
                    <v-flex xs10>
                      <v-layout row wrap>
                        <v-flex xs2 v-for="member in  editedItem.members" :key="member._id">
                          <div class="text-xs-center">
                            <v-chip>
                              <v-avatar>
                                <img :src="member.avater">
                              </v-avatar>
                              {{member.name}}
                            </v-chip>
                          </div>
                        </v-flex>
                        <v-btn icon :disabled="disable" @click.stop="addMemberShow = !addMemberShow"> <i class="material-icons">group_add</i></v-btn>
                      </v-layout>
                    </v-flex>
                    <v-dialog v-model="addMemberShow" max-width="500px" height="400px">
                      <v-card>
                        <v-card-title>
                          Add collaborators
                        </v-card-title>
                        <v-card-text>
                          <v-container fluid>
                            <v-layout row wrap>
                              <v-flex xs12>
                                <v-select
                                  label="Select"
                                  :items="people"
                                  v-model="addingMembers"
                                  item-text="name"
                                  multiple
                                  chips
                                  max-height="300px"
                                  autocomplete>

                                <template slot="selection" slot-scope="data">
                                  <v-chip
                                    close
                                    @input="data.parent.selectItem(data.item)"
                                    :selected="data.selected"
                                    class="chip--select-multi"
                                    :key="JSON.stringify(data.item._id)"
                                  >
                                    <v-avatar>
                                      <img :src="data.item.avatar">
                                    </v-avatar>
                                    {{ data.item.name }}
                                  </v-chip>
                                </template>
                                <template slot="item" slot-scope="data" >
                                  <template v-if="typeof data.item !== 'object'">
                                    <v-list-tile-content v-text="data.item"></v-list-tile-content>
                                  </template>
                                  <template v-else>
                                    <v-list-tile-avatar>
                                      <img :src="data.item.avatar">
                                    </v-list-tile-avatar>
                                    <v-list-tile-content>
                                      <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                                    </v-list-tile-content>
                                  </template>
                                </template>
                              </v-select>

                              </v-flex>
                              <v-flex xs12>
                                <v-expansion-panel class="elevation-0" >
                                  <v-expansion-panel-content >
                                    <div slot="header">Advanced</div>
                                    <v-card>
                                      <v-list>
                                        <v-list-tile v-for="member in editedItem.members" :key="member._id">
                                          <v-list-tile-avatar>
                                            <img :src="member.avatar">
                                          </v-list-tile-avatar>

                                          <v-list-tile-title>{{member.name}}</v-list-tile-title>
                                          <v-list-tile-action>
                                            <v-btn icon ripple @click="deleteMember(member)"><i class="material-icons" color="red">delete</i></v-btn>
                                          </v-list-tile-action>
                                        </v-list-tile>
                                      </v-list>
                                    </v-card>
                                  </v-expansion-panel-content>
                                </v-expansion-panel>
                              </v-flex>
                            </v-layout>
                          </v-container>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn color="primary" flat @click.stop="addMemberShow=false">Close</v-btn>
                          <v-spacer/>
                          <v-btn color="primary" flat @click="addMembers">Send</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>

                    <v-flex xs2>
                      <v-subheader>Labels</v-subheader>
                    </v-flex>
                    <v-flex xs10>
                      <v-layout row wrap>
                        <v-flex xs2 text-xs-center v-for="label in selectedLabels" :key="label.id" v-if="label.selected =true">

                            <v-chip :color="label.color"
                                          @input="label.selected =false">{{label.name}}</v-chip>
                        </v-flex>

                        <v-menu offset-y :close-on-content-click="false" >
                          <v-btn icon :disabled="disable" slot="activator"><i class="material-icons">local_offer</i></v-btn>
                          <v-card style="width:300px;">
                            <v-subheader>Select Labels</v-subheader>

                              <v-flex xs12 v-for="(label,index) in allLabels" :key="index">
                                <v-checkbox
                                  :label="label.name"
                                  v-model="selectedLabels"
                                  :color="label.color"
                                  :checked="label.selected"
                                  @click.native="label.selected = !label.selected"
                                  :value="label"
                                  hide-details
                                />

                              </v-flex>
                              <v-flex xs12>
                                <v-btn icon>add</v-btn>
                              </v-flex>
                          </v-card>
                        </v-menu>
                      </v-layout>
                    </v-flex>
                  </v-layout>
              <v-divider class="divide"/>

              <v-layout row wrap>
                <v-flex xs4><v-subheader>Project Code</v-subheader></v-flex>
                <v-flex xs8>
                  <v-text-field v-model="editedItem.code" :disabled="disable"/>
                </v-flex>
                <v-flex xs4><v-subheader>Client</v-subheader></v-flex>
                <v-flex xs8>
                  <v-text-field v-model="editedItem.client" :disabled="disable"/>
                </v-flex>
                <v-flex xs4><v-subheader>Part Number</v-subheader></v-flex>
                <v-flex xs8>
                  <v-text-field
                    name="partNumber"
                    v-model="editedItem.partNumber"
                    multi-line
                    :disabled="disable"
                  />
                </v-flex>
              </v-layout>
              <v-divider class="divide"/>

               <v-layout row wrap>
                  <v-flex xs12>
                    <v-subheader>Description</v-subheader>

                      <v-layout row text-center>
                        <v-flex xs12>
                          <v-text-field
                            name="description"
                            v-model="editedItem.description"
                            multi-line
                            textarea

                            style="width: 80%"
                            :disabled="disable"
                          />
                        </v-flex>
                      </v-layout>
                  </v-flex>
               </v-layout>
                <v-divider></v-divider>
                <v-layout>
                <v-flex xs12>
                  <v-subheader>Checklist</v-subheader>
                  <v-divider class="divide"/>

                  <v-subheader>Comments History</v-subheader>
                  <v-divider class="divide"/>
                </v-flex>

              </v-layout>
              </v-container>
            </v-card-text>

            <!--<v-footer>-->
              <!--<v-layout row>-->
                <!--<v-spacer/>-->
                <!--<v-flex xs9><v-text-field style="" label="Comment"/></v-flex>-->
                <!--<v-flex xs2><v-btn icon><i class="material-icons">send</i></v-btn></v-flex>-->
              <!--</v-layout>-->
            <!--</v-footer>-->
          </v-card>

        </v-dialog>

      </v-card>
    </v-flex>


  </v-layout>
</template>

<script>

    export default {
      name: "all-task-lists",
      components:{

      },
      data(){

        return{
          headers:[
            {
              text:'Project Name',
              align:'left',
              sortable:true,
              value:'name',

           },
            {
              text:'Owner',
              align:'center',
              sortable:true,
              value:'owner',
              width:'10%',
            },
            {
              text:'Created',
              align:'center',
              sortable:true,
              value:'createDate',
              width:'10%',
            },
            {
              text:'Infomation',
              align:'center',
              value:'name',
              sortable:false,
              width:'10%',
            }

          ],
          search:'',
          items: [],
          dialog: false,
          project:{},
          editedShow:false,
          editedIndex: -1,
          editedItem: {},
          menu_date1:false,
          menu_date2:false,
          progress_value:0,
          disable:false,
          addMemberShow:false,
          selectedMembers: [],
          addingMembers:[],
          people: [],
          labelMenu:true,
          allLabels:[],
          selectedLabels:[],




        }
      },
      computed: {

      },

      watch: {

      },

      created() {

        this.fetchData();

      },

      methods:{


        fetchData(callback = undefined) {
          let urlUser = "/api/user/all";
          getData(this,urlUser,(data)=>{
            //get people data
            this.people = data;

            //get projects data
            let urlProject = "/api/project/involved";
            window.getData(this,urlProject,(data)=>{
              let items = data;

              for(let i = 0 ;i<items.length;i++) {
                //transfer time stick to local time
                let localDate = this.convertLocalTime(items[i].createDate);
                items[i].localDate = localDate;

                //transfer owner to ownerName
                let id = items[i].owner;
                let name = this.searchMemberInfo(id, "name");
                items[i].ownerName = name;
                let members = items[i].members;
                for (let j = 0; j < members.length; j++) {
                  let memberID = members[j];
                  let memberName = this.searchMemberInfo(memberID, "name");
                  let avater = this.searchMemberInfo(memberID, "avater");
                  members[j] = {"_id": memberID, "name": memberName, "avater": avater};
                }
                items[i].members = members;

              }
              this.items = items;


              let d = this.items;
              if(callback) {
                callback(d);
              }
            });
          });

        },
        convertLocalTime(time){
          let date = new Date(time);
          let year = date.getFullYear(); // 获取完整的年份(4位,1970)
          let month = date.getMonth()+1; // 获取月份(0-11,0代表1月,用的时候记得加上1)
          let day = date.getDate(); // 获取日(1-31)
          // date.getTime(); // 获取时间(从1970.1.1开始的毫秒数)
          // date.getHours(); // 获取小时数(0-23)
          // date.getMinutes(); // 获取分钟数(0-59)
          // date.getSeconds(); // 获取秒数(0-59)

          return year+"-"+month+"-"+day;
        },

        searchMemberInfo(id,target){
          let that = this;
          let people = that.people;

          for(let i=0;i<people.length;i++){
            if(id == people[i]._id){
              if(target == "name"){
                  return people[i].name;
              }
              else if(target == "avater"){
                  return  people[i].avater;
              }
            }
          }
        },

        editItem (item) {
          this.editedIndex = this.items.indexOf(item);
          this.editedItem = Object.assign({}, item);
          this.editedShow = true;

          this.allLabels = this.editedItem.labels;
          let labels = this.allLabels;
          // console.log(labels);
          let j=0;
          for(let i=0;i<labels.length;i++){

            if(labels[i].selected == true){
              this.selectedLabels[j]=labels[i];
              j++;
            }
          }

        },

        createProject(){
          // let that = this;
          this.project.createDate=new Date().getTime();
          console.log(this.project);
          // this.project.labels =

          let urlCreate = "/api/project/create";
          postData(this,urlCreate,this.project,()=>{
            this.fetchData();
          });
          this.dialog=false;
        },

        closeCreate(){
          this.dialog=false;
          this.project="";

        },

        onSave() {

          let that =this;
          let pid=that.editedItem._id;
          let item = that.editedItem;
          delete item._id;
          delete item.members;
          item.labels = this.allLabels;
          console.log(item);

          if (that.editedIndex > -1) {
            Object.assign(that.items[that.editedIndex], item);

            let urlUpdate = "/api/project/"+pid+"/update";
            postData(this,urlUpdate,item,()=>{
              alert("Save successfully!");
              this.fetchData();
            });
          }
          that.editedShow=false;

        },

        deleteProject(item){
          console.log(item);
          const pid =item._id;
          let r = confirm('Are you sure you want to delete this project?') ;

          if(r === true) {
            let urlDelete = '/api/project/' + pid + '/delete';
            postData(this,urlDelete, item, () => {
              alert('Delete successfully!');
              this.fetchData();
              this.editedShow = false;
            });
          }
        },

        addMembers(){
          let that =this;
          let pid = that.editedItem._id;
          let members = that.addingMembers;
          console.log(that.editedIndex);
          let id=[];
          for(let i=0;i<members.length;i++){
            id[i]=members[i]._id;
          }
          // console.log(id);
          // console.log(that.editedItem);

          let urlAdd = "/api/project/"+pid+"/member/add";

          postData(this,urlAdd,id,()=> {
            this.fetchData( (d)=>{
              let items = d;
              this.items = items;
              this.editedItem.members=this.items[that.editedIndex].members;
            });
          });
          // console.log(this.items);
          this.addMemberShow=false;
        },

        deleteMember(item){
          console.log(item);
          let that = this;
          let pid=that.editedItem._id;
          let memberID=[item._id];

          let urlDelete = "/api/project/"+pid+"/member/delete";
          postData(this,urlDelete,memberID,()=>{
            this.fetchData((d)=>{
              let items = d;
              this.items = items;
              this.editedItem.members=this.items[that.editedIndex].members;
            });
            // that.addMemberShow = false;
          });
        },

        changeLabelName(){

        },

        remove (item) {

          let that = this;
          let labels = that.allLabels;
          let index = labels.indexOf(item);
          labels[index].selected = false;
          console.log(labels);
          // this.allLabels = labels;
        }
      }

    }

</script>

<style scoped>

  .time{

  }
</style>
