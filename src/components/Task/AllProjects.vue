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
                       :search="search"
                       :loading:="loading">

          <template slot="items" slot-scope="props">
            <td>
              <span style="font-size: 17px" >
                <router-link :to="`/projects/${props.item._id}`">
                    <v-icon class="">folder</v-icon>{{ props.item.name }}
                </router-link>
              </span>
              <v-chip small outline color="green" v-if="props.item.startDate!=null">{{ props.item.startDate }}</v-chip>
              <v-chip small outline color="red" v-if="props.item.dueDate!=null" >{{ props.item.dueDate }}</v-chip>
            </td>
            <td class="text-xs-right">{{ props.item.ownerName }}</td>
            <td class="text-xs-right">{{ props.item.localDate }}</td>
            <!--<td class="text-xs-right"><span v-if="props.item.modifyDateUTC >0 ">{{ props.item.modifyDate }}</span></td>-->
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
        <v-dialog v-model="editedShow"
                  transition="dialog-bottom-transition"
                  :overlay="false"
                  max-width="500px"
                  scrollable class="editDialog">
          <card target="project"
                :myInformation="myInformation"
                :editedItem = "editedItem"
                :editedShow = "editedShow"
                :users="users"
                v-on:changeShow="closeDialog"
                @refreshData="fetchData"></card>

        </v-dialog>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  Date.prototype.format = function (fmt) { //author: meizz
    var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
  import Card from '../Kanban/Card'
    export default {
      name: "all-task-lists",

      components:{
        'card':Card
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
              value:'ownerName',
              width:'10%',
            },
            {
              text:'Created',
              align:'center',
              sortable:true,
              value:'createDate',
              width:'10%',
            },
            // {
            //   text:'Modified',
            //   align:'center',
            //   sortable:true,
            //   value:'modifyDate',
            //   width:'15%',
            // },
            {
              text:'Infomation',
              align:'center',
              value:'name',
              sortable:false,
              width:'10%',
            }

          ],
          loading:false,
          search:'',
          myInformation:{},
          users:[],
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
          labelMenu:true,
          allLabels:[],
          selectedLabels:[],

        }
      },
      computed: {

      },

      watch: {

      },

      created(){
        this.myInfo();
        this.getUsers();
        console.log("created")
      },
      mounted() {
        this.fetchData();
        console.log("mounted")

      },

      methods:{
        myInfo(){
          let url = "api/user/info";
          getData(this,url,(data)=>{
            this.myInformation=data;
          })
        },

        getUsers(){
          let url ="/api/user/all";
          getData(this,url,(data)=>{
            this.users=data;
          })
        },

        fetchData(callback = undefined) {
            //get projects data
            let bigData = [];
            let url_involved = "/api/project/involved";
            let url_member ="/api/project/involved?type=member"
            getData(this,url_involved,(data)=>{
              bigData.push(...data);

              getData(this,url_member,(data)=>{
                bigData.push(...data);
                this.items = this.processData(bigData);
                console.log("fetch")
              })
            });
        },

        processData(data){

          let items = data;
            for (let i = 0; i < items.length; i++) {
              let item = items[i];
              //transfer time stick to local time
              let localDate = this.convertLocalTime(item.createDate);
              item.localDate = localDate;
              item.modifyDate = new Date(item.modifyDateUTC).format("yyyy-MM-dd hh:mm:ss");
              //transfer owner to ownerName
              let owner_id = item.owner;
              item.ownerName = this.searchUserInfo(owner_id, "name");
              item.email = this.searchUserInfo(owner_id, "email");
              item.startDate = this.convertLocalTime(item.startDateUTC);
              item.dueDate = this.convertLocalTime(item.dueDateUTC);
              item.membersInfo = this.getEditedItemMembers(item.members);

              items[i] = item
            }
            return items;
        },

        convertLocalTime(time){
          if(time==0 || time =="" || time ==null){
            return null;
          }else{
            let date = new Date(time);
            let year = date.getFullYear(); // 获取完整的年份(4位,1970)
            let month = date.getMonth()+1; // 获取月份(0-11,0代表1月,用的时候记得加上1)
            let day = date.getDate(); // 获取日(1-31)

            return year+"-"+month+"-"+day;
          }
        },

        searchUserInfo(id,target){

          let that = this;
          let users = that.users;

          for(let i=0;i<users.length;i++){
            if(id == users[i]._id){
              if(target == "name"){
                // console.log(users[i].name)
                  return users[i].name;
              }
              else if(target == "avater"){
                  return  users[i].avater;
              }
              else if(target == "department"){
                return  users[i].department;
              }
              else if(target == "email"){
                return  users[i].email;
              }
            }
          }
        },

        editItem (item) {

          this.editedIndex = this.items.indexOf(item);
          this.editedItem = Object.assign({}, item);
          this.editedShow = true
          this.editedItem.children = this.getEditedItemChildren("project",item);
          this.editedItem.labelDetail = this.getEditedItemLabel(item.label);
          console.log(this.editedItem);
          console.log("edited")
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
          let that = this;console.log(labels);
          //只有一个部门 标签
          let label = labels[0];
          let myLabels = that.myInformation.labels;
          let v = myLabels.find((item)=>{
            let name = item.name.trim().toLowerCase();
            if(name==label)return item

          })
          return {
            "name":label.toUpperCase(),
            "color":v.color
          }
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
                if (item.desc == current.reference_id ) {
                  item.ownerName = this.searchUserInfo(item.owner,"name");
                  return item;
                }
              })
            }
            console.log("children")
            this.editedItem.children = children;
            return  this.editedItem;
          })

        },
        createProject(){
          // let that = this;
          let project =this.project;

          this.project ={
            "name": project.name,
            "code": project.code,
            "client":project.client,
            "partNumber":project.partNumber,
            "createDate" :new Date().getTime(),
            "startDateUTC" :0,
            "dueDateUTC" :0,
            "modifyDateUTC" :new Date().getTime(),
            "members":[],
            "checked":false,
            "label":[
              this.myInformation.department
            ],
            "status":"todo",
            "children":[],
            "history_pn":[{
              "partNumber":project.partNumber,
              "date":new Date().getTime()
            }],
            "history_c":[]
          }
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
          delete item.membersInfo;

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
          let id=[];
          for(let i=0;i<members.length;i++){
            id[i]=members[i]._id;
          }

          let urlAdd = "/api/project/"+pid+"/member/add";

          postData(this,urlAdd,id,()=> {
            this.fetchData( (d)=>{
              let items = d;
              this.items = items;
              this.editedItem.members=this.items[that.editedIndex].members;
            });
          });
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
          });
        },

        // remove (item) {
        //
        //   let that = this;
        //   let labels = that.allLabels;
        //   let index = labels.indexOf(item);
        //   labels[index].selected = false;
        //   console.log(labels);
        //   // this.allLabels = labels;
        // },
        closeDialog(msg){
          this.editedShow = msg;
          console.log(msg)
          console.log("changeshow")
        }

      }

    }

</script>

<style scoped>

  .time{

  }
</style>
