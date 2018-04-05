<template>
  <v-container fluid>
    <div style="position:fixed; bottom:5%; right:0; z-index:10">
      <v-btn
        absolute
        dark
        fab
        top
        right
        color="pink"
        slot="activator"
        @click="addTask"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </div>

    <v-dialog v-model="newTaskShow" max-width="500px">
      <v-card style="margin: 0">
        <v-card-title>
          <span class="headline">Add New Task</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field label="Task Name" v-model="newTask.name" required></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-layout row text-center>
            <v-flex xs6>
              <v-btn color="primary" flat @click.stop="newTaskShow=false">Close</v-btn>
            </v-flex>
            <v-flex xs6>
              <v-btn color="primary" flat @click.stop="createTask">Save</v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-dialog>



    <v-layout row>
      <v-flex xs3>
        <v-layout row wrap>
          <v-flex xs12>
            <v-btn @click="filterFolder =''">Show All Task</v-btn>
          </v-flex>
          <v-flex xs12 style="overflow: scroll">
            <tree
              @fetchData="fetchData"
              @click="onClick"
              :model="treelist"
              :blocks="blocks"
              default-tree-node-name="new node"
              default-leaf-node-name="new leaf"></tree>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs9>
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
              <kanban :stages="statuses" :blocks="filterLists" @update-block="updateBlock">
                <div v-for="item in blocks" :slot="item.reference_id" :key="item.reference_id" class="">

                  <v-card>
                    <v-list>
                      <v-list-tile>
                        <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                        <v-list-tile-action>
                          <v-btn icon ripple @click="editItem(item)">
                           <v-icon color="grey lighten-1">info</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile></v-list>

                  </v-card>
                </div>
              </kanban>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>

    <v-dialog v-model="editedShow"
              transition="dialog-bottom-transition"
              :overlay="false"
              max-width="500px"
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
            <v-btn icon  @click="onSave(editedItem)" v-if="!disable"><i class="material-icons">save</i></v-btn>
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
          <v-layout row wrap>
            <v-flex xs8>
              <v-subheader>Progress:
                <v-progress-linear
                  :value="progress_value"
                  height="7"
                  color="success"
                />
                {{progress_value}}%
              </v-subheader>
            </v-flex>
            <v-flex xs4>

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
            <v-divider class="divide"/>

            <v-layout row>
              <v-flex xs12>
                <v-subheader>Checklist</v-subheader>
              </v-flex>
              <v-flex xs12>

              </v-flex>
            </v-layout>
            <v-divider class="divide"/>

            <v-layout row>
                <v-subheader>Comments History</v-subheader>
            </v-layout>


        </v-card-text>
        <!--<v-footer height="auto">-->

          <!--<v-text-field style="" label="Comment"/>-->
          <!--<v-btn icon><i class="material-icons">send</i></v-btn>-->

        <!--</v-footer>-->
      </v-card>

    </v-dialog>
  </v-container>

</template>

