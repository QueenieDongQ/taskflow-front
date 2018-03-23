<template>
  <v-container fluid>
    <v-layout row>
      <v-flex xs2>
        <!--<treelist></treelist>-->
      </v-flex>
      <v-flex xs10>
        <v-container fluid>
          <v-layout row wrap>
            <v-flex xs12>
              <v-text-field v-model="search"
                            append-icon="search"
                            label="Search"
                            single-line
                            hide-details></v-text-field>
            </v-flex>
            <v-flex xs4 v-for="(list, index) in lists" :key="index">
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
          <!--<singlecard :isShow="editedShow" :data="editedItem"></singlecard>-->
        </v-container>
      </v-flex>
    </v-layout>

    <v-dialog
      v-model="editedShow"
      transition="dialog-bottom-transition"
      :overlay="false"
      scrollable
      justify-center
      full-width
      class="cardDialog"

    >
      <v-card tile>
        <v-toolbar card dark color="primary">
          <v-btn icon @click="editedShow=false" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title><input v-model=" editedItem.name" value=" editedItem.name"/></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="editedShow=false">Save</v-btn>
          </v-toolbar-items>
          <v-menu bottom right offset-y>
            <v-btn slot="activator" dark icon>
              <v-icon>more_vert</v-icon>
            </v-btn>
            <v-list>
              <v-list-tile v-for="(item, i) in items" :key="i" @click="">
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-toolbar>
        <v-card-text>

          <v-layout row>
            <v-flex xs3>
              <v-subheader>Department</v-subheader>
            </v-flex>
            <v-flex xs3>
              <v-subheader>Member</v-subheader>
            </v-flex>
            <v-flex xs3>
              <v-subheader>Start Date</v-subheader>
            </v-flex>
            <v-flex xs3>
              <v-subheader>Due Date</v-subheader>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs3>
              <div v-model=" editedItem.department"></div>
              <v-btn
                light
                bottom
                right
                flat
                icon
              ><v-icon>add</v-icon></v-btn>
            </v-flex>

            <v-flex xs3>
              <div v-model=" editedItem.member"></div>
              <v-btn
                light
                bottom
                right
                flat
                icon
              ><v-icon>add</v-icon></v-btn>
            </v-flex>

            <v-flex xs3>
              <v-text-field type="date" style="width: 150px" v-model=" editedItem.startDate" value=" editedItem.startDate"/>
            </v-flex>

            <v-flex xs3>
              <v-text-field type="date" style="width: 150px" v-model=" editedItem.dueDate" value=" editedItem.dueDate"/>
            </v-flex>
          </v-layout>

          <v-layout>
            <v-flex xs2>
              <v-subheader>Description</v-subheader>
            </v-flex>
            <v-flex xs10>
              <v-text-field
                v-model=" editedItem.description"
                value=" editedItem.description"
                multi-line
                style="width: 100%"/>
            </v-flex>
          </v-layout>

          <v-divider></v-divider>
          <v-layout>
            <v-flex>
              <!--<checklist class="item"-->
              <!--:treeList="treeData"></checklist>-->
            </v-flex>
          </v-layout>
        </v-card-text>


      </v-card>
    </v-dialog>
  </v-container>

</template>

<script>

  import Board from '@/components/Kanban/Board'
  import Card from '@/components/Kanban/Card'

  import Treelist from './TreeList'

  export default {

    name: "my-task",
    components:{
        'board':Board,
        'card':Card,
        'treelist':Treelist
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

                },
                {
                  "name":"urtut",

                }
              ]
            },
            {
              "status":"In Progress",
              "items":[
                {
                  "name":"errrst",

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
        }
      },

      created(){

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
        }

      }


  }
</script>

<style scoped>
  * {
    margin:0px;
    padding: 0px;
    box-sizing: border-box;
  }
  html,body{
    height: 100%;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100%;
  }
</style>
