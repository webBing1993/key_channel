<!-- 操作日志-->
<template>
  <div>
    <div class="whiteList" v-show="showTrue">
      <div class="bg" ref="bgHeight"><img src="../../assets/index/logBg.png" alt=""></div>
      <div class="whiteContent">
        <div class="white_title">
          操作日志
        </div>
        <div class="search_add">
          <el-form :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item label="">
              <el-col :span="16">
                <el-input v-model="searchForm.searchString" placeholder="请输入酒店名称/账号/操作内容" clearable></el-input>
              </el-col>
              <el-col :span="2">&nbsp;</el-col>
              <el-col :span="6">
                <el-button type="primary" @click="reach" class="btnColor" >查询</el-button>
              </el-col>
            </el-form-item>
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="searchForm.timeArr"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="reach">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <div class="whiteLists">
          <el-table
            :data="whiteList"
            stripe
            :height="tableHeight"
            style="width: 100%" >
            <el-table-column
              label="活动时间" >
              <template slot-scope="scope" >
                <span>{{ scope.row.time }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="hotelName"
              label="酒店名称">
            </el-table-column>
            <el-table-column
              label="账号名称"  >
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作内容"  >
              <template slot-scope="scope">
                <span>{{ scope.row.content }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="30"
            layout="total, prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState,mapActions} from 'vuex';
  import httpTool from '../../tool/httpTool.js'
  export default {
    name: 'keyChannel',
    data () {
      return {
        showTrue: false,
        whiteList: [],
        currentPage: 1,
        total: 0,
        searchForm: {
          searchString: '',
          timeArr: [],
        },
        tableHeight: '',
      }
    },
    beforeMount() {
      let end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
      let start = new Date(new Date(new Date().toLocaleDateString()).getTime());
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
      this.searchForm.timeArr = [start, end];
    },
    mounted () {
      this.showTrue = true;
      this.$nextTick(() => {
        this.tableHeight = this.$refs.bgHeight.offsetHeight - 230;
      });
      this.getWhite(0);
    },
    methods: {

      ...mapActions([
        'goto', 'getOperationLog'
      ]),

      watchTest() {
        console.log(111123456789);
      },

      getWhite (page) {
        this.getOperationLog({
          offset: page,
          limit: 10,
          data: {
            startTime: new Date(this.searchForm.timeArr[0]).getTime(),
            endTime:  new Date(this.searchForm.timeArr[1]).getTime() + 24 * 60 * 60 * 1000 -1,
            keyword: this.searchForm.searchString
          },
          onsuccess: body => {
              if (body.data.code == 0) {
                this.whiteList = body.data.data;
                this.total = parseInt(body.headers['x-total-count']);
              }
          }
        })
      },

      // 搜索事件
      reach() {
        this.getWhite(0);
      },

      // 分页
      handleSizeChange (val) {

      },

      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.getWhite(val - 1);
      },
    },
    computed: {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .whiteList {
    width: calc(100vw - 80px);
    margin: 15px 15px 0;
    padding: 15px;
    position: relative;
    .bg {
      position: absolute;
      z-index: 5;
      left: 0;
      top: 0;
      width: 100%;
      height: calc(100vh - 85px);
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .whiteContent {
      position: absolute;
      z-index: 10;
      left: 0;
      top: 0;
      width: 100%;
      /*height: calc(100vh - 60px);*/
    }
    .white_title {
      padding: 5px 10px;
      text-align: left;
      font-size: 14px;
      color: #fff;
    }
    .search_add {
      margin: 30px 0;
      padding: 0 36px;
      .demo-form-inline {
        text-align: left;
        /deep/ .el-form-item {
          margin-right: 80px;
        }
        /deep/ .el-form-item__label {
          font-size: 14px;
          color: #ffffff;
          padding-right: 42px;
        }
        /deep/ .el-input__inner {
          border: 1px solid #4F83D0;
          border-radius: 4px;
          background: transparent;
          font-size: 14px;
          color: #FFFFFF;
        }
        /deep/ .el-range-editor .el-range-input {
          background: transparent;
          color: #fff;
        }
        /deep/ .el-date-editor .el-range__close-icon {
          display: none;
        }
        /deep/ .el-date-editor .el-range-separator {
          font-size: 14px;
          color: #FFFFFF;
        }
        .btnColor {
          border: 1px solid #4F83D0;
          border-radius: 4px;
          background-color: transparent;
          font-size: 14px;
          color: #3798FC;
        }
      }
    }
    .whiteLists {
      padding: 0 112px 0 36px;
      /deep/ .el-table th, /deep/ .el-table tr {
        background: transparent;
        padding: 26px 0;
        color: #ffffff;
      }
      /deep/ .el-table th {
        font-size: 14px;
      }
      /deep/ .el-table td, /deep/ .el-table th.is-leaf {
        border-bottom: none;
        border-top: 2px solid #142B5B;
      }
      /deep/ .el-table {
        background: transparent;
      }
      /deep/ .el-table::before {
        display: none;
      }
      /deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
        background: #041740;
      }
      /deep/ .el-table tr .cell {
        font-size: 12px;
      }
    }
  }

  /deep/ .el-pagination {
    position: fixed;
    width: calc(100vw - 80px);
    bottom: 0;
    padding: 25px 0;
    left: 15px;
  }

  /deep/ .el-pagination__total {
    color: #5691D1;
  }

  /deep/ .el-pagination button {
    background: #015296;
    border: 1px solid #5691D1;
    color: #5691D1;
    border-radius: 8px;
  }

  /deep/ .el-pager li {
    background-color: transparent;
    border: 1px solid #5691D1;
    color: #5691D1;
    margin: 0 5px;
    border-radius: 8px;
  }

  /deep/ .el-pager li.active {
    color: #fff;
    background: #015296;
    border: 1px solid #5691D1;
  }

</style>
