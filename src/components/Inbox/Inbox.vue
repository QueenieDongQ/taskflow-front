<template>
  <v-layout scrollable>
    <v-flex xs12>
      <v-list scrollable>
        <v-list two-line subheader>
          <v-subheader>收件箱</v-subheader>
          <v-list-tile avatar>
            <v-list-tile-action>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{}}</v-list-tile-title>
              <v-list-tile-sub-title>Allow notifications</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <v-list two-line subheader>

          <v-subheader>正在进行中</v-subheader>
          <v-expansion-panel popout>
            <v-expansion-panel-content
            v-for="(item,index) in filterProgress" :key="index">
            <!--<template v-for="item in filterProgress" scrollable>-->
            <!--<v-subheader>{{item.name}}</v-subheader>-->
              <div slot="header">{{item.name}}</div>
            <!--<template >-->
              <v-list>
              <v-list-tile avatar v-for="(list,subindex) in item.data" :key="subindex">
                <v-list-tile-action>
                  <v-checkbox v-model="list.checked"></v-checkbox>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{list.name}}</v-list-tile-title>
                  <v-list-tile-sub-title></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              </v-list>
            <!--</template>-->
          <!--</template>-->
            </v-expansion-panel-content>
          </v-expansion-panel>
            <!--<v-pagination :length="6" v-model="page"></v-pagination>-->

        </v-list>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
    export default {
      name: "Inbox",
      props:{
        bigData:{
          type:Array,
        },
        myInformation:{
          type:Object
        }
      },
      data(){
          return{
            page:1,


          }
      },
      computed:{
        filterProgress(){
          console.log(this.bigData)

          console.log("inbox")
          let length = this.bigData.length;
          let result=[];
          if(length>0){
            for(let i =0;i<length;i++) {
              let item = this.bigData[i];
              console.log(item);
              let progressData = [];
              progressData = item.assets.filter((v) => {
                if (v.status === "progress" && v.owner == this.myInformation._id) {
                    console.log(v)
                    return v;
                  }
                })
              result[i]={
                "name":item.name,
                "_id":item._id,
                "data":progressData
              }
            }
          }
            console.log(result)

          return result;
        }

      },
      methods:{

      }
    }
</script>

<style scoped>

</style>
