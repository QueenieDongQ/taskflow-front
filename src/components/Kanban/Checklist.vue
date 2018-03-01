<template lang="html">
  <ul>
    <!--<li>-->
      <!--<div-->
        <!--:class="{bold: isFolder}"-->
        <!--@click="toggle"-->
        <!--@dblclick="changeType">-->
        <!--{{ treeList.name }}-->
        <!--<span v-if="isFolder">[{{ open ? '-' : '+' }}]</span>-->
      <!--</div>-->
      <!--<ul v-show="open">-->
        <!--<li v-for="(model, index) in treeList"-->
          <!--class="item"-->
          <!--:key="index">-->
        <!--<span><input class="checkbox" type="checkbox">{{model.name}} - {{key}}</span>-->
        <!--</li>-->
        <!--<li class="add" @click="addChild">+</li>-->
      <!--</ul>-->
    <!--</li>-->
    <!--<li class="add" @click="addChild">+</li>-->

    <li v-for="(tree, index) in treeList">
      <div
      :class="{bold: isFolder}"
      @click="toggle"
      >
        <v-subheader>{{ tree.name }}</v-subheader>
        <span v-if="isFolder">[{{ open ? '-' : '+' }}]</span>
      </div>
      <ul>
        <li v-for="treenode in tree.children">
          <input type="checkbox" value="treenode.name"/>
        </li>
        <li>
          <!--<button @click="addChild()">+</button>-->
          <!--<input id="input" v-model="newItem" placeholder="add an item" @keyup.enter="addChild()"/>-->
        </li>
      </ul>

    </li>
  </ul>
</template>

<script>
    export default {
      name: "checklist",
      props: {
        treeList:Array
      },
      data: function () {
        return {
          open: false,
          newItem: "",
        }
      },
      computed: {
        isFolder: function () {
          return this.children &&
            this.children.length
        }
      },
      methods: {
        toggle: function () {
          if (this.isFolder) {
            this.open = !this.open
          }
        },
        addChild: function () {
          console.log(this);
          this.treenode.chilren.push({
            name: newItem
          })
        }
      }


    }
</script>

<style scoped>

</style>
