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
                  <v-text-field name="name" label="User Name"  value="user.name" v-model="user.name"
                                class="input-group" required disabled></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field name="email" type="email" label="Email"  v-model="user.email"
                                class="input-group testt" required disabled></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-select name="sex" label="Sex" v-model="user.sex" class="input-group"
                            :items="sexOption" required disabled></v-select>
                </v-flex>

                <v-flex xs12>
                  <v-text-field name="department" label="Department" value="user.department"
                                v-model="user.department " class="input-group" required disabled></v-text-field>
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
                  <inputFile v-model="file" accept="image/*" :imgSrc="user.avatar" @onChange="fileChange"></inputFile>
                  <v-btn color="primary"
                         class="white--text"
                         @click="uploadAvatar"

                  >
                  确认上传
                  <v-icon right dark>cloud_upload</v-icon></v-btn>
                </v-flex>
              </v-layout>
             </v-flex>
          </v-layout>

          <v-layout row justify-center>
            <v-flex xs6>
              <v-btn v-on:click="cancel">Cancel</v-btn>
            </v-flex>
            <v-flex xs6>
                <v-btn class="primary" v-on:click="onSave">Save</v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
    </v-form>
  </v-container>
</template>

<script>
    import InputFile from './InputFile'
    export default {
      name: "userinfo",
      components:{
        'inputFile': InputFile
      },
      data () {
        return {
          user:{
            email:"",
            name:"",
            sex:"",
            department:"",
            phone:"",
            avatar:""
          },

          sexOption:[
            "male",
            "female"
          ],
          file:'',
          maxSize:5120000,
          thumbnail : null,
          progress : 0 //上传进度


        }
      },
      created() {
        this.fetchData();
      },

      methods:{
        fetchData() {
          getData(this,'/api/user/info',(data)=>{
            this.user = data;
          })

        },
        onSave() {
          let user = this.user;
          console.log(this.user);
          delete user._id;
          postData(this,'/api/user/update',user)

        },
        cancel(){
          console.log("cancel it");
          window.location.reload(true);
        },
        fileChange(file, name) {
          console.log('File:', file);
          console.log('FileName:', name);
          this.file=file;
        },
        uploadAvatar(){
          let file = this.file;
          console.log("upload",file)
          if(file.length==0) return alert("您还未选择头像文件");
          let url = '/api/user/avatar/upload';

          // if (file) {
          //   if (file.size>this.maxSize) {
          //     //todo filter file
          //     return alert('请选择小于5MB的图片');
          //   }
            //filter file, 文件大小,类型等过滤
            //如果是图片文件
            // const reader = new FileReader()
            // const imageUrl = reader.readAsDataURL(file)
            // img.src = imageUrl //在预览区域插入图片

          let formData = new FormData();

          formData.append('Content-Type', 'multipart/form-data')
          formData.append('avatar_file', file)
          formData.append('avatar_filename', file.name)

         postData(this,url,formData,(data)=>{
           if(data==null){
             let info={
               "avatar":"/api/user/avatar/"+this.user._id
             }
             postData(this,"/api/user/update",info,()=>{
               this.fetchData();
             })
           }
         })
        },

      }
    }
</script>

<style scoped>
  .userInfo{
    height: 100%;

  }
</style>
