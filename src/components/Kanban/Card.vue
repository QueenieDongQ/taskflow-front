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
        <v-btn icon @click="judgeIsOwner() " v-if="disable"><i class="material-icons" >edit</i></v-btn>
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
          <v-chip color="success" v-if="editedItem.startDate!=null" >{{editedItem.startDate}}</v-chip>
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
          <v-chip color="red" v-if="editedItem.dueDate!=null" >{{editedItem.dueDate}}</v-chip>
        </v-flex>
      </v-layout>

      <v-layout row wrap v-if="editedItem.members">
        <v-flex xs2>
          <v-subheader>Member</v-subheader>
        </v-flex>
        <v-flex xs10>
          <v-layout row wrap>
            <v-flex xs2>
              <v-btn icon :disabled="disable" @click.stop="addMemberShow = !addMemberShow">
                <i class="material-icons">group_add</i>
              </v-btn>
            </v-flex>
            <v-flex 10>
              <v-layout>
                <v-flex xs6 sm4 v-for="member in  editedItem.membersInfo" :key="member._id">

                  <v-chip>
                    <v-avatar>
                      <img :src="member.avater">
                    </v-avatar>
                    {{member.name}}
                  </v-chip>
                </v-flex>
              </v-layout>
            </v-flex>


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

                          @input="data.parent.selectItem(data.item)"
                          :selected="data.selected"
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
                        <v-spacer/>
                        <div slot="header"><v-btn flat>Advanced</v-btn></div>
                        <v-card>
                          <v-list>
                            <v-list-tile v-for="(member,index) in editedItem.membersInfo" :key="index">
                              <v-list-tile-avatar>
                                <img :src="member.avatar">
                              </v-list-tile-avatar>

                              <v-list-tile-title>{{member.name}}</v-list-tile-title>
                              <v-list-tile-action>
                                <v-btn icon ripple @click="deleteMember(member,index)"><i class="material-icons" color="red">delete</i></v-btn>
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
            <v-flex xs12>
              <v-chip :color="editedItem.labelDetail.color" v-if="editedItem.labelDetail">{{editedItem.labelDetail.name}}</v-chip>
            </v-flex>
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


      <v-layout row
                v-if="editedItem.isLeaf==false || target == 'project' "
                >
        <v-flex xs12>
          <v-subheader>Checklist</v-subheader>
          <v-list-tile avatar v-for="(item, i) in editedItem.children" :key="i">
            <v-list-tile-action>
              <v-checkbox v-model="item.checked"
                          :value ="item.checked"
                          :disabled="disable"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{item.name}}</v-list-tile-title>
              <v-list-tile-sub-title>Assign to :{{item.ownerName}}</v-list-tile-sub-title>
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
        },
        myInformation:{
          type:Object
        }

      },
      data(){
        return{
          disable:true,
          progress_value:0,
          menu: false,
          addingMembers:[],
          addMemberShow:false,

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
        },

      },
      mounted(){
        // this.getEditedItemChildren(this.target ,this.editedItem )
        // this.editedItem.children = this.getEditedItemChildren( this.target ,this.editedItem )

      },
      methods:{

        judgeIsOwner(){
          console.log(this.myInformation._id )
          console.log(this.myInformation.name )
          if(this.myInformation._id !=this.editedItem.owner){
            return alert("你没有编辑权限");
          }else{
            return this.disable =false;
          }
        },
        changeOwner(){

        },
        addMembers(){
          let that =this;

          let pid,url;
          if(this.target =="project"){
            pid = that.editedItem._id
            url ="/api/project/"+pid+"/member/add";
          }

          let membersinfo = that.addingMembers;

          //合并两个数组，去重
          let newMembersInfo = this.uniqueArray(this.editedItem.membersInfo.concat(membersinfo),"_id");

          this.editedItem.membersInfo = newMembersInfo;

          let id=[];
          for(let i=0;i<newMembersInfo.length;i++){
            id[i]=newMembersInfo[i]._id;
          }
         console.log(id);
          postData(this,url,id,()=> {

            this.$emit('refreshData');

            this.addingMembers =[];
            this.addMemberShow=false;

          });
          // console.log(this.items);

        },

        deleteMember(item,index){
          console.log(item);
          let r = confirm("确定删除该成员？");
          if(!r){
            return;
          }else{
            let pid,url;
            let that = this;

            pid = that.editedItem._id;
            url ="/api/project/"+pid+"/member/delete";
            let memberID=[item._id];
            console.log(index)
            that.editedItem.membersInfo.splice(index,1);
            console.log(that.editedItem.membersInfo);
            console.log("members")
            postData(this,url,memberID,()=>{

              this.$emit('refreshData');

            })
          }

        },

        onSave(item){
          // this.task.createDate = new Date().getTime();
          console.log(item);

          delete item.membersInfo;

          item.startDateUTC = new Date(item.startDate).getTime();
          delete item.startDate;
          item.dueDateUTC = new Date(item.dueDate).getTime();
          delete item.dueDate;
          item.modifyDateUTC = new Date().getTime();

          let children = item.children;
          item.children = this.saveChildren(children);

          if(this.progress == 100) {
            item.checked = true;
            item.status ="done";
          }

          let pid,rid,url;

          if(this.target =="project"){
            pid = item._id
            url = "/api/project/"+ pid +"/update";
            delete item._id
            postData(this,url,item,()=>{
              this.$emit('refreshData');
            })
          }
          else if(this.target =="task"){
            rid = item.reference_id;
            pid = item.projectId;
            url = "/api/asset/update/"+rid+"/of/"+pid;
            postData(this,url,item,()=>{
              this.$emit('refreshData');
            })
          }
          this.closeDialog();

        },
        saveChildren(children){
          let pid,rid,result;
          if(children && children.length>0){
            pid=children[0].projectId;
            for(let i =0;i<children.length;i++){

              let child = children[i];
              rid=child.reference_id;

              url = "/api/asset/update/"+rid+"/of/"+pid;
              if(child.checked == true){
                result = {
                  "checked":true,
                  "status":"done",
                }
              }else{
                result = {
                  "checked":false
                }
              }
              postData(this,url,result)
            }
            children = [];
            return children;
          }else{
            return false;
          }

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
