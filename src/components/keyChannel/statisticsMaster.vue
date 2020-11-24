<template>
  <div>
    <div class="statistics_chat">
       <el-card class="box-card" v-if="roleShow">
         <!-- 饼图-->
         <div class="pie">
           <img src="../../assets/index/youshang.png" alt="">
           <p>日抓拍统计</p>
           <div id="myChart2" style="width: calc(100% - 32px);height: 300px"/>
         </div>
         <!-- 折线图-->
         <div class="lineChart">
           <img src="../../assets/index/youxia.png" alt="">
           <div id="myChart1" style="width: calc(100% - 32px);height: 300px"/>
         </div>
      </el-card>

      <el-card class="box-card box-card_" v-else>
        <!-- 饼图-->
        <div class="pie pie_" ref="tableHeight">
          <img src="../../assets/index/youshang.png" alt="">
          <p>程序监控</p>
          <div class="contentTable">
            <div class="tabTip">
              <span><i class="blueColor"></i>正常</span>
              <span><i class="redColor"></i>故障</span>
            </div>
            <div class="hotel_tab">
              <div class="title">{{ hotelList.length != 0 ? hotelList[0].hotelName : '' }}</div>
              <div class="hotel_status">
                <i :class="hotelList.length != 0 ? hotelList[0].processStatus == 0 ? 'redColor' : 'blueColor' : ''"></i>
                <span :class="hotelList.length != 0 ? hotelList[0].processStatus == 0 ? 'statusRed' : 'statusBlue' : ''">{{ hotelList.length != 0 ? hotelList[0].processStatus == 0 ? (cameraList_ && cameraList_.length <= 2) ? '程序连接异常，请重启人证通设备' : (cameraList_ && cameraList_.length >= 3) ? '程序连接异常，请重启黑盒子设备' : '当前程序不在线' : '欢迎使用，当前程序在线' : '' }}</span>
              </div>
            </div>
            <div class="table_lists" ref="tableListsHeight">
              <div class="lists" v-if="cameraList.length != 0">
                <div class="list" v-for="item in cameraList">
                  <div class="list_l">
                    <img :src="item.cameraStatus == 1 ? require('../../assets/index/Group1.png') : require('../../assets/index/Group.png')" alt="">
                    <span class="location">{{ item.cameraType == 'IN' ? '入口' : '出口' }}</span>
                  </div>
                  <div class="list_r">
                    <div>IP：{{ item.ipAddress }}</div>
                    <div>摄像头地址：{{ item.location ? item.location : '-' }}</div>
                    <div>最近上报：{{ datetimeparse(item.createTime, 'MM/dd hh/mm') }}</div>
                  </div>
                </div>
              </div>
              <div class="noMsg" v-else>
                <div class="img"><img src="../../assets/index/zanwuneirong.png" alt=""></div>
                <p>暂无内容</p>
              </div>
            </div>
          </div>
        </div>
        <!-- 饼图-->
        <div class="pie">
          <img src="../../assets/index/youxia.png" alt="">
          <div id="myChart2" style="width: calc(100% - 32px);height: 300px"/>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  import {mapState,mapActions} from 'vuex';
