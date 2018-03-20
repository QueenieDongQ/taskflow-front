<template>
  <v-container fluid>
    <v-layout row>
      <v-flex xs2>
        <treelist></treelist>
      </v-flex>
      <v-flex xs10>
        <!--<board></board>-->
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>

  import Board from '@/components/Kanban/Board'
  import Treelist from './TreeList'
  export default {

    name: "my-task",
    components:{
        'board':Board,
        'treelist':Treelist
      },
      data(){
        return{

        }
      },
      created(){

      },
      methods:{

      }


  }
</script>

<style scoped>

</style>
