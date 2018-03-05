<template>
  <v-container fluid id="leaf_content" justify-center text-xs-center>
    <v-card id="leaf_card" >
      <v-card-title>
        <v-layout row wrap>
          <v-flex xs1><v-checkbox v-model="project.check" hide-details class="shrink mr-2"></v-checkbox></v-flex>
          <v-flex xs7><v-text-field class="edit_data" label="Name" v-model="project.name" :disabled="project.check"></v-text-field></v-flex>

          <v-flex xs4 >
            <v-btn icon ><i class="material-icons">edit</i></v-btn>
            <!--</v-flex>-->
            <!--<v-flex xs2>-->
            <!--<v-chip style="float: right" v-if="project.check">Completed</v-chip>-->
            <v-btn icon ><i class="material-icons">more_vert</i></v-btn>
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
          <v-flex xs12>
            <v-layout row wrap>
              <v-flex xs6>
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

                    <v-btn icon slot="activator">
                      <i class="material-icons">access_time</i>
                    </v-btn>
                    <v-date-picker v-model="project.startDate" no-title scrollable></v-date-picker>
                  </v-menu>
                </v-subheader>
                  <v-chip v-if="project.startDate!=null">{{project.startDate}}</v-chip>
              </v-flex>
              <v-flex xs6>
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
          <v-flex xs5>
            <v-text-field class="edit_data" label="Project Code" v-model="project.code" ></v-text-field>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex xs5>
            <v-text-field class="edit_data" label="Client" v-model="project.client" ></v-text-field>
          </v-flex>

          <v-flex xs12>

            <v-text-field
              name="input-7-1"
              label="Description"
              v-model="project.description"
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
            <v-divider class="divide"></v-divider>
          </v-flex>
          <!--<v-flex xs6 text-xs-center><v-btn class="primary">Save</v-btn></v-flex>-->
          <!--<v-flex xs6><v-btn>Cancel</v-btn></v-flex>-->
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
      name: "root-details",
      props:['editItem'],

      data() {
        return {
          project: {
            check:false
          },
          menu_date1:false,
          menu_date2:false,
          progress_value:0,
        }

      },
      created() {

        this.fetchData();

      },

      methods:{
        fetchData() {
          console.log(editItem);
          var uid = editItem.uid;
          this.$http.get('/api/project/show/'+uid).then(response => {
            // get body data
            this.project = response.data.data;
          }, error=> {
            // error callback
            this.notify(error)
          });

        },

        onSave() {
          console.log(this.user);
          this.$http.post('/api/project/', JSON.stringify(this.user)).then(response => {
            // if(response.data.code != 0) {
            //   this.notify(response.data.error);
            // }
          }, error => {
            this.notify(error)
          });
          // $.post('/api/user/update',JSON.stringify(this.user));
        },
        cancel(){
          console.log("cancel it");
          window.location.reload(true);
        }
      }
    }
</script>

<style scoped>
#leaf_card{
  width: 100%;
}
</style>
