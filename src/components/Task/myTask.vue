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
        @click="enterGantt"
      >
        <i class="material-icons">timeline</i>
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
      <card target="task"
            :editedItem = "editedItem"
            :editedShow = "editedShow"
            :users="users"
            v-on:changeShow="closeDialog"
            @refreshData="fetchData"></card>

    </v-dialog>
  </v-container>

</template>

<script>

  import { debounce } from 'lodash';
  import Kanban from '@/components/Kanban/Kanban';
  import Card from '@/components/Kanban/Card'
  import  TreeList from '@/components/Kanban/TreeList'
  import {Tree} from '@/components/Kanban/Tree.js'

  export default {

    name: "my-task",
    props: ['projectId'],
    components:{

        'kanban':Kanban,
        'card':Card,
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
          blocks:[],
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
          users:[],
          addingMembers:[],
          addMemberShow:false,
          filterFolder:"",

        }
      },

      mounted(){

        this.fetchData();

      },

      computed:{

        treelist(){
          let blocks = this.blocks;
          let newArr =[];
          for(let i = 0;i < blocks.length;i++){

            let block = blocks[i];

            block.children=[];
            // block.projectId = this.projectId;
            //找到parent == null的节点 --- 根节点
            if(block.parent==null){
              newArr.push(block);
            }else{
             //有parent
              newArr = this.childrenIterator(newArr,block); //找到该父节点
            }
          }

          let tree = [{
            "name":"Project",
            "reference_id":"root",
            "children":newArr,
            "projectId":this.projectId
          }]

          let treeArr = new Tree(tree);
          return treeArr;

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
        },

      },

      methods:{
        // setIntervalData(){
        //   setInterval(() => {
        //     this.fetchData();
        //   }, 5000)
        // },

        fetchData:function() {
          let urlUser = "/api/user/all";
          getData(this,urlUser,(data)=> {
            //get people data
            this.users = data;
          });

            let url = "/api/project/involved/" + this.projectId + "?assets=1";

            getData(this, url, (data) => {
              let project = data;
              // console.log(project.assets);
              if (project.assets == undefined) {
                this.blocks = [];
              } else {
                let blocks = project.assets;

                blocks = blocks.map((item) => {
                  // console.log(item);
                  if (item.startDateUTC != "") {
                    item.startDate = this.convertLocalTime(item.startDateUTC);
                  }else{
                    item.startDate =null;
                  }

                  if (item.dueDateUTC != "") {
                    item.dueDate = this.convertLocalTime(item.dueDateUTC);
                  }else{
                    item.dueDate =null;
                  }

                  return item;

                })
                this.blocks = blocks;
              }
            })
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

          if(status=="done"){
            block.checked=true;
          }
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


        onClick(model) {

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

          let owner_id =this.editedItem.owner;

          this.editedItem.ownerName = this.searchUserInfo(owner_id,"name");
          this.editedItem.email = this.searchUserInfo(owner_id,"email");

          let parent = this.editedItem.reference_id;
          // search if exit children task
          console.log(parent)
          this.editedItem.children = this.getEditedItemChildren("task",parent);

          // let members =  this.editedItem.members;
          // this.editedItem.membersInfo = this.getEditedItemMembers(members);

          let labels = this.editedItem.labels;
          this.editedItem.labelsInfo = this.getEditedItemLabels(labels);

          this.editedShow = true;
          console.log(this.editedItem);
          console.log("edited")

        },
        getEditedItemChildren(target,parent){
          let children;
          if(target =="project"){
            children = this.blocks.filter((item)=>{
              if(item.parent == null) return item;
            })
          }

          if(target == "task"){
            children = this.blocks.filter((item) => {
              if (item.parent == parent) return item;
            })
          }

          return children;
        },
        getEditedItemMembers(members){
          let arr=[];
          if(members.length !=0){
            for (let i = 0; i < members.length; i++) {
              let memberID = members[i];
              let memberName = this.searchUserInfo(memberID, "name");
              let avater = this.searchUserInfo(memberID, "avater");
              arr[i] = {"_id": memberID, "name": memberName, "avater": avater};
            }
          }
          return arr;
        },
        getEditedItemLabels(labels){
          // console.log(labels);
          let arr =[];
          let j=0;
          if(labels.length>0){
            for(let i=0;i<labels.length;i++){

              if(labels[i].selected == true){
                arr[j]=labels[i];
                j++;
              }
            }
          }

          return arr;
        },
        searchUserInfo(id,target){
          let that = this;
          let users = that.users;

          console.log(this.users)
          console.log("length"+users.length)
          for(let i=0;i<users.length;i++){
            if(id == users[i]._id){
              console.log(id)
              if(target == "name"){
                console.log(users[i].name)
                return users[i].name;
              }
              else if(target == "avater"){
                return  users[i].avater;
              }
              else if(target == "email"){
                return  users[i].email;
              }
            }
          }
        },

        enterGantt(){
          let projectId = this.projectId;
          this.$router.push({ path: `/gantt/${projectId}` }) // -> /gantt/:projectId
        },

        createTask(){
          let createDate = new Date().getTime();

          let urlCreate = "/api/asset/create/"+this.projectId;

            this.newTask= {
              "name":this.newTask.name,
              "createDate": createDate,
              "projectId":this.projectId,
              "parent": null,
              "isFolder": true,
              "status": "todo",
              "checked":false,
              "children": [],
              "startDateUTC":"",
              "dueDateUTC":"",
              "members":[],
              "labels":[]


            }

            window.postData(this,urlCreate,this.newTask,(data)=>{
              this.fetchData();
            })


          this.newTaskShow =false;
        },

        closeDialog(msg){
          this.editedShow = msg;
          console.log(msg)
          console.log("changeshow")
        }



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
