<template lang="html">
<div>
    <v-dialog
      v-model="dialogShow"
      transition="dialog-bottom-transition"
      :overlay="false"
      scrollable
      justify-center
      full-width
      class="cardDialog"

    >
      <v-card tile>
        <v-toolbar card dark color="primary">
          <v-btn icon @click.native="dialogShow = false" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title><input v-model="cardInfo.name" value="cardInfo.name"/></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click.native="dialogShow = false">Save</v-btn>
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
            <div v-model="cardInfo.department"></div>
            <v-btn
              light
              bottom
              right
              flat
              icon
            ><v-icon>add</v-icon></v-btn>
          </v-flex>

          <v-flex xs3>
            <div v-model="cardInfo.member"></div>
            <v-btn
              light
              bottom
              right
              flat
              icon
            ><v-icon>add</v-icon></v-btn>
          </v-flex>

          <v-flex xs3>
            <v-text-field type="date" style="width: 150px" v-model="cardInfo.startDate" value="cardInfo.startDate"/>
          </v-flex>

          <v-flex xs3>
            <v-text-field type="date" style="width: 150px" v-model="cardInfo.dueDate" value="cardInfo.dueDate"/>
          </v-flex>
        </v-layout>

        <v-layout>
          <v-flex xs2>
            <v-subheader>Description</v-subheader>
          </v-flex>
          <v-flex xs10>
            <v-text-field
              v-model="cardInfo.description"
              value="cardInfo.description"
              multi-line
              style="width: 100%"/>
          </v-flex>
        </v-layout>

          <v-divider></v-divider>
          <v-layout>
            <v-flex>
              <checklist class="item"
                         :treeList="treeData"></checklist>
            </v-flex>
          </v-layout>
        </v-card-text>


      </v-card>
    </v-dialog>
  </v-layout>
</div>
</template>
<script>
  import Layout from "../../views/layout/components/Layout";
  import Checklist from "./Checklist"
  export default {
    components: {
      Layout,
      "checklist":Checklist,
    },
    props:['isShow'],
    data () {
      return {
        dialogShow:this.isShow,
        notifications: false,
        sound: true,
        widgets: false,
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
        cardInfo:
          {
            id:"cd1",
            name:"cdName",
            startDate:"2018-02-02",
            dueDate:"2018-02-03",
            description:"text1",
          },
        treeData:[
          {
            id:"clist1",
            name: 't2',
            children: [
              {name: 'child folder',},
              {name: 'dsews',},
            ]
          },
          {
           id:"clist2",
            name: 't1',
            children: [
              {name: 'childsd',}
            ]
          },
        ]
      }
    },
    computed:{

    },

  }
</script>
<style>
  .cardDialog{
    width: 400px;

  }

</style>
