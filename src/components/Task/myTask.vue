<template>
  <v-container fluid>
    <div style="position:fixed;bottom:5%;right:0px;z-index:10">
      <v-btn
        absolute
        dark
        fab
        top
        right
        color="pink"
        @click="addTask()"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </div>
    <v-layout row>
      <v-flex xs2>
        <!--<vue-drag-tree v-model="lists" ></vue-drag-tree>-->
        <ul>
          <tree :dataList="lists"></tree>
        </ul>
      </v-flex>
      <v-flex xs10>
        <v-container fluid>
          <v-layout row wrap>
            <v-flex xs12>

              <v-text-field v-model="search"
                            append-icon="search"
                            label="Search"
                            single-line
                            hide-details
                            class="search"
                            ></v-text-field>

            </v-flex>
            <v-divider></v-divider>
            <v-flex xs12>
              <v-layout row wrap>

                <v-flex xs4 v-for="(list, index) in filterLists" :key="index">
                  <board :key="index"
                         @dragChange="dragChange" :title="list.status" :index="index">
                    <card v-for="(innerItem, innerIndex) in list.items"
                          :key="index + '-' + innerIndex"
                          :data="innerItem"
                          :innerIndex="innerIndex"
                          :index="index"
                          @listenEditItem="showEditDialog"
                          @listenEditClose="closeEditDialog"></card>
                  </board>
                </v-flex>

              </v-layout>
            </v-flex>


          </v-layout>
          <!--<singlecard :isShow="editedShow" :data="editedItem"></singlecard>-->
        </v-container>
      </v-flex>
    </v-layout>

    <v-dialog v-model="editedShow"
              transition="dialog-bottom-transition"
              :overlay="false"
              scrollable class="editDialog">

      <v-card id="leaf_card" justify-center text-xs-center>

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



            <v-divider class="divide"/>


            <v-layout row wrap>

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
  </v-container>

</template>

<script>

  import Board from '@/components/Kanban/Board'
  import Card from '@/components/Kanban/Card'
  import Tree from '@/components/Kanban/Tree'



  export default {

    name: "my-task",
    components:{
        'board':Board,
        'card':Card,
        'tree':Tree,

      },
      data(){
        return{
          search:"",
          lists:[
            {
              "status":"To Do",
              "items":[
                {
                  "name":"test",
                  "id":"l1",
                  // "desc":None,
                  // "reference_id":"",

                },
                {
                  "name":"urtut",
                  "id":"l2",
                  // "desc":None,
                  // "reference_id":""

                }
              ]
            },
            {
              "status":"In Progress",
              "items":[
                {
                  "name":"errrst",
                  "id":"l3",
                  "desc":"",
                  "reference_id":""

                },
                {
                  "name":"ytgdf",

                }
              ]
            },
            {
              "status":"Done",
              "items":[
                {
                  "name":"wesdst",

                },
                {
                  "name":"tuethfgdf",

                }
              ]
            },
          ],
          editedInfo:[],
          editedItem:{},
          editedShow:false,

          items: [
            {
              title: 'Click Me'
            },
            {
              title: 'Click Me'
            },
            {
              title: 'Click Me'
            },
            {
              title: 'Click Me 2'
            }
          ],
          disable:false,
          progress_value:0,
          people:[],
          addingMembers:[],
          addMemberShow:false,

          allLabels:[],
          selectedLabels:[],

        }
      },

      created(){

      },

      computed:{
        filterLists(){
          let lists = this.lists;
          console.log(lists);
          let search = this.search;
          if( !search ){
            return lists
          }
          search =search.trim().toLowerCase();
          var newArr = [];
          for(let i=0;i<lists.length;i++){

            let status = lists[i].status;
            let arr=lists[i].items;
            arr = arr.filter(function(item){
              let index = item.name.trim().toLowerCase().indexOf(search);
              if( index !== -1){
                return item;
              }
            });
            newArr[i]={"status":status, "items":arr}
          }
          console.log(newArr);
          return newArr;
        }
      },

      methods:{
        dragChange (index, changeIndex, changeInnerIndex) {
          let a = this.lists[changeIndex].items.splice(changeInnerIndex, 1);
          this.lists[index].items.push(a[0]);
          console.log(this.lists);
        },

        showEditDialog(data){
          console.log(data);
          this.editedItem = data.itemInfo;
          this.editedShow = data.show;
        },

        closeEditDialog(data){
          console.log(data);
          this.editedShow = data;
        },

        addTask(){
          // this.lists[0].items
          this.editedShow = true;
          this.editedItem = [];
          this.editedItem.createDate = new Date().getTime();
        },

        addMembers(){

        },

        deleteMember(member){

        },

        onSave(){

        },



      }


  }
</script>

<style scoped>
  .search{
    width: 60%;
    margin-bottom: 10px;
    float: right;
  }

  .editDialog{
    z-index: 50;
    max-width:300px;
    padding:0;
  }

  div #leaf_card .card{
    padding:0;
  }
</style>