//  import Calendar from 'vue-calendar-component';

  // 引入基本模板
  import echarts from 'echarts'
  // 引入柱状图组件
  require('echarts/lib/chart/bar');
  require('echarts/lib/chart/pie');

  // 引入提示框和title组件
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/title');
  require('echarts/lib/component/legend');


  export default {
    name: 'statistics',
    components: {
    },
    data () {
      return {
        roleShow: sessionStorage.roleId != '' ? true : false,  // 判断权限
        calendarShow: false,
        calendarShow_: false,
        startTime: '',
        endTime: '',
        echarts2Options: [],   // 饼图数据
        echarts1Options: {},   // 折线图数据
        cameraList: [],
        cameraList_: [],
        hotelList: [],
        timer: null
      }
    },
    props: {
      totalLists: {
        type: Array,
        required: true
      }
    },
    mounted () {

      // 初始化时间为当前天前七天的数据
      this.startTime = this.fun_date(-7);
      this.endTime = this.datetimeparse(new Date().getTime(),'YYYY/MM/DD');
      // 获取数据列表
      setTimeout(() => {
        // 饼图
        this.echarts1Options = {};
        this.echarts2Options = [];
//        this.getList (this.startTime, this.endTime);
      },0);

      this.$refs.tableHeight.style.height = 'calc(100vh - 398px)';
      this.$refs.tableListsHeight.style.maxHeight = 'calc(100% - 110px)';
      console.log(this.$refs, 556, );

      if (!this.roleShow) {
        this.getHotelList();
        clearInterval(this.timer);
        this.timer = setInterval(() => {
          this.getHotelList();
        },60000);
      }

    },
    methods: {

      ...mapActions([
        'replaceto', 'illegalGuest', 'getHotel', 'hotelCamera'
      ]),

      // 酒店list
      getHotelList() {
          console.log(5554,sessionStorage.hotelId);
        let arr = [];
        this.getHotel({
          onsuccess: body => {
            if (body.data.code == 0 && body.data.data) {
                body.data.data.forEach(item => {
                    if (item.hotelId == sessionStorage.hotelId) {
                        arr.push(item)
                    }
                });
                console.log(this.hotelList, sessionStorage.hotelId);
              this.hotelList = arr;
              this.cameraFun( arr.length != 0 ? this.hotelList[0].hotelId : '');
            }
          }
        })
      },

      // 摄像头状态
      cameraFun(hotelId) {
          console.log(1111, hotelId);
          if (hotelId) {
            this.hotelCamera({
              hotelId: hotelId,
              onsuccess: body => {
                  console.log(333, body.data);
                if (body.data.code == 0 && body.data.data) {
                  let arr = [], arr_ = [];
                  if (body.data.data.length != 0) {
                    body.data.data.forEach(item => {
                        if (item.cameraStatus == 0) {
                          arr_.push(item)
                        }

                    });
                    arr = this.sortBykey(body.data.data, 'cameraStatus');
                  }
                  this.cameraList = arr;
                  this.cameraList_ = arr_;
                  console.log(this.cameraList);
                }
              }
            })
          }
      },

      sortBykey(ary, key) {
        return ary.sort(function (a, b) {
          let x = a[key];
          let y = b[key];
          return ((x < y) ? -1 : (x > y) ? 1 : 0)
        })
      },

      // 获取前后几天的时间
      fun_date(aa){
        let date1 = new Date(),
          time1=date1.getFullYear()+"/"+(date1.getMonth()+1)+"/"+date1.getDate();//time1表示当前时间
        let date2 = new Date(date1);
        date2.setDate(date1.getDate()+aa);
        let time2 = date2.getFullYear()+"/"+(date2.getMonth()+1)+"/"+date2.getDate();
        return time2;
      },

      // 计算续住的总日期列表
      getAll(begin, end) {
        let ab = begin.split("/");
        let ae = end.split("/");
        let db = new Date();
        let arrTime = [];
        db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
        let de = new Date();
        de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
        let unixDb = db.getTime();
        let unixDe = de.getTime();
        for (let k = unixDb; k <= unixDe;) {
          arrTime.push(this.datetimeparse(k, 'YYYY-MM-DD'));
          k = k + 24 * 60 * 60 * 1000;
        }
        arrTime.pop();   // 去掉最后一天
        return arrTime;
      },

      // 选中某天
      clickDay (data) {
        this.startTime = data;
        this.calendarShow = false;
      },
      clickDay_ (data) {
        this.endTime = data;
        this.calendarShow_ = false;
      },

      // 左右点击切换月份
      changeDate(data) {
        console.log(data);
      },
      changeDate_(data) {
        console.log(data);
      },

      // 查询
      inquire() {
        this.echarts1Options = {};
        this.echarts2Options = [];
        this.getList (this.startTime, this.endTime);
      },

      // 获取数据
      getList (startTime,endTime) {
        let arr = this.getAll (startTime, endTime);
        this.echarts2Options = [];
        console.log('arr:',arr);
//        console.log('arr_:',arr.reverse());
        if (arr.length > 7) {
          this.$message('筛选时间不可大于7天');
          return
        }
        if (startTime == '') {
          this.$message.error('请选择初始时间');
          return;
        }else if (endTime == '') {
          this.$message.error('请选择结束时间');
          return
        }
        if (new Date(this.datetimeparse(new Date(new Date(new Date(endTime).toLocaleDateString()).getTime()+24*60*60*1000-1),'YYYY-MM-DD hh:mm:ss')).getTime() <= new Date(this.datetimeparse(new Date(new Date(new Date(startTime).toLocaleDateString()).getTime()),'YYYY-MM-DD hh:mm:ss')).getTime()) {
          this.$message('结束时间必须大于起始时间');
          return
        }
        this.illegalGuest({
          data: {
            createTimeStart: new Date(this.datetimeparse(new Date(new Date(new Date(startTime).toLocaleDateString()).getTime()),'YYYY/MM/DD hh:mm:ss')).getTime(),
            createTimeEnd: new Date(this.datetimeparse(new Date(new Date(new Date(endTime).toLocaleDateString()).getTime()+24*60*60*1000-1),'YYYY/MM/DD hh:mm:ss')).getTime(),
            hotelId: sessionStorage.hotelId ? sessionStorage.hotelId : '',
          },
          onsuccess: body => {
              let list = body.data.data.list;
              let timeArr = [],suspiciousList = [],staffList = [],visitorList = [],guestList = [];
              list.forEach(item => {
                timeArr.push(item.date);
                suspiciousList.push(item.suspicious);
                staffList.push(item.staff);
                visitorList.push(item.gray);
                guestList.push(item.black);
              });

              // 处理空日期的填充
              arr.forEach((item, index) => {
                  if (arr[index] != timeArr[index]) {
                      timeArr.splice(index, 0, item);
                      suspiciousList.splice(index, 0, 0);
                      staffList.splice(index, 0, 0);
                      visitorList.splice(index, 0, 0);
                      guestList.splice(index, 0, 0);
                  }
              });

              this.echarts1Options.timeArr = timeArr;
              this.echarts1Options.suspiciousList = suspiciousList;
              this.echarts1Options.staffList = staffList;
              this.echarts1Options.visitorList = visitorList;
              this.echarts1Options.guestList = guestList;

              let obj = {},obj1 = {}, obj2 = {}, obj3 = {};
              obj.name = '陌生人';
              obj.value = body.data.data.suspicious;
              obj1.name = '黑名单人员';
              obj1.value = body.data.data.black;
              obj2.name = '工作人员';
              obj2.value = body.data.data.staff;
              obj3.name = '灰名单人员';
              obj3.value = body.data.data.gray;
              this.echarts2Options.push(obj1, obj3, obj, obj2);
              console.log('this.echarts2Options',this.echarts2Options);

              setTimeout(() => {
                this.getLine();
                this.getPie();
              }, 1500);

              this.$nextTick(() => {
                setTimeout(() => {       // 隔一天加载折线图
                  this.startTime = this.fun_date(-7);
                  this.endTime = this.datetimeparse(new Date().getTime(),'YYYY/MM/DD');
                  this.echarts1Options = {};
                  this.echarts2Options = [];
                  this.getList (this.startTime, this.endTime);
                },((new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1) - new Date().getTime()))
              })
          }
        })
      },

      // 折线图
      getLine () {
        // 基于准备好的dom，初始化echarts实例
        let myChart1 = null;
        if (myChart1) {
          myChart1.clear();
        }
        setTimeout(() => {
          myChart1 = echarts.init(document.getElementById('myChart1'));
          // 绘制图表，this.echarts1_option是数据
          myChart1.setOption({
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              y: 'bottom',
              x: 'center',
              icon: 'rect',
              itemWidth: 20,
              itemHeight: 10,
              itemGap: 10,
              textStyle:{
                fontSize: 12,//字体大小
                color: '#ffffff'//字体颜色
              },
              data:['黑名单人员','灰名单人员','陌生人','工作人员']
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.echarts1Options.timeArr,
              axisLabel: {
                show: true,
                showMaxLabel: true,
                textStyle: {
                  color: '#ffffff'
                }
              }
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                show: true,
                textStyle: {
                  color: '#ffffff'
                },
                margin: 2,
                formatter: function (value, index) {
                  if (value >= 1000 && value < 10000) {
                    value = value / 1000 + "千";
                  } else if (value >= 10000) {
                    value = value / 10000 + "万";
                  }
                  return value;
                }
              }
            },
            grid: {
              left: 40,
              right: 40
            },
            series: [
              {
                name:'黑名单人员',
                type:'line',
                data: this.echarts1Options.guestList
              },
              {
                name:'灰名单人员',
                type:'line',
                data: this.echarts1Options.visitorList
              },
              {
                name:'陌生人',
                type:'line',
                data: this.echarts1Options.suspiciousList
              },
              {
                name:'工作人员',
                type:'line',
                data: this.echarts1Options.staffList
              }
            ]
          },true)
        },500)
      },

      // 饼图
      getPie () {
        // 基于准备好的dom，初始化echarts实例
        let myChart = null;
        if (myChart) {
          myChart.clear();
        }
        setTimeout(() => {
          myChart = echarts.init(document.getElementById('myChart2'));
          myChart.clear();
          myChart.setOption({
            series: [{
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              hoverAnimation:false, // 是否开启 hover 在扇区上的放大动画效果
              data: this.echarts2Options,
              avoidLabelOverlap: true,   //是否启用防止标签重叠策略
              label:{
                align: 'left',
                normal:{
                  formatter(v) {
                    let text = v.name;
                    if(text.length <= 2)
                    {
                      return text;
                    }else if(text.length > 2 && text.length <= 4){
                      return text = `${text.slice(0,2)}\n${text.slice(2)}`
                    }
                  },
                  textStyle : {
                    fontSize : 12
                  }
                }
              }
            }],
            tooltip: {
              formatter: '{b} : {c}',// 默认值null，内容格式器
            },
            legend: {
              y: 'bottom',
              x: 'center',
              textStyle:{
                fontSize: 12,//字体大小
                color: '#ffffff'//字体颜色
              },
              data: ['黑名单人员','灰名单人员','陌生人','工作人员']
            },
          },true);
        },500)
      },

    },
    watch: {
      totalLists (newV, oldV) { // watch监听props里status的变化，然后执行操作
        console.log(newV, oldV);
//        this.totalLists = newV;
//        this.getPie();
        this.startTime = this.fun_date(-7);
        this.endTime = this.datetimeparse(new Date().getTime(),'YYYY/MM/DD');
        this.echarts1Options = {};
        this.echarts2Options = [];
        this.getList (this.startTime, this.endTime);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .el-card {
    border: none;
    background-color: transparent;
  }

  .el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover {
    box-shadow: none;
    height: 100%;
  }

  .box-card {
    /*width: 100vw;*/
    /deep/ .el-card__body {
      width: 100%;
      padding: 0;
      height: 100%;
      /*position: absolute;*/
      z-index: 10;
      /*left: 0;*/
      /*top: 0;*/
    }
    .pie {
      position: relative;
      width: 100%;
      img {
        display: block;
        width: 100%;
      }
      p {
        position: absolute;
        z-index: 10;
        font-size: 14px;
        color: #fff;
        padding: 8px;
        left: 8px;
        top: 0;

      }
    }
    .lineChart {
      position: relative;
      width: 100%;
      margin-top: 20px;
      img {
        display: block;
        width: 100%;
        /*height: 360px;*/
      }
    }
    #myChart1, #myChart2 {
      display: block;
      padding: 8px;
      position: absolute;
      z-index: 10;
      left: 8px;
      top: 18px;
      div {
        width: 100%;
        height: 100%;
      }
    }
    #myChart1 {
      top: -34px;
    }
  }
  .box-card_ {
    .pie {
      margin-top: 20px;
    }
    .pie_ {
      img {
        height: 100%;
      }
      margin-top: 0;
      .contentTable {
        height: calc(100% - 55px);
        width: calc(100% - 32px);
        position: absolute;
        top: 35px;
        left: 8px;
        padding: 8px;
        .tabTip {
          text-align: left;
          span {
            color: #3798FC;
            font-size: 14px;
            margin-right: 30px;
            display: inline-flex;
            align-items: center;
          }
        }
        i {
          width: 14px;
          height: 14px;
          border-radius: 4px;
          margin-right: 6px;
          display: inline-block;
        }
        .blueColor {
          background-color: #1AAD19;
        }
        .redColor {
          background-color: red;
        }
        .hotel_tab {
          margin-top: 8px;
          width: calc(100% - 32px);
          border: 1px solid #3798FC;
          border-radius: 4px;
          padding: 8px 15px;
          background-color: #041740;
          .title {
            color: #fff;
            font-size: 14px;
            text-align: left;
          }
          .hotel_status {
            margin-top: 8px;
            display: flex;
            align-items: center;
            span {
              color: #1AAD19;
              font-size: 14px;
            }
            .statusRed {
              color: #F46C6C;
            }
          }
        }
        .table_lists {
          /*height: 360px;*/
          margin-top: 15px;
          overflow-y: scroll;
          position: relative;
          .lists {
            .list {
              background-color: #041740;
              border: 1px solid #3798FC;
              border-radius: 4px;
              margin-bottom: 15px;
              /*width: calc(100% - 0px);*/
              padding: 12px 0;
              display: flex;
              align-items: center;
              justify-content: space-between;
              .list_l {
                width: 35%;
                img {
                  width: 36px;
                  height: 36px;
                  margin: 0 auto;
                }
                span {
                  margin-top: 8px;
                  font-size: 14px;
                  color: #fff;
                }
              }
              .list_r {
                width: 62%;
                text-align: left;
                div {
                  font-size: 14px;
                  color: #fff;
                  margin-bottom: 8px;
                }
                div:last-of-type {
                  margin-bottom: 0;
                }
              }
            }
          }
          .noMsg {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            img {
              width: 80px;
            }
            p {
              font-size: 14px;
              color: #fff;
              margin-top: 10px;
              position: static;
            }
          }
        }
        .table_lists::-webkit-scrollbar {
          display: none;
        }
      }
    }
    #myChart2 {
      top: -35px;
    }
  }

  .statistics_chat {
    position: relative;
    height: 100%;
    .preparation {
      color: #fff;
      font-size: 16px;
      text-align: left;
    }
    .timeChoose {
      color: #fff;
      font-size: 14px;
      display: flex;
      align-items: center;
      span {
        margin-right: 15px;
      }
      .calendarChoose {
        border: 1px solid #D0D0D0;
        border-radius: 4px;
        width: 150px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        img {
          width: 14px;
          height: 14px;
          display: inline-flex;
          margin: 0 15px;
        }
        input {
          color: #303133;
          font-size: 14px;
          border: none;
          background-color: #fff;
          width: 60%;
        }
        input:-moz-placeholder {
          color: #C0C4CC;
        }
        input:-ms-input-placeholder {
          color: #C0C4CC;
        }
        input::-moz-placeholder {
          color: #C0C4CC;
        }
        input::-webkit-input-placeholder {
          color: #C0C4CC;
        }
      }
      .inquire {
        background: #409EFF;
        border-radius: 4px;
        width: 80px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        color: #fff;
        margin-left: 15px;
      }
    }
    .wh_container {
      position: absolute;
      top: 90px;
      /deep/ .wh_content_all {
        background-color: #D0D0D0;
      }
    }
  }

</style>
