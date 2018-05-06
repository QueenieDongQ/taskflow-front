<template>

    <v-layout row style="margin: 10px">

      <v-flex xs4 style="float:left;margin-right: 10px">
          <inbox :bigData="bigData"
                 :users="users"
                 :myInformation="myInformation"></inbox>
      </v-flex>

      <v-flex xs8>
        <v-card>
          <v-layout row >

            <v-flex xs3 style="margin-left: 20px">
              <v-list subheader>
                <v-subheader inset>Projects</v-subheader>
                <v-list-tile avatar v-for="item in bigData" :key="item._id" @click="getSearchProject(item._id,item.name)">
                  <v-list-tile-avatar>
                    <v-icon >folder_open</v-icon>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.name}}</v-list-tile-title>
                  </v-list-tile-content>

                </v-list-tile>
              </v-list>
            </v-flex>

            <v-flex xs9>
              <v-layout row>
                <v-flex xs4>
                  <v-btn
                        color="secondary"
                        @click="getSearchType('me')"> 我 </v-btn>
                </v-flex>
                <v-flex xs4>
                  <v-btn
                        color="secondary"
                        @click="getSearchType('department')"> 我的部门 </v-btn>
                </v-flex>
                <v-flex xs4>
                  <v-btn
                        color="secondary"
                        @click="getSearchType('all')"> 所有 </v-btn>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <dashboard ref="child"
                             :myInformation="myInformation"
                             :bigData="bigData"
                             :users="users"
                             style="float:left"
                             :searchID = "searchID"
                             :searchType = "searchType"
                             :searchName = "searchName"
                  ></dashboard>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>

      </v-flex>
    </v-layout>
</template>

<script>
  import Dashboard from '../Inbox/Dashboard'
  import Inbox from '../Inbox/Inbox'

    export default {
      name: "Home",
      components:{
       "dashboard":Dashboard,
       "inbox":Inbox
      },
      data(){
        return{
          myInformation:{},
          bigData:[],
          items: [
            {
              icon: 'folder_open',
              text: '查看我的项目',
              model: false,
              value: 'projectId',
            },
          ],
          searchID:"",
          searchName:"",
          searchType:"me",
          users:[]
        }
      },
      computed:{

      },
      beforeCreate(){

      },
      created(){
      },
      mounted() {
        let that =this;
        that.myInfo();
        that.getUsers();
        that.fetchData();
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
          let url_member ="/api/project/involved?type=member";
          this.fetchInvolved(url_involved).then((data1)=>{
            bigData.push(...data1);
            this.fetchInvolved(url_member).then((data2)=>{
              bigData.push(...data2);
              let n = bigData.length;
              bigData.forEach((project) => {

                // fetch
                this.fetchAssets(project, () => {
                  n -= 1;
                  if(n===0) {
                    // console.log(bigData);
                    this.bigData = bigData;
                    this.initDashboard();
                  }
                });
              })
            })
          })
        },

        getBigData(url,callback){
          getData(this,url,(data)=>{
            callback(data)
          })
        },

        fetchInvolved(url){

          return new Promise((processBigData)=>{
            this.getBigData(url,(result)=>{
              processBigData(result)
            })
          })
        },

        initDashboard(){

          this.searchID = this.bigData[0]._id;

          this.$refs.child.initData(this.searchID,this.searchType,this.bigData);
        },

        fetchAssets(project, callback){
          // let result = projects.map((project)=>{
            let pid = project._id;
            let url = "/api/asset/find/of/"+pid+"?limit=100";
            let req={
              query:{
                "project":pid
              }
            }
            postData(this,url,req,(data)=>{
              project.assets = data;
              if(callback) {
                callback()
              }
            })
          // })
        },

        getSearchProject(id,name){

          this.searchID = id;
          this.searchName = name;

          this.$refs.child.initData(this.searchID,this.searchType,this.bigData);
        },

        getSearchType(type){
          this.searchType = type;
          this.$refs.child.initData(this.searchID,this.searchType,this.bigData);
        }


      }
    }
</script>

<style scoped>

</style>
