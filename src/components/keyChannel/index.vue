<template>
  <div>
    <div class="key_channel">
      <div class="header">
        <el-row>
          <el-col :span="18">
            <div class="title">关键通道后台系统</div>
          </el-col>
          <el-col :span="6">
            <div class="name_logout">
              <span class="name">您好，{{myName}}</span>
              <span class="logout" @click="logout">退出</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="container">
        <div class="tabs">
          <router-link  :to="'/keyChannel'">可疑留宿({{total1}})</router-link>
          <router-link  :to="'/transientPassengers'">过往来客({{total2}})</router-link>
          <router-link  :to="'/handled'">已处理({{total3}})</router-link>
          <router-link  :to="'/whiteList'">白名单({{total4}})</router-link>
        </div>
        <router-view @getMessage="showMsg"></router-view>
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
        myName: '',
        total1: 0,
        total2: 0,
        total3: 0,
        total4: 0,
      }
    },
    mounted () {
      this.myName = sessionStorage.getItem('myName');
      this.getDoubtful(0,['SUSPICIOUS_GUEST'],0);
      this.getDoubtful(0,["NONE", "VISITOR"],1);
      this.getDoubtful(0,["READ"],2);
      this.getWhite(0);
    },
    methods: {

      ...mapActions([
        'replaceto',
        'getDoubtfulList',
        'getWhiteList'
      ]),

      // 退出事件
      logout () {
        this.replaceto('/');
      },

      getDoubtful (page, statuses,type) {
        this.getDoubtfulList ({
          offset: page,
          limit: 15,
          data:{
            createTimeStart:'',
            createTimeEnd:'',
            statuses: statuses
          },
          onsuccess: body => {
            if (type == 0) {
              this.total1 = parseInt(body.headers['x-total-count']);
            }else if (type == 1) {
              this.total2 = parseInt(body.headers['x-total-count']);
            }else {
              this.total3 = parseInt(body.headers['x-total-count']);
            }
          }
        })
      },

      getWhite (page) {
        this.getWhiteList ({
          offset: page,
          limit: 30,
          data:{
            name: '',
            createTimeStart:'',
            createTimeEnd:'',
            removed:false
          },
          onsuccess: body => {
            this.total4 = parseInt(body.headers['x-total-count']);
          }
        })
      },

      showMsg (val) {
        this.getDoubtful(0,['SUSPICIOUS_GUEST'],0);
        this.getDoubtful(0,["NONE", "VISITOR"],1);
        this.getDoubtful(0,["READ"],2);
        this.getWhite(0);
      }

    },
    computed: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .key_channel {
    .header {
      height: 60px;
      line-height: 60px;
      box-shadow: 0 8px 14px 0 rgba(0,0,0,0.05);
      background: #FFFFFF;
      padding: 0 30px;
      .title {
        color: #565C65;
        font-size: 20px;
        text-align: left;
      }
      .name_logout {
        text-align: right;
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
    .container {
      margin-top: 30px;
      background-color: #fff;
      padding: 0 30px;
      .tabs {
        padding: 0 30px;
        text-align: left;
        border-bottom: 2px solid #E4E7ED;
        a {
          display: inline-block;
          padding: 15px 0 5px;
          font-size: 14px;
          color: #606266;
          margin-right: 30px;
          position: relative;
        }
        .router-link-exact-active {
          color: #409EFF;
        }

        .router-link-exact-active:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #409EFF;
        }
      }
    }
  }

</style>
