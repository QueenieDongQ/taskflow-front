<template>
  <div class="drag-container">
    <v-layout row class="drag-list">
      <v-flex xs4 v-for="stage in stages" class="drag-column" :class="{['drag-column-' + stage]: true}" :key="stage">

    			<span class="drag-column-header">
    				<h2>{{ stage }}</h2>
    			</span>
        <div class="drag-options"></div>
        <ul class="drag-inner-list" ref="list" :data-status="stage">
          <li class="drag-item" v-for="block in getBlocks(stage)" :data-block-id="block.reference_id" :key="block.reference_id">
            <slot :name="block.reference_id">

              <v-card class="drag-item">
                <v-card-title>{{ block.name }}</v-card-title>
                <v-card-text>{{ block.createDate }}</v-card-text>

                <!--<v-list fluid>-->
                  <!--<v-list-tile>-->
                    <!--<v-list-tile-content>-->
                      <!--<v-list-tile-title>{{block.name}}</v-list-tile-title>-->
                    <!--</v-list-tile-content>-->
                    <!--<v-list-tile-action>-->
                      <!--<v-btn icon ripple @click="editItem(block)">-->
                        <!--<v-icon color="grey lighten-1">info</v-icon>-->
                      <!--</v-btn>-->
                    <!--</v-list-tile-action>-->
                  <!--</v-list-tile>-->

                  <!--<div class="card-ft">-->
                    <!--{{ '计划完成时间' + block.createDate }}-->
                  <!--</div>-->
                <!--</v-list>-->
              </v-card>
            </slot>
          </li>
        </ul>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import dragula from 'dragula';
  export default {

      name: "kanban",
      props: {
        stages: {},
        blocks: {},
      },
      data() {
        return {
        };
      },
      computed: {
        localBlocks() {
          return this.blocks;
        },
      },
      methods: {
        getBlocks(status) {
          return this.localBlocks.filter(block => block.status === status);
        },
      },
      mounted() {
        dragula(this.$refs.list)
          .on('drag', (el) => {
            el.classList.add('is-moving');
          })
          .on('drop', (block, list) => {
            let index = 0;
            for (index = 0; index < list.children.length; index += 1) {
              if (list.children[index].classList.contains('is-moving')) break;
            }
            this.$emit('update-block', block.dataset.blockId, list.dataset.status, index);
          })
          .on('dragend', (el) => {
            el.classList.remove('is-moving');
            window.setTimeout(() => {
              el.classList.add('is-moved');
              window.setTimeout(() => {
                el.classList.remove('is-moved');
              }, 600);
            }, 100);
          });
      },
    };
</script>

<style>
  ul.drag-list, ul.drag-inner-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  .drag-column{
    list-style:none;
    height: 650px;
    overflow-y: auto;
    width: 100%;
    margin-right: 10px;
    padding: 10px;
    background-color: #EEEEEE;
    float:left;
    /*overflow: hidden;*/
  }
  .drag-column-header{
    text-indent: 24px;
    font-size: 16px;
    font-weight: 600;
    height: 40px;
    line-height: 40px;
  }
  .drag-inner-list {
    min-height: 50px;
    color: white;
  }

  .drag-item {
    padding: 10px;
    margin: 10px;
    height: 100px;
    background: rgba(0,0,0, 0.4);


  }
  drag-options {
    position: absolute;
    top: 44px;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 10px;
    transform: translateX(100%);
    opacity: 0;
  }
</style>
