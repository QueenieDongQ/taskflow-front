<template>
    <v-container fluid id="leaf_content">
      <v-card id="leaf_card">
        <v-card-title>
          <v-layout row wrap>
            <v-flex xs1><v-checkbox v-model="task.check" hide-details class="shrink mr-2"></v-checkbox></v-flex>
            <v-flex xs7><v-text-field class="edit_data" label="Name" v-model="task.name" :disabled="task.check"></v-text-field></v-flex>

            <v-flex xs4 >
                  <v-btn icon style="float: right"><i class="material-icons">edit</i></v-btn>
            <!--</v-flex>-->
            <!--<v-flex xs2>-->
                  <!--<v-chip style="float: right" v-if="task.check">Completed</v-chip>-->
                  <v-btn icon style="float: right"><i class="material-icons">more_vert</i></v-btn>
            </v-flex>
            <v-flex xs12>
             <v-subheader>Progress:
               <v-progress-linear
                 slot="progress"
                 :value="progress"
                 height="7"
                 color="success"
               ></v-progress-linear>
               {{progress_value}}%
             </v-subheader>
            </v-flex>
          <!--</v-layout>-->

          <!--<v-layout row wrap>-->
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
                    :return-value.sync="task.startDate"
                  >
                    Start
                    <v-btn icon slot="activator">
                      <i class="material-icons">access_time</i>
                    </v-btn>

                    <v-date-picker v-model="task.startDate" no-title scrollable></v-date-picker>
                  </v-menu>
                  </v-subheader>
                  <v-chip v-if="task.startDate!=null">{{task.startDate}}</v-chip>

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

                      <v-date-picker v-model="task.dueDate" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.menu.save(task.dueDate)">OK</v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-subheader>
                  <v-chip v-if="task.dueDate!=null">{{task.dueDate}}</v-chip>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex xs8>
              <v-layout row wrap>
                <v-flex xs2>
                  <v-subheader>Owner</v-subheader>
                </v-flex>
                <v-flex xs10>
                  <v-avatar></v-avatar>
                  <v-btn icon><i class="material-icons">swap_horiz</i></v-btn>
                </v-flex>

                <v-flex xs2>
                  <v-subheader>Member</v-subheader>
                </v-flex>
                <v-flex xs10>
                  <v-avatar></v-avatar>
                  <v-btn icon><i class="material-icons">group_add</i></v-btn>
                </v-flex>

                <v-flex xs2>
                  <v-subheader>Labels</v-subheader>
                </v-flex>
                <v-flex xs10>
                  <v-avatar></v-avatar>
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
              <v-text-field
                name="input-7-1"
                label="Description"
                v-model="task.description"
                multi-line
              ></v-text-field>
              <v-divider class="divide"></v-divider>
            </v-flex>
            <v-flex xs12>
              <v-subheader>Checklist</v-subheader>
              <v-divider class="divide"></v-divider>
            </v-flex>
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
      name: "leaf-details",
      data() {
        return {
          task: {
            check:false
          },
          menu_date1:false,
          menu_date2:false,
          progress_value:0,
        }

      },
      computed:{
        progress () {
          this.progress_value=55;
          return this.progress_value;
          console.log(progress_value);
        },
      },
      methods: {


      }
    }
</script>

<style scoped>
  #leaf_content{
    margin: 0 auto;

  }
  #leaf_card{
    width:80%;
  }
  .divide{
    margin:0;
  }
</style>
