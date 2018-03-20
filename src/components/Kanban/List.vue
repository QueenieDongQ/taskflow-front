<template lang="html">
  <v-layout column>
    <singlecard v-if="isShow"
                @close.stop="isShow = false"
                :isShow = "isShow"></singlecard>
    <v-flex xs12>
      <vddl-draggable class="panel__body--item"
                      :draggable="item"
                      :index="index"
                      :disable-if="disable"
                      :selected="selectedEvent"
                      :wrapper="list"
                      v-bind:class="{'selected': selectedItem === item}"
      >

        <v-card style="width:100%;">

             <v-card-title>{{item.type}} {{item.id}}</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn icon
                   @click="isShow == true"
                   ><v-icon>edit</v-icon></v-btn>
          </v-card-actions>
        </v-card>
      </vddl-draggable>
    </v-flex>
  </v-layout>

</template>

<script>
 import singlecard from './SingleCard'
  export default {
    name: 'list',
    props: ['item', 'list', 'index', 'selected', 'selectedItem', 'disable'],
    components: {
      singlecard
    },
    data(){
      return{
        isShow:false,
      }

    },
    methods: {
      selectedEvent(item){
        if (typeof(this.selected) === 'function') {
          this.selected(item);
        }
      },

    },

  };
</script>
<style>

</style>

