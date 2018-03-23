<template>
  <v-card @dragstart="drag" v-dragable draggable="true">
    <v-list fluid>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>{{data.name}}</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn icon ripple @click="editItem(data)">
            <v-icon color="grey lighten-1">info</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>

    <div class="card-ft">
      {{ '计划完成时间' + data.targetTime }}
    </div>
  </v-list>

  </v-card>

</template>
<script>
  export default {
    name: 'card',
    props: ['data', 'index', 'innerIndex'],
    components:{

    },
    data(){
      return{
        editedItem:{},
        editedShow:false,
      }
    },
    directives: {
      dragable: {
        inserted: (el) => {
          el.addEventListener('selectstart', (ev) => {
            ev.preventDefault()
          })
        }
      }
    },
    methods: {
      drag (ev) {
        ev.dataTransfer.effectAllowed = 'move'
        ev.dataTransfer.setData('index', this.index)
        ev.dataTransfer.setData('innerIndex', this.innerIndex)
      },

      editItem(item){
        console.log(item);

        this.editedItem = item;
        this.editedShow = true;
        this.$emit("listenEditItem",{"itemInfo":this.editedItem,"show":this.editedShow});
      }
    }
  }
</script>
<style lang="css">
  .card{
    background-color: #fff;
    border-radius: 5px;
    padding: 10px 15px;
    margin-bottom: 10px;
  }
  .card-bd{
    font-size: 14px;
    width: 80%;
  }
  .card-ft{
    color: #888;
    text-align: right;
    font-size: 12px;
    margin-top: 10px;
  }
</style>

