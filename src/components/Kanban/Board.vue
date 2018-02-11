<template>
  <div class="fluid container">

    <div  class="col-md-3">
      <draggable class="list-group" element="ul" v-model="list" :options="dragOptions" :move="onMove" @start="isDragging=true" @end="isDragging=false">
        <transition-group type="transition" :name="'flip-list'">
          <li v-for="element in list" :key="element.order">
            <v-card>
              <v-card-title>
                {{element.name}}
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <v-btn flat><v-icon>edit</v-icon></v-btn>
              </v-card-actions>
            </v-card>
          </li>
        </transition-group>
      </draggable>
    </div>

    <div  class="col-md-3">
      <draggable element="span" v-model="list2" :options="dragOptions" :move="onMove">
        <transition-group name="no" class="list-group" tag="ul">
          <li v-for="element in list2" :key="element.order">
            <v-card>
              <v-card-title>
                {{element.name}}
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-spacer></v-spacer>
                <v-btn flat><v-icon>edit</v-icon></v-btn>
              </v-card-actions>
            </v-card>
          </li>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  const message = [ 'vue.draggable', 'draggable', 'component', 'for', 'vue.js 2.0', 'based' , 'on', 'Sortablejs' ]
  const message2 = [ 'test-2', 'try-2', 'let-2', ]
  export default {
    name: 'board',
    components: {
      draggable,
    },
    data () {
      return {
        list: message.map( (name,index) => {return {name, order: index+1, fixed: false}; }),
        list2:message2.map( (name,index) => {return {name, order: index+1, fixed: false}; }),
        list3:[],
        stage:[
          {id:"todo",text:"TO DO"},
          {id:"on_hold",text:"ON HOLD"},
          {id:"done",text:"DONE"}],
        editable:true,
        isDragging: false,
        delayedDragging:false
      }
    },
    methods:{
      orderList () {
        this.list = this.list.sort((one,two) =>{return one.order-two.order; })
      },
      onMove ({relatedContext, draggedContext}) {
        const relatedElement = relatedContext.element;
        const draggedElement = draggedContext.element;
        return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      }
    },
    computed: {
      dragOptions () {
        return  {
          animation: 0,
          group: 'description',
          disabled: !this.editable,
          ghostClass: 'ghost'
        };
      },
      listString(){
        return JSON.stringify(this.list, null, 2);
      },
      list2String(){
        return JSON.stringify(this.list2, null, 2);
      }
    },
    watch: {
      isDragging (newValue) {
        if (newValue){
          this.delayedDragging= true
          return
        }
        this.$nextTick( () =>{
          this.delayedDragging =false
        })
      }
    }
  }
</script>

<style>
  .flip-list-move {
    transition: transform 0.5s;
  }
  .no-move {
    transition: transform 0s;
  }
  .ghost {
    opacity: .5;
    background: #C8EBFB;
  }
  .list-group {
    min-height: 20px;
  }
  .list-group-item {
    cursor: move;
  }
  .list-group-item i{
    cursor: pointer;
  }
</style>
