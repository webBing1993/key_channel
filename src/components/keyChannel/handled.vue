<!-- 已处理-->
<template>
  <div>
    <div class="handled">
      <el-row :gutter="20">
        <el-col :span="6"  v-for="item in doubtfulList">
          <div class="grid-content">
            <div class="fl img">
              <img :src="item.facial_pic" alt="">
            </div>
          </div>
          <div class="fr content">
            <div class="time">时间 {{datetimeparse(item.filming_time,'YYYYMMDD hh:mm:ss')}}</div>
            <div class="address">位置 -</div>
            <div class="sure">已确认 {{datetimeparse(item.update_time,'YYYYMMDD hh:mm:ss')}}</div>
          </div>
        </el-col>
      </el-row>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="15"
        layout="total, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {mapState,mapActions} from 'vuex';
  export default {
    name: 'keyChannel',
    data () {
      return {
        doubtfulList: [],
        currentPage: 1,
        total: 0,
      }
    },
    mounted () {
      this.getDoubtful(0);
    },
    methods: {

      ...mapActions([
        'goto',
        'getDoubtfulList',
        'hasChecked'
      ]),
      getDoubtful (page) {
        this.doubtfulList = [];
        this.getDoubtfulList ({
          offset: page,
          limit: 15,
          data:{
            createTimeStart:'',
            createTimeEnd:'',
            statuses: ["READ"]
          },
          onsuccess: body => {
            this.total = parseInt(body.headers['x-total-count']);
            this.doubtfulList = [...body.data.data];
          }
        })
      },

      // 分页
      handleSizeChange (val) {

      },

      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.getDoubtful(val - 1);
      }

    },
    computed: {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .handled {
    margin-top: 30px;
    .el-row {
      margin: 0 !important;
      .el-col {
        width: 284px;
        border: 1px solid #409EFF;
        position: relative;
        padding: 0 !important;
        margin-right: 30px;
        margin-bottom: 30px;
        .img {
          display: inline-block;
          width: 80px;
          height: 80px;
          margin-right: 8px;
          img {
            display: inline-block;
            width: 100%;
            height: 100%;
          }
        }
        .content {
          width: 194px;
          font-size: 12px;
          color: #000;
          text-align: left;
          .time {
            margin: 5px 0;
          }
          .sure {
            font-size: 12px;
            position: absolute;
            bottom: 8px;
            left: 88px;
            color: #409EFF;
          }
        }
      }
    }
  }

</style>
