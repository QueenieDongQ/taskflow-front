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
              <span style="font-size: 17px" @click="enterProject(props.item._id)">
                <v-icon class="">folder</v-icon>{{ props.item.name }}
              </span>
              <v-chip small outline color="green" v-if="props.item.startDate">{{ props.item.startDate }}</v-chip>
              <v-chip small outline color="red" v-if="props.item.dueDate" >{{ props.item.dueDate }}</v-chip>
            </td>
            <td class="text-xs-right">{{ props.item.owner }}</td>
            <td class="text-xs-right">{{ props.item.createDate }}</td>

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
                  <v-flex xs12 sm6 md4>
                    <v-text-field label="Project Name" v-model="project.name" required/>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field label="Project Code" v-model="project.code" required/>
                  </v-flex>
                  <v-flex xs12 md4>
                    <v-text-field
                      label="Client"
                      v-model="project.client"
                      persistent-hint
                      required/>
                  </v-flex>
                  <v-flex xs12>
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

        <v-dialog v-model="editedShow" fullscreen
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
                        <v-flex xs2 v-for="member in  editedItem.members" :key="member.id">
                          <div class="text-xs-center">
                            <v-chip>
                              <v-avatar>
                                <img src="selectedPerson.avater">
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
                                item-value="item"
                                multiple
                                chips
                                max-height="300px"
                                autocomplete
                              >
                                <template slot="selection" slot-scope="data">
                                  <v-chip
                                    close
                                    @input="data.parent.selectItem(data.item)"
                                    :selected="data.selected"
                                    class="chip--select-multi"
                                    :key="JSON.stringify(data.item.id)"
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
                                        <v-list-tile v-for="member in editedItem.members">
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
                      <v-layout>

                      <v-flex xs2 text-xs-center v-for="slabel in selectedLabels" :key="slabel.id">
                          <v-chip close :color="slabel.color" @input="remove(slabel)">{{slabel.name}}</v-chip>
                      </v-flex>

                      <v-menu offset-y :close-on-content-click="false" >
                        <v-btn icon :disabled="disable" slot="activator"><i class="material-icons">local_offer</i></v-btn>
                        <v-card style="width:300px;">
                          <v-subheader>Select Labels</v-subheader>
                          <v-layout>
                            <v-flex xs12 sm6 v-for="alllabel in allLabels" :key="alllabel.key">
                              <v-checkbox
                                :label="alllabel.name"
                                v-model="selectedLabels"
                                :color="alllabel.color"
                                :value="alllabel.selected"
                                hide-details
                              />
                            </v-flex>

                          </v-layout>

                        </v-card>
                      </v-menu>
                      </v-layout>
                    </v-flex>
                  </v-layout>



            <v-divider class="divide"/>


              <v-layout row wrap>
                <v-flex xs5>
                  <v-text-field  label="Project Code" v-model="editedItem.code" :disabled="disable"/>
                </v-flex>
                <v-spacer/>
                <v-flex xs5>
                  <v-text-field  label="Client" v-model="editedItem.client" :disabled="disable"/>
                </v-flex>

                <v-flex xs12>

                  <v-text-field
                    name="description"
                    label="Description"
                    v-model="editedItem.description"
                    multi-line
                    :disabled="disable"
                  />
                  <v-divider class="divide"/>
                </v-flex>
                <v-flex xs12>
                  <v-subheader>Checklist</v-subheader>
                  <v-divider class="divide"/>

                  <v-subheader>Comments History</v-subheader>
                  <v-divider class="divide"/>
                </v-flex>

              </v-layout>
              </v-container>
            </v-card-text>

            <v-footer>
              <v-layout row>
                <v-spacer/>
                <v-flex xs9><v-text-field style="" label="Comment"/></v-flex>
                <v-flex xs2><v-btn icon><i class="material-icons">send</i></v-btn></v-flex>
              </v-layout>
            </v-footer>
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
          items: [

          ],
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

          labelMenu:true,
          allLabels:[
            {id:1,name: "Finance", color: "yellow", selected:false},
            {id:2,name: "IT" , color: "blue", selected:true},
            {id:3,name: "Sales" , color: "red", selected:false},
          ],
          selectedLabels:[],

          selectedMembers: [],
          addingMembers:[],
          people: [

            // { id:0, name: 'Sandra Adams', avatar: '' },
            // { id:1, name: 'Ali Connors',  avatar: '' },
            // { id:2, name: 'Trevor Hansen', avatar: '' },
            // { id:3, name: 'Tucker Smith', avatar: '' },
            // { id:4, name: 'Britta Holt', avatar: '' },
            // { id:5, name: 'Jane Smith ', avatar: '' },
            // { id:6, name: 'John Smith', avatar: '' },
            // { id:7, name: 'dra Williams', avatar: '' },
            // { id:10, name: 'ndra Adams', avatar: '' },
            // { id:11, name: 'Ai Connors',  avatar: '' },
            // { id:12, name: 'Tevor Hansen', avatar: '' },
            // { id:13, name: 'ucker Smith', avatar: '' },
            // { id:14, name: 'Brta Holt', avatar: '' },
            // { id:15, name: 'Jne Smith ', avatar: '' },
            // { id:16, name: 'ohn Smith', avatar: '' },
            // { id:17, name: 'Sand lliams', avatar: '' }
          ],


        }
      },
      computed:{
        // selectedLabels(){
        //   let labels = this.allLabels;
        //   for(let i=0;i<labels.length;i++){
        //     if(labels[i].selected == true){
        //       this.selectedLabels.push(labels[i]);
        //     }
        //   }
        //   return this.selectedLabels;
        // }
      },
      watch: {
        selectedLabels(){
          let labels = this.allLabels;
          for(let i=0;i<labels.length;i++){
            if(labels[i].selected == true){
              this.selectedLabels.push(labels[i]);
            }
          }
          return this.selectedLabels;
        }
      },
      created() {

        this.fetchData();

      },

      methods:{
        fetchData() {

          let proAPI='/api/project/involved';
          let usrAPI='/api/user/all';

          this.$http.get('/api/project/involved').then(response => {
            // get body data
            this.items = response.data.data;
            console.log(this.items);

          }, error=> {
            // error callback
            this.notify(error)
          });

          this.$http.get('/api/user/all').then(response => {
            // get body data
            this.people = response.data.data;
            console.log(this.people);

          }, error=> {
            // error callback
            this.notify(error)
          });

        },

        editItem (item) {
          this.editedIndex = this.items.indexOf(item);
          this.editedItem = Object.assign({}, item);
          this.editedShow = true;
          console.log(this.editedItem);

        },

        createProject(){

          this.project.createDate=new Date().getTime();

          this.$http.post('/api/project/create', this.project).then(response => {
            if(response.data.code != 0) {
              // this.notify(response.data.error);
              alert(response.data.error);
            }

            this.items.push(this.project);
          }, error => {
            // this.notify(error);
            alert(error);
          });
          this.dialog=false;
        },

        closeCreate(){
          this.dialog=false;
          this.project="";

        },

        onSave() {
          console.log(this.editedItem._id);
          let pid=this.editedItem._id;
          let item = JSON.stringify(this.editedItem);

          if (this.editedIndex > -1) {
            Object.assign(this.items[this.editedIndex], this.editedItem);

            this.$http.post('/api/project/'+pid+'/update', JSON.stringify(item)).then(response => {
              if(response.data.code != 0) {
                this.notify(response.data.error);
              }else{
                alert('Save successfully!');
                // this.$options.methods.updateItem(item);
              }
            }, error => {
              this.notify(error)
            });

          } else {

            this.items.push(this.editedItem);

          }
          this.editedShow=false;

        },

        deleteProject(item){
          console.log(item);
          const index = this.items.indexOf(item);
          const pid =item._id;
          let r= confirm('Are you sure you want to delete this project?') ;

          if(r === true){
            this.$http.post('/api/project/'+pid+'/delete',JSON.stringify(item)).then(response => {
              if(response.data.code != 0) {
                this.notify(response.data.error);
              }else{
                alert('Delete successfully!');
                // this.items.splice(index, 1);
                this.editedShow = false;
              }
            }, error => {
              this.notify(error)
            });
          }else{
            return;
          }
        },

        enterProject(id){
          // this.$router.push({name:'project',params:{id}});

        },

        addMembers(){
          let pid = this.editedItem._id;
          let members = this.addingMembers;
          console.log(members);
          let id=[];
          for(let i=0;i<members.length;i++){
            id[i]=members._id;
          }

          this.$http.post('/api/project/'+pid+'/member/add',id).then(response => {
            if(response.data.code != 0) {
              // this.notify(response.data.error);
              alert(response.data.error);
            }
            console.log(response);
            // this.editedItem.members
          }, error => {
            // this.notify(error);
            alert(error);
          });

          this.addMemberShow=false;

        },

        deleteMember(item){
          console.log(item);

          let pid=this.editedItem._id;
          let mid=item._id;
          this.$http.post('/api/project/'+pid+'/member/delete', mid).then(response => {
            if(response.data.code != 0) {
              this.notify(response.data.error);
            }else{
              alert('Delete successfully!');
              // this.items.splice(index, 1);
              this.addMemberShow = false;
            }
          }, error => {
            this.notify(error)
          });

        },

        changeLabelName(){

        },

        remove (item) {
          this.selectedLabels.splice(this.selectedLabels.indexOf(item), 1)
          this.selectedLabels = [...this.selectedLabels]
        }
      }

    }

</script>

<style scoped>

  .time{

  }
</style>
