<template>

    <v-layout row style="margin: 10px">

      <v-flex xs4 style="float:left;margin-right: 10px">
        <v-card>
          <inbox :bigData="bigData" :myInformation="myInformation"></inbox>
        </v-card>
      </v-flex>

      <v-flex xs8 >
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
                  <dashboard :myInformation="myInformation"
                             :bigData.sync="bigData"
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
          searchType:"me"
        }
      },
      computed:{

      },
      beforeCreate(){

      },
      created(){
        let that =this;
        that.myInfo();
        that.fetchData();
      },
      mounted() {
        alert("");
      },
      methods:{
        myInfo(){
          let url = "api/user/info";
          getData(this,url,(data)=>{
            this.myInformation=data;
          })
        },
        fetchData(callback = undefined) {
          //get projects data
          let bigData = [];
          let url_involved = "/api/project/involved";
          let url_member ="/api/project/involved?type=member"
          getData(this,url_involved,(data)=>{
            bigData.push(...data);
            // console.log(this.bigData)
            getData(this,url_member,(data)=>{
              bigData.push(...data);

              this.fetchAssets(bigData);
              this.bigData = bigData;
              this.searchID = bigData[0]._id;
              // console.log(this.bigData)
              console.log("fetchHome")
            })
          });
        },
        fetchAssets(projects){
          let result = projects.map((project)=>{
            let pid = project._id;
            let assets;
            let url = "/api/project/involved/" + pid + "?assets=1";
            getData(this,url,(data)=>{
              project.assets = data.assets;
              // console.log(data.assets)
              return project;
          })
        })
          return result;
        },
        getSearchProject(id,name){

          this.searchID = id;
          this.searchName = name;
          console.log(this.searchID )
        },
        getSearchType(type){
          this.searchType = type;
          console.log(this.searchType )
        }


      }
    }
</script>

<style scoped>

</style>
