<template>
  <div>
    <div :class="className" :id="id" :style="{height:height,width:width}"></div>
    <div>
      <v-layout align-center row wrap>
        <v-flex xs4>
          <v-btn>TODO :{{result.seriesData[0].value}}</v-btn>
        </v-flex>
        <v-flex xs4>
          <v-btn>PROGRESS :{{result.seriesData[1].value}}</v-btn>
        </v-flex>
        <v-flex xs4>
          <v-btn>DONE :{{result.seriesData[2].value}}</v-btn>
        </v-flex>
        <v-flex xs12 text-xs-center>
          <v-btn block color="error" style="width:90%">Delay in progress:{{delay}}</v-btn>
        </v-flex>
      </v-layout>
    </div>
  </div>

</template>

<script>
  import echarts from 'echarts'

  export default {
      name: "Dashboard",
      props: {
        className: {
          type: String,
          default: 'chart'
        },
        id: {
          type: String,
          default: 'chart'
        },
        width: {
          type: String,
          default: '500px'
        },
        height: {
          type: String,
          default: '400px'
        },
        bigData:{
          type:Array,
        },
        searchID:{
          type:String,
        },
        searchName:{
          type:String,
        },
        searchType:{
          type:String,
        },

        myInformation:{
          type:Object,
        }
      },
      data() {
        return {
          chart: null,
          delay:0,
          result : {
            legendData: [
              "todo",
              "progress",
              "done"
            ],
            seriesData: [
              {
                "name":"todo",
                "value":0
              },
              {
                "name":"progress",
                "value":0
              },
              {
                "name":"done",
                "value":0
              }
            ],
            selected:{
              "todo":true,
              "progress":true,
              "done":true,
            }
          },
        }
      },
      computed:{

      },
      mounted() {
        this.initData();

      },
      // updated: function () {
      //   console.log('updated 钩子执行...');
      //   console.log(this.bigData)
      // },
      beforeDestroy() {
        if (!this.chart) {
          return
        }
        this.chart.dispose()
        this.chart = null
      },
      methods: {

        initData(){
          let that = this;
          setInterval(function () {
            let bigData = that.bigData;
            console.log(that.bigData)
            if(that.bigData.length !=0){
              that.filterData(bigData)
            }
          },7000)
        },

        filterData(data){

          let searchType =this.searchType;
          let searchID = this.searchID;
          console.log(searchID)
          let arr1=[],arr2=[];
          arr1 = data.find((item)=>{
            return item._id == searchID;
          })
          let assets = arr1.assets;
          switch (searchType){
              case "me":
                 arr2 = assets.filter((v)=>{
                  return v.owner==this.myInformation._id;
                })
                break;

              case "department":
                arr2 = assets.filter((v)=>{
                  let dep = this.myInformation.department;
                  if(v.label.indexOf(dep)>-1) {
                    return v;
                  }
                })
                break;
              case "all":
                arr2 = assets;
                break;
          }
          this.countNumber(arr2);
        },

        countNumber(arr){
          // console.log(arr)
          let s_todo = 0, s_progress =0, s_done=0, s_delay=0;
          let today = new Date().getTime();

          for(let i = 0;i<arr.length;i++){
            let item = arr[i];
            if(item.status=="todo"){
              s_todo +=1;
            }
            else if(item.status=="progress"){
              s_progress +=1;
              console.log(item.dueDateUTC)
              if(today>item.dueDateUTC && item.dueDateUTC !=""){

                s_delay +=1;
              }
            }
            else if(item.status=="done"){
              s_done +=1;
            }
          }
          console.log(s_todo +"+"+s_progress+"+"+s_done)
          this.result.seriesData[0].value = s_todo;
          this.result.seriesData[1].value = s_progress;
          this.result.seriesData[2].value = s_done;

          this.delay = s_delay;
          this.initChart(this.result);

        },
        initChart(result){
          this.chart = echarts.init(document.getElementById(this.id))
          let data = result;
          console.log("chart")
          this.chart.setOption(
            {title : {
                text: '任务完成度',
                subtext: this.searchName,
                x:'center'
              },
              tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                type: 'scroll',
                orient: 'vertical',
                right: 10,
                top: 20,
                bottom: 20,
                data: data.legendData,
                selected: data.selected
              },
              series : [
                {
                  name: '状态',
                  type: 'pie',
                  radius : '55%',
                  center: ['40%', '50%'],
                  data: data.seriesData,
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
            })
        }


      }

  }
</script>

<style scoped>

</style>
