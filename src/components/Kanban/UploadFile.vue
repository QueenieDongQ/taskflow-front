<template>
  <div class="img-list">
    <div class="">
      <el-upload
        class="upload-demo"
        ref="upload"
        :show-file-list="false"
        action=""
        :http-request="uploadFile"
        :on-progress="uploadOnProgress"
        >

        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>
    <el-table
      :data="filelist"
      style="width: 100%">
      <el-table-column
        label="文件名"
        width="180">
        <template slot-scope="scope">
          <i class="el-icon-document"></i>
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleDownload(scope.$index, scope.row)">下载</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="!pass && progress !== 0" class="img-content img-progress">
      <el-progress type="circle" :percentage="progress" :status="proStatus"></el-progress>
    </div>
  </div>
</template>

<script>
  export default{
    name: 'upload-list',
    props:['files','projectId','ref_id','target'],
    data(){
      return {
        progress: 0,//上传进度
        pass: null,//是否上传成功
        filelist:[],
        params: {
          action: '',
          data:null
        }
      }
    },
    watch: {
      files(value) {
        this.filelist = value;
      }
    },
    computed: {
      proStatus(){//上传状态
        if(this.pass){
          return 'success'
        }else if(this.pass == false){
          return 'exception'
        }else{
          return ''
        }
      },

    },
    mounted(){
      // this.fetchData();
    },
    methods: {
      fetchData(){
        let url = "/api/attachment/show/of/project/"+this.projectId;

        getData(this,url,(data)=>{
          console.log("file",data)
          // this.filelist = data;
        })

      },

      uploadFile(file){
        console.log(file)
        // let fd = new FormData();
        // fd.append('filename',file.file.name)
        // fd.append('file',file);//传文件
        let url="/api/attachment/upload/"+file.file.name+"/to/"+this.projectId;

        // this.$http.post(url, fd).then(response => {
        this.$http.post(url, file).then(response => {
          if(response.data.code != 0) {
            // this.notify(response.data.error);
            this.$message.error(response.data.error);
            return;
          }
          console.log(this.filelist)

          let filename = file.file.name;
          let file_id = response.data.data;
          this.uploadOnSuccess(filename,file_id);


        }, error => {
          this.uploadOnError(error)
        });


      },
      uploadOnProgress(e,file){//开始上传
        console.log("percent",e.percent,file)
        this.progress = Math.floor(e.percent)

      },

      uploadOnSuccess(filename,file_id){//上传附件
        console.log("——————————success——————————")
        this.pass = true;
        this.$message.success("上传成功")
        this.filelist.push({
          "_id" :file_id,
          "name": filename
        })
        let attachment = {
          "attachment":this.filelist
        }
        this.updateInAssets(attachment)

      },

      updateInAssets(data){
        let url_update;

        if(this.target =="project"){
          url_update = "/api/project/"+this.projectId+"/update";

        }
        else if(this.target =="task"){
          url_update = "/api/asset/update/"+this.ref_id+"/of/"+this.projectId;
        }

        postData(this,url_update,data)
      },

      uploadOnError(error){
        console.log("——————————error——————————")
        // console.log(e)
        this.pass = false;
        this.$message.error(error);
      },

      handleDelete(index,file){//删除
        if(!file._id){
          return false;
        }
        let that = this;
        this.$confirm('是否删除此附件？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //可添加ajax
          this.$message.success("删除成功")
          this.$message({
            type: 'success',
            message: '删除成功',
            onClose: () => {
              that.filelist.splice(i,1)

              let url_del = "/api/attachment/delete/"+file._id;
              postData(this,url_del,file._id,()=>{
                console.log("delete")
              })

            }
          })
        }).catch((meg) => console.log(meg))
      },


      handleDownload(index,file){
        let obj_id = file._id;
        let url = "/api/attachment/download/"+obj_id+"/of/"+this.projectId;

        this.$http.get(url).then(response => {
          console.log("success",response)
          // this.download(response)

        }, error => {
          console.log(error)
        });
      },

      download (data) {
        if (!data) {
          return
        }
        console.log(data)

        // var aLink = document.createElement('a');
        // var blob = new Blob([data]);
        // var evt = document.createEvent("HTMLEvents");
        // evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
        // aLink.download = data;
        // aLink.href = URL.createObjectURL(blob);
        // aLink.dispatchEvent(evt);
      }
    }
  }
</script>

<style>
  *{
    box-sizing: border-box;
  }
  .img-list{
    overflow:hidden;
    width:100%;
  }
  .img-list .img-content{
    float:left;
    text-align:left;
    position:relative;
    display:inline-block;
    width:200px;
    height:270px;
    padding:5px;
    margin:20px;
    border:1px solid #d1dbe5;
    border-radius:4px;
    transition:all .3s;
    box-shadow:0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
  }
  .img-list .img-upload{
    float:left;
    width:200px;
    height:270px;
    display:table;
    text-align:center;
  }
  .img-list .uploader{
    width:100%;
    display:table-cell;
    vertical-align:middle;
  }
  .img-list .img-progress{
    text-align:center;
    padding-top:50px;
  }
  .img-list .img-content img{
    display:block;
    width:100%;
    height:190px;
    margin:0 auto;
    border-radius:4px;
  }
  .img-list .img-content .name{
    margin-top:10px;
  }
  .img-list .img-content .name>div{
    width:90%;
    text-overflow:ellipsis;
    overflow:hidden;
    height:25px;
    line-height:25px;
  }
  .img-list .img-content:hover .del,
  .img-list .img-content:hover .layer{
    opacity:1;
  }
  .img-list .img-content .del,
  .img-list .img-content .layer{
    opacity:0;
    transition:all .3s;
  }
  .img-list .img-content .del{
    position:absolute;
    bottom:10px;
    right:10px;
    color:#8492a6;
    cursor:pointer;
    font-size:1.1em;
  }
  .img-list .img-content .layer{
    position:absolute;
    left:0;
    right:0;
    top:0;
    height:200px;
    color:#fff;
    text-align:center;
    z-index:5;
    background-color:rgba(0,0,0,.4);
  }
  .img-list .img-content .layer i{
    font-size:1.6em;
    margin-top:80px;
  }
</style>
