<template>
  <v-card id="leaf_card" justify-center text-xs-center>

    <v-toolbar card dark color="primary">
      <v-btn icon @click.native="closeDialog" dark>
        <v-icon>close</v-icon>
      </v-btn>
      <v-toolbar-title>
        <v-text-field class="edit_data" v-model="editedItem.name" :disabled="disable" style="font-size: 20px;"/>
      </v-toolbar-title>
      <v-spacer/>
      <v-toolbar-items>
        <v-btn icon @click=" disable = !disable " v-if="disable"><i class="material-icons" >edit</i></v-btn>
        <v-btn icon  @click="onSave(editedItem)" v-if="!disable"><i class="material-icons">save</i></v-btn>
        <v-menu bottom right offset-y>
          <v-btn slot="activator" dark icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile @click="changeOwner()">
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
      <v-layout row wrap>
        <v-flex xs2>
          <v-subheader>Progress:</v-subheader>
        </v-flex>
        <v-flex xs6>
          <v-progress-linear
            :value="progress"
            height="7"
            color="success"
            :label="progress"
          />
          {{progress}}%
        </v-flex>
        <v-flex xs2>
          <v-subheader>Assign to:</v-subheader>
        </v-flex>
        <v-flex xs2>
          <v-tooltip bottom>
            <v-avatar slot="activator"><img src=""></v-avatar>
            <span> Name:{{editedItem.ownerName}}</span><br/>
            <span> Email:{{editedItem.email}}</span>
          </v-tooltip>

        </v-flex>
      </v-layout>
      <v-divider></v-divider>
      <v-layout row wrap>
        <v-flex xs3>
          <v-subheader >Start
            <v-menu
              transition="slide-x-transition"
              bottom
              right
              :disabled="disable"
            >
              <v-btn flat icon slot="activator">
                <i class="material-icons">access_time</i>
              </v-btn>
              <v-date-picker v-model="editedItem.startDate" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="editedItem.startDate =null">Clear</v-btn>
              </v-date-picker>
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
              <v-btn flat icon slot="activator" >
                <i class="material-icons">access_time</i>
              </v-btn>
              <v-date-picker v-model="editedItem.dueDate" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="editedItem.dueDate =null">Clear</v-btn>
              </v-date-picker>
            </v-menu>
          </v-subheader>
        </v-flex>

        <v-flex xs3>
          <v-chip v-if="editedItem.dueDate!=null" color="red" class="time">{{editedItem.dueDate}}</v-chip>
        </v-flex>
      </v-layout>

      <v-layout row wrap v-if="editedItem.members">
        <v-flex xs2>
          <v-subheader>Member</v-subheader>
        </v-flex>
        <v-flex xs10>
          <v-layout row wrap>
            <v-flex xs2 v-for="member in  editedItem.membersInfo" :key="member._id">
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
                      :items="users"
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
                            <v-list-tile v-for="member in editedItem.membersInfo" :key="member._id">
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
        </v-layout>

        <v-layout row wrap>
        <v-flex xs2>
          <v-subheader>Labels</v-subheader>
        </v-flex>
        <v-flex xs10>
          <v-layout row wrap>
            <v-flex xs2 text-xs-center v-for="label in selectedLabels" :key="label.id" v-if="label.selected = true">
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

      <v-layout row wrap v-if="target==='project'">
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

      <v-layout row wrap>
        <v-flex xs12>
          <v-subheader>Description</v-subheader>
          <v-container>
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  name="description"
                  v-model="editedItem.description"
                  multi-line
                  textarea
                  :disabled="disable"
                />
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>

      </v-layout>


      <!--<v-layout row v-if="editedItem.isLeaf">-->
      <v-layout row>
        <v-flex xs12>
          <v-subheader>Checklist</v-subheader>
          <v-list-tile avatar v-for="(item, i) in editedItem.children" :key="i">
            <v-list-tile-action>
              <v-checkbox v-model="item.checked"
                          :value ="item.checked"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{item.name}}</v-list-tile-title>
              <v-list-tile-sub-title>Assign to :{{item.owner}}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-flex>

        <v-divider class="divide"/>
      </v-layout>


      <v-layout row>
        <v-subheader>Comments History</v-subheader>
      </v-layout>


    </v-card-text>
    <!--<v-footer height="auto">-->

    <!--<v-text-field style="" label="Comment"/>-->
    <!--<v-btn icon><i class="material-icons">send</i></v-btn>-->

    <!--</v-footer>-->
  </v-card>
