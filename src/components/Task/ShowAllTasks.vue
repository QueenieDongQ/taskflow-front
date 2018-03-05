<template>
  <v-layout row >
    <v-flex xs7>
      <v-card>
        <v-list two-line subheader>
          <v-subheader inset>Participated</v-subheader>
          <v-list-tile avatar v-for="item in items" :key="item.title" >
            <v-list-tile-avatar>
              <v-icon class="grey lighten-1 white--text">folder</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.name }}</v-list-tile-title>
              <v-list-tile-sub-title><v-chip small outline color="green" v-if="item.startDate">{{ item.startDate }}</v-chip>
              <v-chip small outline color="red" v-if="item.dueDate" >{{ item.dueDate }}</v-chip></v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon ripple @click="editItem(item)">
                <v-icon color="grey lighten-1">info</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>

        <v-btn block @click.stop="dialog = true">Create New Project</v-btn>
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <h2>Create Project</h2>
            </v-card-title>
            <v-card-text>

              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4>
                    <v-text-field label="Project Name" v-model="project.name" required></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field label="Project Code" v-model="project.code"required></v-text-field>
                  </v-flex>
                  <v-flex xs12 md4>
                    <v-text-field
                      label="Client"
                      v-model="project.client"
                      persistent-hint
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field label="Part Number" v-model="project.partNumber" multi-line required></v-text-field>
                  </v-flex>

                </v-layout>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-layout row justify-center text-xs-center>
                <v-flex xs6>
                  <v-btn color="blue darken-1" flat @click.stop="createProject">Save</v-btn>
                </v-flex>
                <v-flex xs6>
                  <v-btn color="primary" flat @click.stop="closeCreate">Close</v-btn>
                </v-flex>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </v-flex>

    <!--<v-flex xs5 >-->
      <!--<root-details scrollable :editItem="editedItem"></root-details>-->

    <!--</v-flex>-->
  </v-layout>
</template>

<script>
    import RootDetails from './RootDetails'
    export default {
      name: "all-task-lists",
      components:{
        RootDetails
      },
      data(){
        return{
          items: [

          ],
          dialog: false,
          project:{},
          editedIndex: -1,
          editedItem: {

          },
        }
      },
      created() {

        this.fetchData();


      },

      methods:{
        fetchData() {

          this.$http.get('/api/project/all').then(response => {
            // get body data
            this.items = response.data.data;
          }, error=> {
            // error callback
            this.notify(error)
          });

        },
        editItem (item) {
          this.editedIndex = this.items.indexOf(item);
          this.editedItem = Object.assign({}, item);

          console.log(this.editedItem);
          // this.dialog = true;
        },
        createProject(){
          this.project.createDate=new Date();
          var project1 = this.project;
          // console.log(typeof project1);
          // console.log(JSON.stringify(project1));
          this.$http.post('/api/project/create', JSON.stringify(project1)).then(response => {
            if(response.data.code != 0) {
              this.notify(response.data.error);
            }
            this.items.push(this.project);
          }, error => {
            this.notify(error)
          });
          this.dialog=false;
        },
        closeCreate(){
          this.dialog=false;
          this.project="";
        }

      }
    }
</script>

<style scoped>
.createProject{


}
</style>
