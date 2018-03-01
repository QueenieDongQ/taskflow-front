<template lang="html">
  <v-container class="userInfo">
    <v-form>
    <v-card>
      <v-card-title><h2>User Info</h2></v-card-title>
      <v-card-text>
        <v-container fluid grid-list-md text-xs-center>
          <v-layout row wrap>

            <v-flex xs6>
              <v-layout row wrap>

                <v-flex xs12>
                  <v-text-field name="email" type="email" label="Email"  v-model="user.email"
                                class="input-group testt" required disabled></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-select name="sex" label="Sex" v-model="user.sex" class="input-group"
                            :items="sexOption" required disabled></v-select>
                </v-flex>
                <v-flex xs12>
                  <v-text-field name="name" label="User Name"  value="user.name" v-model="user.name"
                                class="input-group" required disabled></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field name="department" label="Department" value="user.department"
                                v-model="user.department" class="input-group" required disabled></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field name="phone"  label="Phone" value="Input text"
                                v-model="user.phone" class="input-group"></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex xs6>
              <v-layout row wrap justify-center>
                <v-flex xs12>
                  <v-avatar size="200px" class="teal">test</v-avatar>
                </v-flex>
                <v-flex xs12 >
                  <v-btn>Change Avatar</v-btn>
                </v-flex>
              </v-layout>
             </v-flex>

          </v-layout>
          <v-layout row>
            <v-flex xs12>
                <v-btn class="primary" v-on:click="onSave">Save</v-btn>
                <v-btn v-on:click="cancel">Cancel</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
    </v-form>
  </v-container>
</template>

<script>
    export default {
      name: "userinfo",
      data () {
        return {
          user:{
            email:"",
            name:"",
            sex:"",
            department:"",
            phone:"",
          },

          sexOption:[
            "male",
            "female"
          ],


        }
      },
      created() {

        this.fetchData();


      },

      methods:{
        fetchData() {

          this.$http.get('/api/user/info').then(response => {
            // get body data
            this.user = response.data.data;
          }, error=> {
            // error callback
            this.notify(error)
          });

        },
        onSave() {
          console.log(this.user);
          this.$http.post('api/user/update', JSON.stringify(this.user)).then(response => {
            if(response.data.code != 0) {
              this.notify(response.data.error);
            }
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
  .userInfo{
    height: 100%;

  }
</style>
