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


    <v-layout row>
      <v-flex xs3>
        <v-layout row wrap>
          <v-flex xs12>
            <v-btn @click="filterFolder =''">Show All Task</v-btn>
          </v-flex>
          <v-flex xs12 style="overflow: scroll">
            <tree
              @refreshData="fetchData"
              @click="onClick"
              :model="treelist"
              :blocks="blocks"
              ></tree>
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
                <v-card
                  v-for="item in blocks"
                  :slot="item.reference_id"
                  :key="item.reference_id"
                  style="height:100%;"
                  :class="{'isDelay':(item.dueDateUTC<today && item.dueDateUTC && item.status !='done')}">

                    <v-list>
                      <v-list-tile avatar
                                   ripple>
                        <v-list-tile-content>
                        <v-list-tile-title>
                          {{ item.name }}
                        </v-list-tile-title>
                          <v-spacer/>
                          <v-list-tile-sub-title v-if="item.startDate ">
                            Start:{{item.startDate}}
                          </v-list-tile-sub-title>
                          <v-list-tile-sub-title v-if="item.dueDate" >
                            Due:{{item.dueDate}}

                          </v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action >

                          <v-btn icon ripple @click="editItem(item)">
                           <v-icon color="grey lighten-1">info</v-icon>
                          </v-btn>
                          <!--<v-icon ><i class="material-icons" color="red">warning</i></v-icon>-->
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>

                </v-card>
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
            :myInformation="myInformation"
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
          today:new Date().getTime(),
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
          myInformation:{}

        }
      },
      created(){
        this.getUsers();
      },
      mounted(){
        this.myInfo();
        this.fetchData();
      },

      computed:{

        treelist(){
          let blocks = this.blocks;
          let newArr =[];
          for(let i = 0;i < blocks.length;i++){

            let block = blocks[i];

            block.children=[];
            //找到desc == null的节点 --- 根节点
            if(block.desc=="root"){
              newArr.push(block);
            }else{
             //有desc
              newArr = this.childrenIterator(newArr,block); //找到该父节点
            }
          }
          let tree = [{
            "name":"Project",
            "reference_id":"root",
            "children":newArr,
            "project":this.projectId
          }]
          let treeArr = new Tree(tree);
          return treeArr;
        },

        filterLists(){
          let lists = this.getMyBlocks(this.blocks);
          let search = this.search;
          let filterFolder = this.filterFolder;
          search =search.trim().toLowerCase();
          let newArr = [];

          if(filterFolder !=""){
            newArr = lists.filter((item)=>{
              return item.desc === filterFolder;
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

        myInfo(){
          let url = "api/user/info";

          getData(this,url,(data)=>{
            this.myInformation=data;
          })

        },
        getUsers(){
          let urlUser = "/api/user/all";
          getData(this,urlUser,(data)=> {
            //get all users' data
            this.users = data;
          });
        },

        fetchData:function() {

            // let url = "/api/project/involved/" + this.projectId + "?assets=1";
            //
            // getData(this, url, (data) => {
            //   let project = data;
            //   if (project.assets == undefined) {
            //     this.blocks = [];
            //   } else {
            //     let blocks = project.assets;
            //
            //     blocks = blocks.map((item) => {
            //
            //         item.startDate = this.convertLocalTime(item.startDateUTC);
            //         item.dueDate = this.convertLocalTime(item.dueDateUTC);
            //         item.ownerName = this.searchUserInfo(item.owner,"name");
            //         item.email = this.searchUserInfo(item.owner,"email");
            //         // item.labelDetail = this.getEditedItemLabel(item.label)
            //         item.children = this.getEditedItemChildren("task",item);
            //
            //         return item;
            //     })
            //     this.blocks = blocks;
            //   }
            //   console.log("fetch-DATA")
            // })

          //post find assets request
          let url = "/api/asset/find/of/"+this.projectId;
          let req = {
            query:{
              "project":this.projectId
            }
          }
          postData(this,url,req,(data)=>{
            let blocks = data;
            console.log(blocks)
            blocks = blocks.map((item) => {

              item.startDate = this.convertLocalTime(item.startDateUTC);
              item.dueDate = this.convertLocalTime(item.dueDateUTC);
              item.ownerName = this.searchUserInfo(item.owner,"name");
              item.children = this.getEditedItemChildren("task",item);
              return item;
            })
            this.blocks = blocks;
          })

        },

        getMyBlocks(assets){
          let arr = assets.filter((v)=>{
            return v.owner == this.myInformation._id;
          })
          return arr;
        },

        convertLocalTime(time){
          if(time==0 || time ==""){
            return null;
          }else{
            let date = new Date(time);
            let year = date.getFullYear(); // 获取完整的年份(4位,1970)
            let month = date.getMonth()+1; // 获取月份(0-11,0代表1月,用的时候记得加上1)
            let day = date.getDate(); // 获取日(1-31)

            return year+"-"+month+"-"+day;
          }
        },

        //用于 树 结构的查找子文件
        childrenIterator(arr,block) {

          arr.map((obj)=>{
            if(obj.reference_id == block.desc){
              if(block.deps!="root"){
               block.children=[];
              }
              obj.children.push(block);

            }else{
              this.childrenIterator(obj.children,block);
            }
          });
          return arr;
        },

        //拖动看板card 更新数据
        updateBlock: debounce(function (reference_id, status) {
          let url ="/api/asset/update/"+reference_id+"/of/"+this.projectId;
          console.log(url)

          let block = this.blocks.find( b => b.reference_id === Number(reference_id));
          block.status = status;

          if(status=="done"){
            block.checked = true;
          }else{
            block.checked = false;
          }
          if(block.desc ==null || block.desc==undefined) block.desc="root";
          console.log(block);
          postData(this,url,block)
        }, 500),

        // 点击树结构的文件夹，找到它的下一层 并在看板中筛选出子文件
        onClick(model) {
          // console.log(model)
          let pid = model.reference_id;
          if(pid =="root"){
            this.filterFolder = "root";
          }else{
            this.filterFolder = pid;
          }
        },

        editItem(item) {
          this.editedIndex = this.items.indexOf(item);
          this.editedItem = Object.assign({}, item);
          this.editedShow = true;

          this.editedItem.email = this.searchUserInfo(item.owner,"email");
          // this.editedItem.label = this.searchUserInfo(item.owner,"label")
          // this.editedItem.labelDetail = this.getEditedItemLabel(item.label)

          console.log(this.editedItem);
          console.log("edited")

        },
        getEditedItemChildren(target,current){

          let children;
          let pid;

          if(target === "project"){
            pid = current._id;
          }
          else if(target === "task"){
            pid = current.projectId;
          }

          let url="api/project/show/"+ pid +"?assets=1";
          getData(this,url,(data)=>{
            let assets = data.assets;
            if(target =="project"){
              children = assets.filter((item)=>{
                if(item.desc == "root") {
                  item.ownerName = this.searchUserInfo(item.owner,"name");
                  return item;
                }
              })
            }

            if(target == "task"){
              children = assets.filter((item) => {
                if (item.desc == current.reference_id ){
                  item.ownerName = this.searchUserInfo(item.owner,"name");
                  return item;
                }
              })
            }

            this.editedItem.children = children;
            return  this.editedItem;
          })

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
        getEditedItemLabel(labels){
          let that = this;
          //只有一个部门 标签

          let label = labels[0];
          let myLabels = that.myInformation.labels;
          let v = myLabels.find((item)=>{
            let name = item.name.trim().toLowerCase();
            if(name==label){

              return item
            }
          })
          return {
                "name":label.toUpperCase(),
                 "color":v.color

              }
        },
        searchUserInfo(id,target){
          let that = this;
          let users = that.users;

          for(let i=0;i<users.length;i++){
            if(id == users[i]._id){
              // console.log(id)
              if(target == "name"){
                // console.log(users[i].name)
                return users[i].name;
              }
              else if(target == "avater"){
                return  users[i].avater;
              }
              else if(target == "email"){
                return  users[i].email;
              }
              else if(target == "label"){

              }
            }
          }
        },

        enterGantt(){
          let projectId = this.projectId;
          this.$router.push({ path: `/gantt/${projectId}` }) // -> /gantt/:projectId
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
  .isDelay{
    background-color: red;
  }
</style>
