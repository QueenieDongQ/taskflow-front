<template>
  <tree :model='data' :current-highlight='true' :default-text='"New A Girl"' :hover-color='"lightblue"' :highlight-color='green'></tree>
</template>
<script>
  import tree from './Tree'
  export default{
    name:"tree-list",
    props:['data'],
    components:{
      tree
    },
    data(){
      return {

      }
    },
    methods: {
      assignData(data) {
        // data is a json object that node infomation was exchanged inside.You need to assign to finish the last step of exchange.

        // If you have not use vuex or something similar, you can just assign data to this.data
        this.data = data

        // If you have used vuex or something similar, you need to write assign code by yourselft.
        // vuex as an example:
        // updateData function is a mutation of vuex.

        // this.updateData(data)
      },
      curNodeClicked(model,component) {
        // information of the node clicked just now.
      },
    }
  }
</script>
