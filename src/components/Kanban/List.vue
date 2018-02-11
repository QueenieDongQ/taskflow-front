<template>
  <draggable class="list-group" element="ul" v-model="list" :options="dragOptions" :move="onMove" @start="isDragging=true" @end="isDragging=false">
    <transition-group type="transition" :name="'flip-list'">
      <li class="list-group-item" v-for="element in list" :key="element.order">
        <i :class="element.fixed? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'" @click=" element.fixed=! element.fixed" aria-hidden="true"></i>
        {{element.name}}
        <span class="badge">{{element.order}}</span>
      </li>
    </transition-group>
  </draggable>
</template>
<script>
  import draggable from 'vuedraggable'

  export default {
    name: 'lists',
    components: {
      draggable,

    },
    // props: ['list_name', 'list_description',
    //   'lists', 'list_items',
    //   'item_text', 'header_color'],
    props: ['list_name', 'list_description',
      'lists', 'items',
      'item_text', 'header_color'],

    data() {
      return {
        editItem: null,
        showForm: false,
      }
    },

    computed: {

      filteredListItems() {

        return this.list_items.filter(t => {
          return t.list == this.list_name
        })

      },

      defaultItem() {

        return {id: 0, text: this.item_text, list: this.list_name}

      },
      sortableConfig() {

        return {
          onAdd: this.putItem,
          draggable: '.draggable-card',
          group: {name: this.list_name, put: this.list_put}
        }
      }
    },

    methods: {

      list_put() {

        return this.lists.filter(t => t !== this.list_name)

      },

      putItem(evt) {

        let idx = _.findIndex(this.list_items, t => t.id == evt.item.id)
        let item = this.list_items[idx]
        item.list = evt.to.dataset.type
        this.list_items.splice(idx, 1, item)

      },

      showEditForm(item) {
        this.editItem = item
        this.showForm = true
      },

      showNewForm() {
        this.editItem = null
        this.showForm = true;
      },

      closeForm() {
        this.showForm = false;
      },

      itemCreated(item) {
        this.list_items.push(item)
        this.closeForm()
      },

      itemEdited(item) {
        console.log(item)
        let idx = _.findIndex(this.list_items, t => t.id == item.id)
        let itm = this.list_items[idx]
        itm.list = item.list
        itm.text = item.text
        this.list_items.splice(idx, 1, itm)
        this.closeForm()
      },

      itemCancelled() {
        this.closeForm()
      }
    }
  }

</script>
