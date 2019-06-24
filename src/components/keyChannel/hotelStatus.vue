<template>
  <div>
    <div class="hotelStatus">
      <!-- 酒店列表-->
      <el-container>
        <el-aside>
          <div class="bg"><img src="../../assets/index/zuo.png" alt="" ></div>
          <div class="stranger_title"><img src="../../assets/index/zuoxuanzhong.png" alt="">酒店名称</div>
          <div class="stranger_list" v-if="hotelList.length != 0">
            <div class="list" v-for="(item,index) in hotelList" :key="index">
              <p>
                <span>酒店名称：</span>
                <span>{{item.hotelName}}</span>
              </p>
              <p>
                <span>程序状态：<span :class="item.courseStatus == 0 ? 'blue' : 'red'"></span></span>
                <span>摄像头状态：<span :class="item.cameraStatus == 0 ? 'blue' : item.cameraStatus == 1 ? 'yellow' : 'red'"></span></span>
              </p>
            </div>
          </div>
          <div class="noMsg" v-else>
            <div class="img"><img src="../../assets/index/zanwuneirong.png" alt=""></div>
            <p>暂无内容</p>
          </div>
        </el-aside>
        <!-- 中间主页-->
        <el-main>
          <div class="bg"><img src="../../assets/index/zhong.png" alt=""></div>
          <!-- 摄像头列表-->
          <div class="lists">
            <el-row :gutter="15">
              <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="3"  class="list" v-for="(item,index) in cameraList" v-bind:key="index">
                <div class="grid-content bg-purple">
                  <div class="img">
                    <img src="../../assets/index/canmera.png" alt="" v-if="item.cameraStatus == 0">
                    <img src="../../assets/index/canmera_.png" alt="" v-else>
                  </div>
                  <div class="list_content">
                    <p><span>状态：</span><span :class="item.cameraStatus == 0 ? 'blue' : 'red'"></span></p>
                    <p><span>序列号：</span><span>{{item.serialNum}}</span></p>
                    <p><span>时间：</span><span>{{datetimeparse(item.endTime, 'yy/MM/dd hh/mm/ss')}}</span></p>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-size="18"
              layout="total, prev, pager, next"
              :total="total" v-if="cameraList.length != 0">
            </el-pagination>
            <div class="noMsg" v-else>
              <div class="img"><img src="../../assets/index/zanwuneirong.png" alt=""></div>
              <p>暂无内容</p>
            </div>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
  import {mapState,mapActions} from 'vuex';
  import ElCol from "element-ui/packages/col/src/col";
  import ElMain from "../../../node_modules/element-ui/packages/main/src/main";
  export default {
    components: {ElMain, ElCol},
    name: 'hotelStatus',
    data () {
      return {
        hotelList: [
          {
            hotelName: '全季酒店',
            cameraStatus: 0,
            courseStatus: 0,
            id: 1111,
          },
          {
            hotelName: '全季酒店',
            cameraStatus: 1,
            courseStatus: 0,
            id: 1111,
          },
          {
            hotelName: '全季酒店',
            cameraStatus: 2,
            courseStatus: 0,
            id: 1111,
          }
        ],   // 酒店列表
        currentPage: 1,
        total: 0,
        cameraList: [
          {
            cameraStatus: 0,
            endTime: 1561366130,
            serialNum: 1445421445624,
          },
          {
            cameraStatus: 1,
            endTime: 1561366130,
            serialNum: 1445421445624,
          },
          {
            cameraStatus: 0,
            endTime: 1561366130,
            serialNum: 1445421445624,
          }
        ],  // 摄像头列表
      }
    },
    mounted () {

    },
    methods: {

      ...mapActions([

      ]),

      // 分页
      handleSizeChange (val) {

      },

      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },

    },
    watch: {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .hotelStatus {
    margin: 10px 15px 0;
    width: calc(100vw - 47px);
    .el-aside {
      width: 200px;
      padding: 8px;
      margin-right: 15px;
      position: relative;
      overflow: hidden;
      min-height: calc(100vh - 81px);
      .bg {
        position: absolute;
        z-index: -1;
        left: 0;
        top: 0;
        width: 100%;
        img {
          display: block;
          width: 100%;
          height: calc(100vh - 81px);
        }
      }
      .stranger_title {
        font-size: 14px;
        color: #fff;
        text-align: left;
        line-height: 24px;
        position: relative;
        /*display: inline-block;*/
        /*width: 120px;*/
        img {
          display: none;
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: -1;
          left: 0;
          top: 0;
        }
      }
      .stranger_list {
        max-height: calc(100vh - 100px);
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch; // 为了滚动顺畅
        -ms-scroll-chaining: chained;
        -ms-overflow-style: none;
        -ms-content-zooming: zoom;
        -ms-scroll-rails: none;
        -ms-content-zoom-limit-min: 100%;
        -ms-content-zoom-limit-max: 500%;
        -ms-scroll-snap-type: proximity;
        -ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);
        -ms-overflow-style: none;
        .list {
          margin-top: 8px;
          border: 1px solid #F46C6C;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          p {
            display: table;
            align-items: center;
            span {
              color: #fff;
              font-size: 14px;
              span {
                display: inline-flex;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                margin-right: 30px;
              }
              .blue {
                background-color: blue;
              }
              .yellow {
                background-color: yellow;
              }
              .red {
                background-color: red;
              }
            }
          }
        }
      }
      .stranger_list::-webkit-scrollbar {
        display: none; // 隐藏滚动条
        width: 0px;
        height: 0px;
      }
      .stranger_list .-o-scrollbar {
        -moz-appearance: none !important;
        background: rgba(0, 255, 0, 0) !important;
      }

    }
    .el-main {
      position: relative;
      overflow: hidden;
      .bg {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        img {
          display: inline-block;
          width: 100%;
          height: 100%;
        }
      }
      .lists {
        min-height: calc(100vh - 260px);
        .list {
          margin: 0 0 15px;
          .grid-content {
            border: 1px solid #3798FC;
            border-radius: 8px;
            padding: 5px;
          }
          .img {
            display: block;
          }
          .list_content {
            p {
              display: flex;
              align-items: center;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              span {
                font-size: 14px;
                color: #fff;
              }
              .blue {
                display: inline-flex;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: blue !important;
              }
              .red {
                display: inline-flex;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: red !important;
              }
            }
            p:hover {
              overflow: inherit;
              span {
                background-color: #041740;
                z-index: 5;
              }
            }
          }
        }
      }
    }
    .noMsg {
      text-align: center;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50% ,-50%);
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
        color: #fff;
        font-size: 14px;
        margin-top: 20px;
        text-align: center;
      }
    }
  }

</style>
