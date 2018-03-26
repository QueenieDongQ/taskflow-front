<template>
  <li>
    <div
      :class="{bold: isFolder}"
      @click="toggle"
      @dblclick="changeType">
      {{ model}}
      <span v-if="isFolder">[{{ open ? '-' : '+' }}]</span>
    </div>
    <ul v-show="open" v-if="isFolder">
      <item
        class="item"
        v-for="(model, index) in model.children"
        :key="index"
        :model="model">
      </item>
      <li class="add" @click="addChild">+</li>
    </ul>
  </li>
</template>

<script>
    export default {
        name: "tree",
        props:['dataList'],
        data(){
          return{

          }
        },

        computed:{
          model(){
            let lists = this.dataList;
            for(let i=0;i<lists.length;i++){
              let status = lists[i].status;
              let items = lists[i].items;

              for(let j=0;j<items.length;j++){
                let refer_id = items[j].reference_id;

              }
            }

          }
        },

        methods:{


        },



    }
</script>

<style scoped>

</style>
