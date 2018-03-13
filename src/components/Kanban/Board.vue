<template lang="html">
  <v-container fluid>
    <v-layout>

      <v-flex sm4 v-for="(list, zone) in dropzones" >

        <div class="panel">
          <div class="panel__heading">
            <h3>{{zone}}</h3>
          </div>
          <div class="panel__body">
            <vddl-list class="panel__body--list"
                       :list="list"
                       :inserted="inserted"
                       effect-allowed="move"
                       :disable-if="disable"
                       :external-sources="true">
              <list v-for="(item, index) in list"
                    :key="item.id"
                    :item="item"
                    :list="list"
                    :index="index"
                    :selected="handleSelected"
                    :selected-item="selectedItem"
                    :disable="disable"
                    >
              </list>
            </vddl-list>
          </div>
        </div>
      </v-flex>
    </v-layout>
    <!--<div>-->
      <!--<div class="col-md-12">-->
        <!--<div class="new-elements">-->
          <!--<div class="panel panel&#45;&#45;info">-->
            <!--<div class="panel__heading">-->
              <!--<h3>New Elements</h3>-->
            <!--</div>-->
            <!--<div class="panel__body">-->
              <!--<vddl-draggable class="button"-->
                              <!--:draggable="itemMock"-->
                              <!--:copied="copied"-->
                              <!--effect-allowed="copy">-->
                <!--Add Item-->
              <!--</vddl-draggable>-->
              <!--<br>-->
              <!--<vddl-draggable class="button"-->
                              <!--:draggable="containerMock"-->
                              <!--:copied="copied"-->
                              <!--effect-allowed="copy">-->
                <!--Add Container-->
              <!--</vddl-draggable>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="new-elements disable-element">-->
          <!--<div class="panel panel&#45;&#45;info">-->
            <!--<div class="panel__heading">-->
              <!--<h3>Toggle Disable</h3>-->
            <!--</div>-->
            <!--<div class="panel__body">-->
              <!--<div class="button" @click="toggleDisable">-->
                <!--Disable: {{disable}}-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="selected-item" v-if="selectedItem">-->
          <!--<div class="panel panel&#45;&#45;info">-->
            <!--<div class="panel__heading">-->
              <!--<h3>Selected</h3>-->
            <!--</div>-->
            <!--<div class="panel__body">-->
              <!--{{selectedItem.type}} {{selectedItem.id}}-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="ashcan">-->
          <!--<div class="panel panel&#45;&#45;info">-->
            <!--<div class="panel__heading">-->
              <!--<h3>Ashcan</h3>-->
            <!--</div>-->
            <!--<vddl-list :list="[]" class="panel__body">-->

            <!--</vddl-list>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->

    <!--</div>-->
  </v-container>

</template>

<script>

  import list from './List.vue';

  export default {
    data() {
      return {
        selectedItem: null,
        itemMock: { type: "new element", id: 1 },
        containerMock: {
          "type": "container",
          "id": 4,
          "columns": []
        },
        disable: false,
        dropzones: {
          "TO DO": [
            {
              "type": "item",
              "id": "id1",
            },
            {
              "type": "item",
              "id": "4"
            },
            {
              "type": "item",
              "id": "5"
            },
            {
              "type": "item",
              "id": "6"
            }
          ],
          "IN PROGRESS": [
            {
              "type": "item",
              "id": 7
            },
            {
              "type": "item",
              "id": "8"
            },
            {
              "type": "item",
              "id": "id2",
            },
            {
              "type": "item",
              "id": "9"
            },
            {
              "type": "item",
              "id": "10"
            },
            {
              "type": "item",
              "id": "id3",
            },
            {
              "type": "item",
              "id": "13"
            },
            {
              "type": "item",
              "id": "14"
            }

          ],
          "DONE":[
            {
              "type": "item",
              "id": "id16"
            },
            {
              "type": "item",
              "id": "id17"
            }
          ]
        },
        drawer: true,
        items: [
          { title: 'Home', icon: 'dashboard' },
          { title: 'About', icon: 'question_answer' }
        ],
        right: null,
        gates:[
          {name:"gate1",url:""},
          {name:"gate2",url:""},
          {name:"gate3",url:""},
          // {name:"gate4",url:""}
        ]
      }


    },
    methods: {
      copied(item){
        item.id++;
      },
      inserted(data){
        console.log(data);
      },
      toggleDisable() {
        this.disable = !this.disable;
      },
      handleSelected(item) {
        this.selectedItem = item;
      }
    },
    components: {
      list
    }
  };
