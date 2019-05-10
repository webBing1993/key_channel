<template>
  <div>
    <div class="key_channel">
      <el-container>
        <el-header>
          <el-aside>
            <i><img src="../../assets/index/tongdao.png" alt=""></i>
            <span>关键通道抓拍系统</span>
          </el-aside>
          <el-row>
            <el-col :span="18">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="首页" name="first">首页</el-tab-pane>
                <el-tab-pane label="统计" name="second">统计</el-tab-pane>
                <el-tab-pane label="设置" name="third">设置</el-tab-pane>
              </el-tabs>
            </el-col>
            <el-col :span="6">
              <div class="name_logout">
                <span class="name">您好，{{myName}}</span>
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
        activeName: sessionStorage.getItem('tab') ? sessionStorage.getItem('tab') : 'first',
        myName: '',
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
        console.log(tab.name);
        if (tab.name == 'first') {
          this.replaceto('keyChannel')
        }else if (tab.name == 'second') {
          this.replaceto('statistics')
        }else {
          this.replaceto('whiteList')
        }
        sessionStorage.setItem('tab',tab.name);
      }

    },
    watch: {
      'myName': function (val) {
        if (val == '') {
          this.replaceto('/');
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .key_channel {
    .el-header {
      position: fixed;
      background-color: #fff;
      z-index: 5;
      left: 0;
      top: 0;
      width: 100vw;
      height: 48px !important;
      display: flex;
      align-items: center;
      padding: 0;
      background-color: #fff;
      .el-aside {
        background-color: #002140;
        width: 200px;
        height: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
        i {
          width: 30px;
          height: 30px;
          display: inline-flex;
          margin-right: 5px;
          img {
            display: inline-block;
            width: 100%;
            height: 100%;
          }
        }
        span {
          font-size: 16px;
          color: #fff;
        }
      }
      .el-row {
        width: calc(100vw - 200px);
        height: 48px;
        display: flex;
        align-items: center;
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
          .name {
            font-size: 16px;
            color: #5A5E66;
          }
          .logout {
            font-size: 16px;
            color: #409EFF;
            padding: 0 30px;
            cursor: pointer;
          }
        }
      }
    }
    .el-container {
      margin-top: 24px;
    }
  }

</style>
