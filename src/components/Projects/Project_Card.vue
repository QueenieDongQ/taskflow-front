<template>
  <v-layout column wrap>
    <v-flex xs12 sm6 offset-sm3>

      <v-container fluid grid-list-md class="grey lighten-4">
        <v-layout row wrap>
          <v-flex
            xs3
            v-for="board in boards"
            :key="board.title"
          >
            <v-card>

              <v-container fill-height fluid>
                <v-layout fill-height>
                  <v-flex xs12 align-end flexbox>
                    <label class="" v-text="board.title"></label>
                  </v-flex>
                </v-layout>
              </v-container>

              <v-card-actions class="white">
                <v-spacer></v-spacer>
                <v-btn icon>
                  <v-icon>favorite</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>bookmark</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>share</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'boards',
    data: () => ({
      boards: [
        { title: 'Pre-fab homes'},
        { title: 'Favorite road trips'},
        { title: 'Best airlines'},
        { title: 'Test-for 4'}
      ]
    })

  }
</script>

<style scoped>

</style>
