<template>
  <v-layout scrollable>
    <v-flex xs12>
      <v-list>
        <v-list two-line subheader>
          <v-subheader>收件箱</v-subheader>
          <v-list-tile avatar>
            <v-list-tile-action>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{filterProgress}}</v-list-tile-title>
              <v-list-tile-sub-title>Allow notifications</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <v-list two-line subheader>

          <v-subheader>正在进行中</v-subheader>
          <template v-for="(item, index) in filterProgress">
            <v-list-tile avatar>
              <v-list-tile-action>
                <v-checkbox></v-checkbox>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{item.name}}</v-list-tile-title>
                <v-list-tile-sub-title>Allow notifications</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
            <v-pagination :length="6" v-model="page"></v-pagination>

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
          let length = this.bigData.length;
          let result=[];
          if(length>0){
            for(let i =0;i<length;i++) {
              let item = this.bigData[i];
              let progressData = item.filter((v) => {
                if (v.status == "progress" && v.owner == this.myInforamtion._id) {
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
            console.log(result)
          }
          return result;
        }

      },
      methods:{

      }
    }
</script>

<style scoped>

</style>
