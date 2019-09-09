<template>
  <div>
    <div class="key_channel">
      <el-container>
        <el-header>
          <el-row>
            <el-col :span="16">
              <img src="../../assets/index/logo.png" alt="">
              <div class="tabs" v-if="roleShow">
                <span class="active"><img :src="handerImg.img[1]" alt="">首页</span>
              </div>
              <div class="tabs" v-else>
                <span :class="handleIndex == 1 ? 'active' : ''" @click="handleClick(1)"><img :src="handleIndex == 1 ? handerImg.img[1] : handerImg.img[0]" alt="">首页</span>
                <span :class="handleIndex == 2 ? 'active' : ''" @click="handleClick(2)"><img :src="handleIndex == 2 ? handerImg.img[1] : handerImg.img[0]" alt="">设置</span>
                <span :class="handleIndex == 3 ? 'active' : ''" @click="handleClick(3)" v-if="massage"><img :src="handleIndex == 3 ? handerImg.img[1] : handerImg.img[0]" alt="" >设备监控</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="name_logout">
                <img src="../../assets/index/diwen.png" alt="">
                <span class="name"><img src="../../assets/index/geren.png" alt="">欢迎您，{{myName}}</span>
                <span class="logout" @click="logout">退出</span>
              </div>
            </el-col>
          </el-row>
        </el-header>
        <el-container>
          <router-view></router-view>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
  import {mapState,mapActions} from 'vuex';
  export default {
    name: 'keyChannel',
    data () {
      return {
        roleShow: sessionStorage.roleId != '' ? true : false,  // 判断权限
        myName: '',
        handleIndex: sessionStorage.getItem('handleIndex') ? sessionStorage.getItem('handleIndex') : 1,
        handerImg: {
          img: [require('../../assets/index/topweixuan.png'),require('../../assets/index/topxuanzhong.png')],
        },
        massage: sessionStorage.manage == 'true' ? true :false
      }
    },
    mounted () {
      this.myName = sessionStorage.getItem('myName');
    },
    methods: {

      ...mapActions([
        'replaceto',
      ]),

      // 退出事件
      logout () {
        sessionStorage.removeItem('tab');
        this.replaceto('/');
      },

      // tab点击事件
      handleClick(tab) {
        if (tab == 1) {
          this.replaceto('keyChannel')
//          this.replaceto('home')
        }else if(tab == 2) {
          this.replaceto('whiteList')
        }else {
          this.replaceto('hotelStatus');
        }
        this.handleIndex = tab;
        sessionStorage.setItem('handleIndex', tab);
      }

    },
    watch: {
      'myName': function (val) {
        if (val == '') {
          this.replaceto('/');
        }
      }
    },
    beforeRouteLeave(to,from,next) {
      if (to.path == '/') {
        sessionStorage.removeItem('handleIndex');
      }
      next();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .key_channel {
    .el-header {
      height: 58px !important;
      display: flex;
      align-items: center;
      padding: 10px 0;
      background-color: #041740;
      .el-row {
        width: 100vw;
        height: 100%;
        display: flex;
        align-items: center;
        .el-col-16 {
          text-align: left;
          padding-left: 15px;
          position: relative;
          img {
            max-height: 38px;
          }
          .tabs {
            position: absolute;
            left: 240px;
            top: 50%;
            transform: translateY(-50%);
            span {
              position: relative;
              margin-right: 8px;
              color: #3798FC;
              font-size: 14px;
              text-align: center;
              line-height: 30px;
              display: inline-block;
              width: 66px;
              cursor: pointer;
              img {
                position: absolute;
                left: 0;
                top: 0;
                height: 30px;
                display: inline-block;
                width: 66px;
                z-index: -1;
              }
            }
            span.active {
              color: #fff;
            }
          }
        }
        /deep/ .el-tabs__header {
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        /deep/ .el-tabs__nav-wrap::after {
          display: none;
        }
        /deep/ .el-tabs__content {
          display: none;
        }
        /deep/ .el-tabs__item {
          font-size: 16px;
        }
        /deep/ .el-tabs__active-bar {
          display: none;
        }
        .name_logout {
          text-align: right;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          height: 48px;
          position: relative;
          .name {
            font-size: 14px;
            color: #3798FC;
            display: inline-flex;
            align-items: center;
            position: absolute;
            right: 110px;
            img {
              display: inline-flex;
              width: 24px;
              height: 24px;
              margin-right: 8px;
            }
          }
          .logout {
            position: absolute;
            right: 30px;
            font-size: 14px;
            color: #fff;
            padding: 0 30px;
            cursor: pointer;
          }
        }
        .name_logout>img {
          position: absolute;
          display: inline-block;
          width: 100%;
          left: 0;
          top: 0;
        }
      }
    }
  }

</style>