</template>

<script>
    export default {
      name: "Card",
      props:{
        editedItem:{
          type:Object
        },
        editedShow:{
          type:Boolean
        },
        users:{
          type:Array
        },
        target:{
          type:String
        }

      },
      data(){
        return{
          disable:false,
          progress_value:0,
          menu: false,
          addingMembers:[],
          addMemberShow:false,
          allLabels:[],
          selectedLabels:[],
        }
      },
      computed:{
        progress(){
          let children = this.editedItem.children;
          if( children && children.length>0 ) {

            let result =0;
            for (let i = 0; i < children.length; i++) {
              if (children[i].checked == true) {
                result += 1;
              }
            }
            return parseInt(result/children.length*100);
          }else{
            return 0;
          }
        }
      },
      mounted(){

      },
      methods:{


        changeOwner(){

        },
        addMembers(){
          let that =this;

          let pid,url;
          if(this.target =="project"){
            pid = that.editedItem._id
            url ="/api/project/"+pid+"/member/add";
          }

          console.log(this.editedItem.membersInfo)
          let membersinfo = that.addingMembers;

          //合并两个数组，去重
          let newMembersInfo = this.uniqueArray(this.editedItem.membersInfo.concat(membersinfo),"_id");
          console.log(newMembersInfo)
          console.log("newinfo")
          this.editedItem.membersInfo = newMembersInfo;

          console.log(this.editedItem.membersInfo )
          let id=[];
          for(let i=0;i<newMembersInfo.length;i++){
            id[i]=newMembersInfo[i]._id;
          }
          let mem = {
            "members":id
          }
          postData(this,url,mem,()=> {
            this.$emit('refreshData');

            console.log(this.editedItem.membersInfo)
            this.addingMembers =[];
            this.addMemberShow=false;

          });
          // console.log(this.items);

        },

        deleteMember(item){
          console.log(item);
          let pid,url;
          let that = this;
          if(this.target =="project"){
            pid = that.editedItem._id
            url ="/api/project/"+pid+"/member/delete";
            let memberID=[item._id];
            postData(this,url,memberID,()=>{
              this.$emit('refreshData');

            });
          }
          else if(this.target == "task"){
            pid = that.editedItem.projectId;
            let rid = that.editedItem.reference_id;

            url = "/api/asset/update/"+rid+"/of/"+pid;
          }


        },

        onSave(item){
          // this.task.createDate = new Date().getTime();
          console.log(item);
          item.startDateUTC = new Date(item.startDate).getTime();
          delete item.startDate;
          item.dueDateUTC = new Date(item.dueDate).getTime();
          delete item.dueDate;

          delete item.ownerName;
          delete item.email;
          delete item.membersInfo;

          let children = item.children;
          let rid,url,result;
          if(children.length>0){
            for(let i =0;i<children.length;i++){

              rid=children[i].reference_id;
              url = "/api/asset/update/"+rid+"/of/"+item.projectId;
              result = {
                "checked":children[i].checked
              }
              postData(this,url,result,()=>{

              })
            }
            item.children = [];
          }

          if(this.progress ==100) {
            item.checked = true;
            item.status ="done";
          }
          let url_item = "/api/asset/update/"+item.reference_id+"/of/"+item.projectId;
          postData(this,url_item,item,()=>{
            this.$emit('refreshData');
          })
          this.closeDialog();

        },
        closeDialog(){
          let editedShow = false;
          console.log(editedShow)
          this.$emit("changeShow",editedShow)
        },
        uniqueArray(array, key){
          let result = [array[0]];
          for(let i = 1; i < array.length; i++){
            let item = array[i];
            let repeat = false;
            for (let j = 0; j < result.length; j++) {
              if (item[key] == result[j][key]) {
                repeat = true;
                break;
              }
            }
            if (!repeat) {
              result.push(item);
            }
          }
          return result;
        }

      }

    }
</script>

<style scoped>

</style>