</script>

<style lang="less">
  /*@import './src/style/_var.less';*/

  .vddl-placeholder {
    width: 100%;
    min-height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #eee;
    padding: 0 15px;
    background: #f5f5f5;
  }

  /* new-elements */
  .new-elements .button{
    border: 1px solid #42B983;
    text-align: center;
    height: 40px;
    border-radius: 4px;
    line-height: 40px;
    background-color: #42B983;
    color: #fff;
    cursor: move;
    font-size: 14px;
  }

  .new-elements .vddl-dragging-source {
    display: block;
  }

  .disable-element .button{
    background-color: #E32822;
    border: 1px solid #E32822;
    cursor: pointer;
  }

  .selected{
    background: #f9f9f9;
  }

  .selected-item .panel__body {
    line-height: 40px;
  }

  .ashcan{
    .ashcan-logo{
      display: block;
      width: 40px;
      margin: 10px auto;
    }
    .vddl-placeholder {
      display: none;
    }
  }
</style>

<!--<script>-->
  <!--import draggable from 'vuedraggable'-->
  <!--import SingleCard from './SingleCard'-->
  <!--const message = [ 'vue.draggable', 'draggable', 'component', 'for', 'vue.js 2.0', 'based' , 'on', 'Sortablejs' ]-->
  <!--const message2 = [ 'test-2', 'try-2', 'let-2', ]-->
  <!--export default {-->
    <!--name: 'board',-->
    <!--components: {-->
      <!--draggable,-->
      <!--SingleCard,-->

    <!--},-->
    <!--data () {-->
      <!--return {-->
        <!--list: message.map( (name,index) => {return {name, order: "l1"+(index+1), fixed: false}; }),-->
        <!--list2:message2.map( (name,index) => {return {name, order: "l2"+(index+1), fixed: false}; }),-->
        <!--list3:[],-->
        <!--stage:[-->
          <!--{id:"todo",text:"TO DO"},-->
          <!--{id:"onhold",text:"ON HOLD"},-->
          <!--{id:"done",text:"DONE"}],-->
        <!--lists:[-->
          <!--{-->
            <!--id:0, text:'vue.draggable',state:'todo'-->
          <!--}, {-->
            <!--id:1, text:'draggable',state:'onhold'-->
          <!--}, {-->
            <!--id:2, text:'component',state:'done'-->
          <!--}, {-->
            <!--id: 3, text: 'for',state:'onhold'-->
          <!--}-->
        <!--],-->
        <!--isShow:false,-->
        <!--editable:true,-->
        <!--isDragging: false,-->
        <!--delayedDragging:false-->
      <!--}-->
    <!--},-->
    <!--methods:{-->
      <!--orderList () {-->
        <!--this.list = this.list.sort((one,two) =>{return one.order-two.order; })-->
      <!--},-->
      <!--onMove ({relatedContext, draggedContext}) {-->
        <!--const relatedElement = relatedContext.element;-->
        <!--const draggedElement = draggedContext.element;-->
        <!--return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed-->
      <!--},-->
      <!--showlDialog(data){-->
        <!--console.log(data)-->
        <!--if(data == 'false'){-->
          <!--this.isShow = false;-->
        <!--}else{-->
          <!--this.isShow = true;-->
        <!--}-->
        <!--console.log(this.isShow)-->
      <!--},-->

    <!--},-->
    <!--computed: {-->
      <!--dragOptions () {-->
        <!--return  {-->
          <!--animation: 0,-->
          <!--group: 'description',-->
          <!--disabled: !this.editable,-->
          <!--ghostClass: 'ghost'-->
        <!--};-->
      <!--},-->
      <!--listString(){-->
        <!--return JSON.stringify(this.list, null, 2);-->
      <!--},-->
      <!--list2String(){-->
        <!--return JSON.stringify(this.list2, null, 2);-->
      <!--}-->
    <!--},-->
    <!--watch: {-->
      <!--isDragging (newValue) {-->
        <!--if (newValue){-->
          <!--this.delayedDragging= true-->
          <!--return-->
        <!--}-->
        <!--this.$nextTick( () =>{-->
          <!--this.delayedDragging =false-->
        <!--})-->
      <!--}-->
    <!--}-->
  <!--}-->

<!--</script>-->

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
