<template>
  <div>
    <div class="homeIndex">
      <!-- 陌生人待处理-->
      <el-container>
        <el-aside>
          <div class="stranger_title">陌生人(未处理{{strangerNum}})</div>
          <div class="stranger_list" v-if="strangerList.length != 0">
            <div class="list" v-for="(item,index) in strangerList" :key="index">
              <div class="img">
                <img :src="item.facial_pic" alt="" @click="bigImgShow(item.facial_pic)">
              </div>
              <div class="list_content">
                <p><span>时间：</span><span>{{datetimeparse(item.filming_time,'YYYY-MM-DD')}}</span></p>
                <p><span>地点：</span><span>{{item.location ? item.location : '-'}}</span></p>
                <p><span>来源：</span><span>-</span></p>
                <div class="handle" @click="handelBtn(item.illegal_guest_id)">处置</div>
              </div>
            </div>
          </div>
          <div class="noMsg" v-else>
            <div class="img"><img src="../../assets/index/zanwuneirong.png" alt=""></div>
            <p>暂无内容</p>
          </div>
        </el-aside>
        <!-- 右边主页-->
        <el-main>
          <el-container>
            <el-header>
              <el-row>
                <el-col :span="12">
                  <div class="tabs">
                    <el-row>
                      <el-col :span="6"  :class="tab1 ? 'active tab' : 'tab'" @click.native="tabClick(0)">
                        <span>今日抓拍</span><span>({{total1}})</span>
                      </el-col>
                      <el-col :span="6"  :class="tab2 ? 'active tab' : 'tab'" @click.native="tabClick(1)">
                        <span>陌生人</span><span>({{total2}})</span>
                      </el-col>
                      <el-col :span="6"  :class="tab3 ? 'active tab' : 'tab'" @click.native="tabClick(2)">
                        <span>工作人员</span><span>({{total3}})</span>
                      </el-col>
                      <el-col :span="6"  :class="tab4 ? 'active tab' : 'tab'" @click.native="tabClick(3)">
                        <span>在住人</span><span>({{total4}})</span>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="12">
                  <el-row>
                    <el-col :span="6">
                      <img src="../../assets/index/paizhao.png" alt="">
                    </el-col>
                    <el-col :span="6">
                      <span>本周抓拍</span>
                      <span>{{weekNum}}</span>
                    </el-col>
                    <el-col :span="6">
                      <span>本月抓拍</span>
                      <span>{{monthNum}}</span>
                    </el-col>
                    <el-col :span="6">
                      <span>总抓拍</span>
                      <span>{{allNum}}</span>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-header>
            <el-main>
              <!-- 今日抓拍列表-->
              <div class="toDay_lists lists" v-if="tab1">
                <el-row :gutter="15">
                  <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="4"  class="list" v-for="(item,index) in toDayLists" v-bind:key="index">
                    <div class="grid-content bg-purple">
                      <div class="imgs">
                        <div class="idCacrdImg"><img :src="item.most_similar_pic" alt=""  @click="bigImgShow(item.most_similar_pic)"></div>
                        <div class="nowImg"><img :src="item.facial_pic" alt="" @click="bigImgShow(item.facial_pic)"></div>
                      </div>
                      <div class="list_content">
                        <div class="title" v-if="item.guestType == 'STAFF'">工作人员</div>
                        <div class="title" v-else-if="item.guestType == 'VISITOR'">住客</div>
                        <div class="title" v-else>陌生人</div>
                        <div class="content">
                          <p>
                            <span>时间：</span>
                            <span>{{dateDiff(item.filming_time)}}小时前 ({{datetimeparse(item.filming_time,'hh:mm:ss')}})</span>
                          </p>
                          <p>
                            <span>地点：</span>
                            <span>{{item.location}}</span>
                          </p>
                          <p v-if="item.guestType == 'STAFF'">
                            <span>来源：</span>
                            <span>{{hotelName}}工作人员库</span>
                          </p>
                          <p v-else-if="item.guestType == 'VISITOR'">
                            <span>来源：</span>
                            <span>{{hotelName}}住客库</span>
                          </p>
                          <p v-else>
                            <span>来源：</span>
                            <span>-</span>
                          </p>
                          <p>
                            <span>类型：</span>
                            <span v-if="item.guestType == 'STAFF'">工作人员</span>
                            <span v-else-if="item.guestType == 'VISITOR'">住客</span>
                            <span v-else>陌生人</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange1"
                  :current-page.sync="currentPage1"
                  :page-size="18"
                  layout="total, prev, pager, next"
                  :total="total1" v-if="toDayLists.length != 0">
                </el-pagination>
                <div class="noMsg" v-else>
                  <div class="img"><img src="../../assets/index/zanwuneirong.png" alt=""></div>
                  <p>暂无内容</p>
                </div>
              </div>
              <!-- 陌生人列表-->
              <div class="stranger_lists lists" v-if="tab2">
                <el-row :gutter="15">
                  <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="4"  class="list" v-for="(item,index) in strangerLists" v-bind:key="index">
                    <div class="grid-content bg-purple">
                      <div class="imgs">
                        <div class="idCacrdImg"><img :src="item.most_similar_pic" alt=""  @click="bigImgShow(item.most_similar_pic)"></div>
                        <div class="nowImg"><img :src="item.facial_pic" alt="" @click="bigImgShow(item.facial_pic)"></div>
                      </div>
                      <div class="list_content">
                        <div class="title" v-if="item.guestType == 'STAFF'">工作人员</div>
                        <div class="title" v-else-if="item.guestType == 'VISITOR'">住客</div>
                        <div class="title" v-else>陌生人</div>
                        <div class="content">
                          <p>
                            <span>时间：</span>
                            <span>{{dateDiff(item.filming_time)}}小时前 ({{datetimeparse(item.filming_time,'hh:mm:ss')}})</span>
                          </p>
                          <p>
                            <span>地点：</span>
                            <span>{{item.location}}</span>
                          </p>
                          <p v-if="item.guestType == 'STAFF'">
                            <span>来源：</span>
                            <span>{{hotelName}}工作人员库</span>
                          </p>
                          <p v-else-if="item.guestType == 'VISITOR'">
                            <span>来源：</span>
                            <span>{{hotelName}}住客库</span>
                          </p>
                          <p v-else>
                            <span>来源：</span>
                            <span>-</span>
                          </p>
                          <p>
                            <span>类型：</span>
                            <span v-if="item.guestType == 'STAFF'">工作人员</span>
                            <span v-else-if="item.guestType == 'VISITOR'">住客</span>
                            <span v-else>陌生人</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange2"
                  :current-page.sync="currentPage2"
                  :page-size="12"
                  layout="total, prev, pager, next"
                  :total="total2" v-if="strangerLists.length != 0">
                </el-pagination>
                <div class="noMsg" v-else>
                  <div class="img"><img src="../../assets/index/zanwuneirong.png" alt=""></div>
                  <p>暂无内容</p>
                </div>
              </div>
              <!-- 工作人员列表-->
              <div class="white_lists lists" v-if="tab3">
                <el-row :gutter="15">
                  <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="4"  class="list" v-for="(item,index) in whiteLists" v-bind:key="index">
                    <div class="grid-content bg-purple">
                      <div class="imgs">
                        <div class="idCacrdImg"><img :src="item.most_similar_pic" alt=""  @click="bigImgShow(item.most_similar_pic)"></div>
                        <div class="nowImg"><img :src="item.facial_pic" alt="" @click="bigImgShow(item.facial_pic)"></div>
                      </div>
                      <div class="list_content">
                        <div class="title" v-if="item.guestType == 'STAFF'">工作人员</div>
                        <div class="title" v-else-if="item.guestType == 'VISITOR'">住客</div>
                        <div class="title" v-else>陌生人</div>
                        <div class="content">
                          <p>
                            <span>时间：</span>
                            <span>{{dateDiff(item.filming_time)}}小时前 ({{datetimeparse(item.filming_time,'hh:mm:ss')}})</span>
                          </p>
                          <p>
                            <span>地点：</span>
                            <span>{{item.location}}</span>
                          </p>
                          <p v-if="item.guestType == 'STAFF'">
                            <span>来源：</span>
                            <span>{{hotelName}}工作人员库</span>
                          </p>
                          <p v-else-if="item.guestType == 'VISITOR'">
                            <span>来源：</span>
                            <span>{{hotelName}}住客库</span>
                          </p>
                          <p v-else>
                            <span>来源：</span>
                            <span>-</span>
                          </p>
                          <p>
                            <span>类型：</span>
                            <span v-if="item.guestType == 'STAFF'">工作人员</span>
                            <span v-else-if="item.guestType == 'VISITOR'">住客</span>
                            <span v-else>陌生人</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange3"
                  :current-page.sync="currentPage3"
                  :page-size="12"
                  layout="total, prev, pager, next"
                  :total="total3" v-if="whiteLists.length != 0">
                </el-pagination>
                <div class="noMsg" v-else>
                  <div class="img"><img src="../../assets/index/zanwuneirong.png" alt=""></div>
                  <p>暂无内容</p>
                </div>
              </div>
              <!-- 在住人列表-->
              <div class="ailve_lists lists" v-if="tab4">
                <el-row :gutter="15">
                  <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="4"  class="list" v-for="(item,index) in aliveLists" v-bind:key="index">
                    <div class="grid-content bg-purple">
                      <div class="imgs">
                        <div class="idCacrdImg"><img :src="item.most_similar_pic" alt=""  @click="bigImgShow(item.most_similar_pic)"></div>
                        <div class="nowImg"><img :src="item.facial_pic" alt="" @click="bigImgShow(item.facial_pic)"></div>
                      </div>
                      <div class="list_content">
                        <div class="title" v-if="item.guestType == 'STAFF'">工作人员</div>
                        <div class="title" v-else-if="item.guestType == 'VISITOR'">住客</div>
                        <div class="title" v-else>陌生人</div>
                        <div class="content">
                          <p>
                            <span>时间：</span>
                            <span>{{dateDiff(item.filming_time)}}小时前 ({{datetimeparse(item.filming_time,'hh:mm:ss')}})</span>
                          </p>
                          <p>
                            <span>地点：</span>
                            <span>{{item.location}}</span>
                          </p>
                          <p v-if="item.guestType == 'STAFF'">
                            <span>来源：</span>
                            <span>{{hotelName}}工作人员库</span>
                          </p>
                          <p v-else-if="item.guestType == 'VISITOR'">
                            <span>来源：</span>
                            <span>{{hotelName}}住客库</span>
                          </p>
                          <p v-else>
                            <span>来源：</span>
                            <span>-</span>
                          </p>
                          <p>
                            <span>类型：</span>
                            <span v-if="item.guestType == 'STAFF'">工作人员</span>
                            <span v-else-if="item.guestType == 'VISITOR'">住客</span>
                            <span v-else>陌生人</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange4"
                  :current-page.sync="currentPage4"
                  :page-size="15"
                  layout="total, prev, pager, next"
                  :total="total4" v-if="aliveLists.length != 0">
                </el-pagination>
                <div class="noMsg" v-else>
                  <div class="img"><img src="../../assets/index/zanwuneirong.png" alt=""></div>
                  <p>暂无内容</p>
                </div>
              </div>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
      <!-- 大图预览效果-->
      <div class="img-show-mask" id="img-show-mask" v-show="maskBtn" @click="closeBigImg">
        <img :src="bigImgSrc" class="bigImg" id="bigImg" />
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState,mapActions} from 'vuex';
  export default {
    name: 'keyChannel',
    data () {
      return {
        hotelName: sessionStorage.hotelName, // 酒店名
        maskBtn:false,         // 控制大图
        bigImgSrc: '',         // 大图url
        strangerList: [],   // 陌生人待处理的列表
        strangerNum: 0,     // 陌生人待处理的数量
        tab1: true,
        tab2: false,
        tab3: false,
        tab4: false,
        currentPage1: 1,
        currentPage2: 1,
        currentPage3: 1,
        currentPage4: 1,
        total1: 0,              // 今日抓拍数量
        total2: 0,              // 陌生人数量
        total3: 0,              // 工作人员数量
        total4: 0,              // 在住人数量
        weekNum: 0,           // 本周抓拍数量
        monthNum: 0,          // 本月抓拍数量
        allNum: 0,            // 所有抓拍数量
        toDayLists: [],        // 今日抓拍列表
        strangerLists: [],        // 陌生人列表
        whiteLists: [],        // 工作人员列表
        aliveLists: [],        // 在住人列表
        websock: null,
      }
    },
    mounted () {
      this.getLists(0,'',0,18,'');
      this.getLists(0,'SUSPICIOUS_GUEST',4,200,'SUSPICIOUS_GUEST');
      this.totalList();
      this.initWebSocket();
      console.log(this.datetimeparse(new Date(new Date(new Date().toLocaleDateString()).getTime()),'YYYY-MM-DD hh:mm:ss'));
    },
    methods: {

      ...mapActions([
        'getDoubtfulList','totalGuest','hasChecked'
      ]),

      // 打开大图效果
      bigImgShow: function(url) {
        this.bigImgSrc = url;
        this.maskBtn = true;
      },

      // 关闭大图效果
      closeBigImg: function() { //关闭图片预览
        this.maskBtn = false;
      },

      // tab切换
      tabClick(num) {
        if (num == 0) {
          this.tab1 = true;
          this.tab2 = false;
          this.tab3 = false;
          this.tab4 = false;
          this.getLists(0,'',0,18,'');
        }else if (num == 1) {
          this.tab1 = false;
          this.tab2 = true;
          this.tab3 = false;
          this.tab4 = false;
          this.getLists(0,'SUSPICIOUS_GUEST',1,18,'READ');
        }else if (num == 2) {
          this.tab1 = false;
          this.tab2 = false;
          this.tab3 = true;
          this.tab4 = false;
          this.getLists(0,'STAFF',2,18,'');
        }else {
          this.tab1 = false;
          this.tab2 = false;
          this.tab3 = false;
          this.tab4 = true;
          this.getLists(0,'VISITOR',3,18,'');
        }
      },

      // 分页
      handleSizeChange (val) {

      },

      handleCurrentChange1(val) {
        console.log(`当前页: ${val}`);
        this.getLists(val-1,'',0,18,'');
      },
      handleCurrentChange2(val) {
        console.log(`当前页2: ${val}`);
        this.getLists(val-1,'SUSPICIOUS_GUEST ',1,18,'READ');
      },
      handleCurrentChange3(val) {
        console.log(`当前页3: ${val}`);
        this.getLists(val-1,'STAFF',2,18,'');
      },
      handleCurrentChange4(val) {
        console.log(`当前页4: ${val}`);
        this.getLists(val-1,'VISITOR',3,18,'');
      },

      // 距离现在相差几小时函数
      dateDiff(outTime) {
        let newTime = new Date().getTime();
        let iHour;
        iHour = parseInt(Math.abs(newTime - outTime) / 1000 / 60 / 60);
        return iHour;
      },


      // 获取数据列表
      getLists (page,statuses,type,limit,status) {
        page = page * 15;
        this.doubtfulList = [];
        let obj = {
          createTimeStart: new Date(this.datetimeparse(new Date(new Date(new Date().toLocaleDateString()).getTime()),'YYYY-MM-DD hh:mm:ss')).getTime(),
          createTimeEnd: ''
        };
        if (status != '') {
          obj.status = status
        }
        if (statuses != '') {
          obj.guestType = statuses
        }
        this.getDoubtfulList ({
          offset: page,
          limit: limit,
          data: obj,
          onsuccess: body => {
            if (type == 0) {
//              this.total1 = parseInt(body.headers['x-total-count']);
              this.toDayLists = [...body.data.data];
            }else if (type == 1) {
//              this.total2 = parseInt(body.headers['x-total-count']);
              this.strangerLists = [...body.data.data];
            }else if (type == 2) {
//              this.total3 = parseInt(body.headers['x-total-count']);
              this.whiteLists = [...body.data.data];
            }else if (type == 3) {
//              this.total4 = parseInt(body.headers['x-total-count']);
              this.aliveLists = [...body.data.data];
            }else {
              this.strangerNum = parseInt(body.headers['x-total-count']);
              this.strangerList = [...body.data.data];
            }
          }
        })
      },

      // 获取总数列表
      totalList () {
        this.totalGuest({
          onsuccess: body => {
            if (body.data.errcode == 0) {
              this.total1 = body.data.data.count;
              this.total2 = body.data.data.suspiciousCount;
              this.total3 = body.data.data.staffCount;
              this.total4 = body.data.data.visitorCount;
              this.weekNum = body.data.data.weekTotal;
              this.monthNum = body.data.data.monthTotal;
              this.allNum = body.data.data.total;
            }
          }
        })
      },

      // 待处理的处置事件
      handelBtn(id){
        this.hasChecked({
          illegalGuestId: id,
          onsuccess:body=>{
            this.$message({
              message: '处置成功',
              type: 'success'
            });
            this.strangerNum--;
            this.strangerList.forEach((item,index) => {
                if (item.illegal_guest_id == id) {
                  this.$nextTick(() => {
                    this.strangerList.splice(index, 1);
                    this.total1++;
                    this.total2++;
                    if (this.tab1 && this.currentPage1 == 1) {
                      this.toDayLists.unshift(item);
                      if (this.toDayLists.length > 18) {
                        this.toDayLists.splice(10,1);
                      }
                    }else if (this.tab2 && this.currentPage2 == 1) {
                      this.strangerLists.unshift(item);
                      if (this.strangerLists.length > 10) {
                        this.strangerLists.splice(10,1);
                      }
                    }
                  });
                }
            })
          }
        })
      },

      //初始化weosocket
      initWebSocket(){
        //ws地址
        // const wsuri = process.env.WS_API + "/websocket/threadsocket";
        const wsuri = 'ws://qa.fortrun.cn:8012/websocket/' + sessionStorage.hotelId;
        this.websock = new WebSocket(wsuri);
        this.websock.onopen = this.websocketonopen;
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onclose = this.websocketclose;
      },
      websocketonopen(e){ //建立通道
        // let redata = e;
        console.log('============websocket建立链接==============')
      },
      websocketonmessage(e){ //数据接收
        console.log('============websocket数据接收成功==============');
        console.log(e.data);
        if (e.data != '连接成功') {
          let val = JSON.parse(e.data);
          this.weekNum = val.weekTotal;
          this.monthNum = val.monthTotal;
          this.allNum = val.total;
          this.total1++;
          let newData = JSON.parse(val.illegalGuest);
          this.$nextTick(() => {
            if (newData.guestType == 'SUSPICIOUS_GUEST') {
              this.strangerNum++;
              this.strangerList.unshift(newData);
            }else {
              this.toDayLists.unshift(newData);
              if (this.toDayLists.length > 18) {
                this.toDayLists.splice(10,1);
              }
            }
          });
          console.log(newData);
        }
      },
      websocketsend(agentData){//数据发送
        console.log('============websocket数据发送成功==============')
        this.websock.send(agentData);
      },
      websocketclose(e){  //关闭通道
        console.log("关闭通道connection closed (" + e.code + ")");
      },

    },
    watch: {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .homeIndex {
    margin: 10px 15px;
    width: calc(100vw - 30px);
    .el-aside {
      background-color: #fff;
      width: 200px;
      padding: 8px;
      margin-right: 15px;
      .stranger_title {
        font-size: 16px;
        color: #303133;
        text-align: left;
      }
      .stranger_list {
        max-height: 800px;
        overflow-y: scroll;
        .list {
          margin-top: 5px;
          border: 1px solid #F46C6C;
          border-radius: 8px;
          padding: 8px;
          display: flex;
          justify-content: flex-start;
          .img {
            margin-right: 8px;
            width: 100px;
            height: 100px;
            border-radius: 8px;
            img {
              display: inline-flex;
              width: 100%;
              height: 100%;
              cursor: pointer;
            }
          }
          .list_content {
            width: 174px;
            position: relative;
            p {
              display: flex;
              justify-content: flex-start;
              color: #909399;
              font-size: 14px;
              text-align: left;
            }
            p:last-of-type {
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              display: -webkit-box;
              -webkit-box-orient: vertical;
            }
            .handle {
              background: #409EFF;
              border-radius: 2px;
              padding: 0 12px;
              font-size: 14px;
              color: #fff;
              position: absolute;
              bottom: 0;
              right: 0;
              cursor: pointer;
            }
          }
        }
      }
    }
    .el-main {
      padding: 0;
      .el-header {
        height: 70px !important;
        padding: 0;
        .el-col-12 {
          background-color: #fff;
          height: 70px;
          margin-right: 15px;
          .tabs {
            height: 100%;
            .el-row {
              height: 100%;
              .tab {
                color: #909399;
                font-size: 14px;
                cursor: pointer;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                span {
                  display: block;
                }
              }
              .active {
                color: #409EFF;
              }
            }
          }
        }
        .el-col-12:last-of-type {
          width: calc(50% - 15px);
          margin-right: 0;
          .el-row {
            height: 100%;
            .el-col-6 {
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              color: #A6ADB4;
              height: 100%;
              flex-direction: column;
              img {
                display: inline-flex;
                width: 26.7px;
                height: 20.7px;
              }
              span {
                display: flex;
                word-wrap:break-word
              }
            }
          }
        }
      }
      .el-main {
        margin-top: 15px;
        padding: 15px;
        background-color: #fff;
        .lists {
          .el-row {
            margin-bottom: 15px;
            &:last-child {
              margin-bottom: 0;
            }
          }
          .list {
            margin: 0 0 15px;
            .grid-content {
              border: 1px solid #D2D6E1;
              border-radius: 8px;
              padding: 5px;
              .imgs {
                display: flex;
                justify-content: space-between;
                div {
                  position:relative;
                  width: 48.5%;
                  height:0;
                  padding-top:50%;
                  border-radius: 8px;
                  img {
                    position:absolute;
                    top:0;
                    left:0;
                    width:100%;
                    height:100%;
                    border-radius: 8px;
                    cursor: pointer;
                  }
                }
              }
              .list_content {
                .title {
                  font-size: 20px;
                  color: #606266;
                  margin: 8px 0;
                  text-align: left;
                }
                .content {
                  p {
                    display: flex;
                    justify-content: flex-start;
                    font-size: 14px;
                    text-align: left;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    span:first-of-type {
                      color: #909399;
                    }
                    span:last-of-type {
                      color: #303133;
                      font-size: 15px;
                    }
                  }
                  p:nth-of-type(3) span:last-of-type {
                    color: #F46C6C;
                  }
                }
              }
            }
            .grid-content:hover {
              border: 1px solid #F46C6C;
            }
          }
        }
      }
    }
    .noMsg {
      margin: 250px auto;
      text-align: center;
      .img {
        width: 100px;
        height: 100px;
        margin: 0 auto;
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      p {
        color: #606266;
        font-size: 14px;
        margin-top: 20px;
        text-align: center;
      }
    }

    .img-show-mask {
      width: 100vw;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 3000;
      background: rgba(0, 0, 0, .5);
    }

    .img-show-mask .bigImg {
      width: 500px;
      position: fixed;
      z-index: 3100;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin: auto;
    }
  }

</style>
