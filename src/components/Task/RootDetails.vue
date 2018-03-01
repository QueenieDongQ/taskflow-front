<template>
  <v-container fluid grid-list-xl id="leaf_content">
    <v-card id="leaf_card">
      <v-card-title>

        <v-layout row>
          <v-checkbox v-model="project.check" hide-details class="shrink mr-2"></v-checkbox>
          <v-text-field class="edit_data" label="Name" v-model="project.name" :disabled="project.check"></v-text-field>
          <v-flex xs3>
            <v-layout row>
              <v-flex xs6 >
                <v-btn icon><i class="material-icons">edit</i></v-btn>
                <!--<v-chip style="float: right" v-if="project.check">Completed</v-chip>-->
              </v-flex>
              <v-flex xs6>
                <v-btn icon><i class="material-icons">more_vert</i></v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>

        <v-layout row>
          <v-flex xs4>
            <v-layout row wrap>
              <v-flex xs12>
                <v-subheader>Start
                  <v-menu
                    ref="menu_date1"
                    lazy
                    :close-on-content-click="false"
                    v-model="menu_date1"
                    transition="scale-transition"
                    offset-y
                    full-width
                    :nudge-right="40"
                    max-width="290px"
                    min-width="290px"
                    :return-value.sync="project.startDate"
                  >
                    Start
                    <v-btn icon slot="activator">
                      <i class="material-icons">access_time</i>
                    </v-btn>

                    <v-date-picker v-model="project.startDate" no-title scrollable></v-date-picker>
                  </v-menu>
                </v-subheader>
                <v-chip v-if="project.startDate!=null">{{project.startDate}}</v-chip>

              </v-flex>
              <v-flex xs12>
                <v-subheader>Due
                  <v-menu
                    transition="slide-x-transition"
                    bottom
                    right
                  >
                    <v-btn icon slot="activator">
                      <i class="material-icons">access_time</i>
                    </v-btn>

                    <v-date-picker v-model="project.dueDate" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.menu.save(project.dueDate)">OK</v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-subheader>
                <v-chip v-if="project.dueDate!=null">{{project.dueDate}}</v-chip>
              </v-flex>
            </v-layout>
          </v-flex>

          <v-flex xs8>
            <v-layout row wrap>
              <v-flex xs4>
                <v-subheader>Owner</v-subheader>
              </v-flex>
              <v-flex xs8>
                <v-avatar></v-avatar>
                <v-btn icon><i class="material-icons">swap_horiz</i></v-btn>
              </v-flex>

              <v-flex xs4>
                <v-subheader>Member</v-subheader>
              </v-flex>
              <v-flex xs8>
                <v-avatar></v-avatar>
                <v-btn icon><i class="material-icons">group_add</i></v-btn>
              </v-flex>

              <v-flex xs4>
                <v-subheader>Labels</v-subheader>
              </v-flex>
              <v-flex xs8>
                <!--<div style="width: 20px;height: 20px;" ></div>-->
                <v-btn icon><i class="material-icons">local_offer</i></v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-divider class="divide"></v-divider>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs12>
            <v-subheader>Description</v-subheader>
            <v-text-field
              name="input-1"
              textarea
            ></v-text-field>
          </v-flex>
          <v-divider class="divide"></v-divider>
          <v-flex xs12>
            <v-subheader>Comments History</v-subheader>
          </v-flex>
        </v-layout>
      </v-card-text>

      <v-footer>
        <v-layout row>
          <v-spacer></v-spacer>
          <v-flex xs9><v-text-field style="" label="Comment"></v-text-field></v-flex>
          <v-flex xs2><v-btn icon><i class="material-icons">send</i></v-btn></v-flex>
        </v-layout>
      </v-footer>
    </v-card>
  </v-container>
</template>

<script>
    export default {
      name: "details",
      data() {
        return {
          project: {
            check:false
          },
          menu_date1:false,
          menu_date2:false,
        }

      },
      methods: {


      }
    }
</script>

<style scoped>

</style>