<script>

  import { debounce } from 'lodash';
  import Kanban from '@/components/Kanban/Kanban';

  import  TreeList from '@/components/Kanban/TreeList'
  import {Tree} from '@/components/Kanban/Tree.js'

  export default {

    name: "my-task",
    props: ['projectId'],
    components:{

        'kanban':Kanban,
        // 'tree':VueTreeList,
        'tree':TreeList
      },

      data(){
        return{
          search:"",
          newTaskShow:false,
          newTask:{},
          dialog2:false,
          statuses:[
           "todo","progress","done"
          ],
          blocks:[
            // {"reference_id":1,"status":"todo","name":"test1", "parent":null, "children":[],},
            // {"reference_id":2,"status":"todo","name":"test2", "parent":null, "children":[6,],},
            // {"reference_id":3,"status":"progress","name":"test3", "parent":null, "children":[7,]},
            // {"reference_id":4,"status":"done","name":"test4"},
            // {"reference_id":5,"status":"progress","name":"test5"},
            // {"reference_id":6,"status":"todo","name":"test2-1","parent":2,"children":[],},
            // {"reference_id":7,"status":"todo","name":"test3-1","parent":3,"children":[],},
            // {"reference_id":8,"status":"todo","name":"test3-2","parent":3,"children":[],},
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
          filterFolder:"",

        }
      },

      mounted(){

        this.fetchData();
        // this.setIntervalData()
      },

      computed:{


        treelist(){
          let blocks = this.blocks;
          let newArr =[];
          for(let i = 0;i < blocks.length;i++){

            let block = blocks[i];
            block.projectId = this.projectId;
            //找到parent == null的节点 --- 根节点
            if(block.parent==null){
              block.children=[];
              newArr.push(block);

            }else{
             //有parent
              newArr = this.childrenIterator(newArr,block); //找到该父节点
            }
          }

          // console.log(newArr);
          let tree = [{
            "name":"Root",
            "reference_id":"root",
            "children":newArr,
            // "projectId":this.projectId
          }]
          // console.log(tree);
          let treeArr = new Tree(tree);
          return treeArr;
          // return tree;
        },

        filterLists(){
          let lists = this.blocks;
          // console.log(lists);
          let search = this.search;
          let filterFolder = this.filterFolder;
          search =search.trim().toLowerCase();
          let newArr = [];

          if(filterFolder !=""){
            newArr = lists.filter((item)=>{
              return item.parent === filterFolder;
            })
          }else{
            newArr = lists;
          }
          if( !search ){
            return newArr;
          }

          newArr = newArr.filter(function (item) {
            let index = item.name.trim().toLowerCase().indexOf(search);
            if( index !== -1){
              return item;
            }
          });

          return newArr;
        }
      },

      methods:{
        setIntervalData(){
          setInterval(() => {
            this.fetchData();
          }, 5000)
        },

        fetchData()
          {
            // console.log(this.projectID);
            let url = "/api/project/involved/" + this.projectId + "?assets=1";
            // console.log(this, window, window.globalVueInstance);
            getData(this, url, (data) => {
              let project = data;
              // console.log(project.assets);
              if (project.assets == undefined) {
                this.blocks = [];
              } else {
                let blocks = project.assets;

                blocks = blocks.map((item) => {
                  // console.log(item);
                  if (item.startDateUTC != 0) {
                    item.startDate = this.convertLocalTime(item.startDateUTC);
                  }
                  if (item.dueDateUTC != 0) {
                    item.dueDate = this.convertLocalTime(item.dueDateUTC);
                  }
                  return item;

                })
                this.blocks = blocks;
              }
            })

            // setTimeout(function () {
            //   this.fetchData()
            // }, 2000);
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

        updateBlock: debounce(function (reference_id, status) {
          let url ="/api/asset/update/"+reference_id+"/of/"+this.projectId;
          // this.blocks.find(b => b.reference_id === Number(reference_id)).status = status;
          // console.log(this.blocks);

          let block = this.blocks.find( b => b.reference_id === Number(reference_id));
          block.status = status;
          console.log(block);

          postData(this,url,block,()=>{
            this.fetchData();
          })
        }, 500),

        childrenIterator(arr,block) {

          arr.map((obj)=>{
            if(obj.reference_id == block.parent){
              if(block.deps!=null){
               block.children=[];
              }
              obj.children.push(block);

            }else{
              this.childrenIterator(obj.children,block);
            }
          });
          return arr;
        },

        addNode: function () {
          var node = new TreeNode({ name: 'new node', isLeaf: false });
          if (!this.data.children) this.data.children = [];
          this.data.addChildren(node);
        },

        getNewTree: function () {
          var vm = this
          function _dfs (oldNode) {
            var newNode = {}

            for (var k in oldNode) {
              if (k !== 'children' && k !== 'parent') {
                newNode[k] = oldNode[k]
              }
            }

            if (oldNode.children && oldNode.children.length > 0) {
              newNode.children = []
              for (var i = 0, len = oldNode.children.length; i < len; i++) {
                newNode.children.push(_dfs(oldNode.children[i]))
              }
            }
            return newNode
          }

          vm.newTree = _dfs(vm.data)
        },

        onClick(model) {
          // console.log(this);
          let pid = model.reference_id;
          if(pid =="root"){
            this.filterFolder = null;
          }else{
            this.filterFolder = pid;
          }

        },


        editItem (item) {
          this.editedIndex = this.items.indexOf(item);
          this.editedItem = Object.assign({}, item);
          this.editedShow = true;
          console.log(this.editedItem);
        },

        closeEditDialog(data){
          console.log(data);
          this.editedShow = data;
        },

        addTask(){
          // this.lists[0].items

          this.newTaskShow = true;
          console.log(this.newTaskShow);
          // this.editedItem = [];


          // this.lists[0].items.push(this.editedItem);
        },

        createTask(){
          let createDate = new Date().getTime();

          let urlCreate = "/api/asset/create/"+this.projectId;

            this.newTask= {
              "name":this.newTask.name,
              "createDate": createDate,
              "parent": null,
              "isFolder": true,
              "status": "todo",
              "children": [],
              "startDate":0,
              "dueDate":0,

            }

            window.postData(this,urlCreate,this.newTask,(data)=>{
              this.fetchData();
            })


          this.newTaskShow =false;
        },

        addMembers(){

        },

        deleteMember(member){

        },

        onSave(item){
          // this.task.createDate = new Date().getTime();
          console.log(item);
          item.startDateUTC = new Date(item.startDate).getTime();
          delete item.startDate;
          item.dueDateUTC = new Date(item.dueDate).getTime();
          delete item.dueDate;

          let url = "/api/asset/update/"+item.reference_id+"/of/"+this.projectId;
          window.postData(this,url,item,()=>{
            this.fetchData();
          })

          this.editedShow = false;

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
    width:300px;
    padding:0;
  }

  #leaf_card{
    padding:0;
    height: auto;
  }
  .card{
    height: auto;
  }
  .item {
    cursor: pointer;
  }
  .bold {
    font-weight: bold;
  }
  ul {
    padding-left: 1em;
    line-height: 1.5em;
    list-style-type: dot;
  }
</style>
