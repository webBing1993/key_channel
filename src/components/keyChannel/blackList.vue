<!-- 黑名单/灰名单-->
<template>
  <div>
    <div class="whiteList" v-show="showTrue">
      <div class="bg" ref="bgHeight"><img src="../../assets/index/black.png" alt=""></div>
      <div class="whiteContent" ref="whiteHeight">
        <div class="white_title">
          <div class="tabs">
            <span :class="tabIndex == 1 ? 'active' : ''" @click="tabIndexClick(1)"><img :src="tabIndex == 1 ? handerImg.img[1] : handerImg.img[0]" alt="">白名单</span>
            <span :class="tabIndex == 2 ? 'active' : ''" @click="tabIndexClick(2)"><img :src="tabIndex == 2 ? handerImg.img[1] : handerImg.img[0]" alt="">灰名单</span>
            <span :class="tabIndex == 3 ? 'active' : ''" @click="tabIndexClick(3)"><img :src="tabIndex == 3 ? handerImg.img[1] : handerImg.img[0]" alt="">黑名单</span>
            <span :class="tabIndex == 4 ? 'active' : ''" @click="tabIndexClick(4)"><img :src="tabIndex == 4 ? handerImg.img[1] : handerImg.img[0]" alt="">告警设置</span>
          </div>
        </div>
        <div class="search_add" v-if="tabIndex < 4">
          <div class="add" @click="add"><img src="../../assets/index/tianjia.png" alt=""></div>
          <div class="search">
            <input type="text" v-model="name" placeholder="请输入人员姓名">
            <span  @click="reach"><img src="../../assets/index/sousuo.png" alt=""></span>
            <!--<i @click="reach"><img src="../../assets/index/sousuo@2x.png" alt=""></i>-->
          </div>
        </div>
        <div v-if="whiteList.length != 0 && tabIndex < 4" class="whiteLists">
          <el-row>
            <el-col :span="6"  v-for="item in whiteList" v-bind:key="item.id">
              <div class="grid-content">
                <div class="img">
                  <img :src="item.imgUrl" alt=""  @click="bigImgShow(item.imgUrl)">
                </div>
              </div>
              <div class="content">
                <p>{{ tabIndex == 1 ? '白名单人员' : tabIndex == 2 ? '灰名单人员' : '黑名单人员' }}</p>
                <div class="name"><span>姓名：</span>{{item.name}}</div>
                <div class="name"><span>类型：</span>{{ tabIndex == 1 ? '白名单' : tabIndex == 2 ? '灰名单' : '黑名单' }}</div>
                <div class="remove" @click="remove(item)"><img src="../../assets/index/shanchu.png" alt=""></div>
              </div>
            </el-col>
          </el-row>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="30"
            layout="total, prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
        <div class="noMsg" v-if="whiteList.length == 0 && tabIndex < 4">
          <div class="img"><img src="../../assets/index/zanwuneirong.png" alt=""></div>
          <p>暂无内容</p>
        </div>

        <div class="waringSetting" v-if="tabIndex == 4">
          <div class="setting_tip">
            <img src="../../assets/index/ic_error.png" alt="">
            <span>当抓拍到黑、灰名单时会通知以下手机号</span>
          </div>
          <el-form :model="notifyList" ref="notifyList" label-width="120px" class="demo-dynamic">
            <el-form-item
              v-for="(domain, index) in notifyList.dataLists"
              :label="'通知手机号' + (index+1)"
              :key="domain.key"
            >
              <el-input v-model="domain.phone" maxlength="11" placeholder="请输入手机号"></el-input>
              <el-button @click.prevent="addDomain()" v-if="index == 0">
                <img src="../../assets/index/ic_add_circle.png" alt="">
              </el-button>
              <el-button @click.prevent="removeDomain(domain)">
                <img src="../../assets/index/ic_delete.png" alt="">
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit" class="submit">
                <img src="../../assets/index/btn_affirm.png" alt="">
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 添加人员弹框-->
        <div class="addToggle" v-if="addShow">
          <div class="shadow"></div>
          <div class="add_content">
            <div class="add_title">
              <span>添加{{ tabIndex == 1 ? '白名单' : tabIndex == 2 ? '灰名单' : '黑名单' }}</span>
              <i @click="cancel"><img src="../../assets/index/guanbi.png" alt=""></i>
            </div>
            <div class="add_list">
              <div class="list">
                <div class="name">人员姓名</div>
                <div class="add_input">
                  <input type="text" v-model="add_name" placeholder="请输入姓名">
                </div>
              </div>
              <div class="list" v-if="tabIndex == 1">
                <div class="name">白名单类型</div>
                <div class="add_input">
                  <input type="text" value="工作人员" readonly>
                </div>
              </div>
              <div class="list">
                <div class="name">添加照片</div>
                <div class="add_input">
                  <el-upload
                    class="avatar-uploader"
                    :action="uploadUrl"
                    :headers="getHeader"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess1"
                    :before-upload="beforeAvatarUpload1"
                    list-type="picture">
                    <img :src="imageUrl" alt="" v-if="imageUrl != ''">
                    <el-button v-else><img src="../../assets/index/tianjiazhaopian.png" alt=""></el-button>
                  </el-upload>
                </div>
              </div>
            </div>
            <div class="btns">
              <div class="cancel" @click="cancel">取消</div>
              <div class="sure" @click="sure">确认</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 大图预览效果-->
      <div class="img-show-mask" id="img-show-mask" v-show="maskBtn" @click="closeBigImg">
        <img :src="bigImgSrc" class="bigImg" id="bigImg" />
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
        name: '',
        add_name: '',
        imageUrl: '',
        addShow: false,
        bigImgSrc: "",
        maskBtn:false,         // 控制大图
        tabIndex: 1,           // 灰名单、黑名单
        handerImg: {
          img: [require('../../assets/index/topweixuan.png'),require('../../assets/index/topxuanzhong.png')],
        },
        notifyList: {
          dataLists: [{
            phone: ''
          }],
        },
      }
    },
    mounted () {
      this.getWhite(0);
    },
    methods: {

      ...mapActions([
        'goto',
        'getBlackList',
        'delBlackItem',
        'addBlack',
        'blackNotifierList',
        'notifySave'
      ]),

      // tab click
      tabIndexClick(index) {
        this.tabIndex = index;
        if (index < 4)  {
          this.currentPage = 1;
          this.getWhite(0);
        }else {
          this.getBlackNotifierList();
        }
      },

      watchTest() {
        console.log(111123456789);
      },

      // 删除
      removeDomain(item) {
        var index = this.notifyList.dataLists.indexOf(item);
        if (index !== -1) {
          if (item.id) {
              let data = {
                blackNotifierList: [
                  {
                    id: item.id,
                    deleted: true
                  }
                ]
              };
              this.commonFun(JSON.stringify(data), 1)
          }else {
            this.notifyList.dataLists.splice(index, 1);
            if (this.notifyList.dataLists.length == 0) {
                this.addDomain();
            }
          }
        }
      },

      // 添加通知
      addDomain() {
          if (this.notifyList.dataLists.length < 5) {
            this.notifyList.dataLists.push({
              phone: '',
              key: Date.now()
            });
          }else {
            this.$message({
              message: '最多只能添加五个手机号',
              type: 'info'
            });
          }
      },

      // 提交
      onSubmit() {
        let reg = 11 && /^((13|14|15|16|17|18)[0-9]{1}\d{8})$/;
        let blackNotifierList = [];
        this.notifyList.dataLists.forEach(item => {
            if (item.phone != '') {
              if(!reg.test(item.phone)) {
                this.$message.error('手机号格式不正确');
                return
              }else {
                  let obj = {
                      phone: item.phone
                  };
                  if (item.id) {
                      obj.id = item.id
                  }
                  blackNotifierList.push(obj);
              }
            }else {
              this.$message.error('请填写手机号');
            }
        });
        if (blackNotifierList.length == this.notifyList.dataLists.length) {
            let data = {
              blackNotifierList: blackNotifierList
            };
            this.commonFun(JSON.stringify(data), 2);
        }
      },

      // 告警提交common
      commonFun(data, type) {
          this.notifySave({
            data: JSON.parse(data),
            onsuccess: body => {
                if (body.data.errcode == 0) {
                    if (type == 1) {
                      this.$message({
                        message: '删除成功',
                        type: 'success'
                      });
                    }else {
                      this.$message({
                        message: '保存成功',
                        type: 'success'
                      });
                    }
                    this.getBlackNotifierList();
                }else {
                    if (type == 1) {
                      this.$message({
                        message: '删除失败',
                        type: 'warning'
                      });
                    }else {
                      this.$message({
                        message: '保存失败',
                        type: 'warning'
                      });
                    }
                }
            }
          })
      },

      // 获取通知列表
      getBlackNotifierList() {
        this.blackNotifierList({
          onsuccess: body => {
              if (body.data.errcode == 0) {
                this.notifyList.dataLists = body.data.data;
                if (this.notifyList.dataLists.length == 0) {
                  this.notifyList.dataLists.push({
                    phone: '',
                    key: Date.now()
                  });
                }
              }
          }
        })
      },

      getWhite (page) {
        page = page * 30;
        this.whiteList = [];
        this.getBlackList ({
          offset: page,
          limit: 30,
          data:{
            name: this.name,
            identityType: this.tabIndex == 1 ? 'GROUP_STAFF' : this.tabIndex == 2 ? 'GRAY' : 'BLACK'
          },
          onsuccess: body => {
            this.showTrue = true;
            this.total = parseInt(body.headers['x-total-count']);
            this.whiteList = [...body.data.data];
            this.$nextTick(() => {
                this.$refs.bgHeight.style.height = this.$refs.whiteHeight.offsetHeight + 'px';
            })
          }
        })
      },

      // 删除操作
      remove (item) {
        this.$confirm('请确认删除该人员', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.delBlackItem({
            id: item.id,
            onsuccess:body=>{
              this.$emit('getMessage', '');
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getWhite(0);
            }
          })
        }).catch(() => {

        });
      },

      // 搜索事件
      reach() {
        this.getWhite(0);
      },

      // 添加事件
      add () {
        this.addShow = true;
      },

      // 取消事件
      cancel () {
        this.addShow = false;
      },

      handleAvatarSuccess1(res, file) {
        console.log('上传成功',res)
        if(res.errcode == 0){
          this.imageUrl = res.data;
        }else {
          this.$message.error('系统异常');
        }
      },

      beforeAvatarUpload1(file) {
        let isImgType=false;
        isImgType = file.type == 'image/jpg'||file.type=='image/jpeg'
        let isLt2M =false;
        isLt2M = file.size / 1024 / 1024 < 2;

        console.log('isImgType:',file.type)
        console.log('isLt2M:',isLt2M)
        if (!isImgType) {
          this.$message.error('上传头像图片只能是 JPG/JPEG格式!');
        }

        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return  isLt2M&&isImgType;
      },

      // 确认
      sure () {
        if(this.add_name == '' || this.imageUrl == ''){
          return
        }else {
          this.addBlack({
            data:{
              imgUrl: this.imageUrl,
              name: this.add_name,
              identityType: this.tabIndex == 1 ? 'GROUP_STAFF' : this.tabIndex == 2 ? 'GRAY' : 'BLACK'
            },
            onsuccess: body =>{
                if (body.data.errcode == 0) {
                  if (body.data.data) {
                    this.$message({
                      type: 'success',
                      message: '添加成功'
                    });
                    this.$emit('getMessage', '');
                    this.addShow = false;
                    this.add_name = '';
                    this.imageUrl = '';
                    this.getWhite(0);
                  }else {
                    this.$message({
                      type: 'error',
                      message: '添加失败'
                    });
                  }
                }
            }
          })
        }
      },

      // 分页
      handleSizeChange (val) {

      },

      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.getWhite(val - 1);
      },

      // 打开大图效果
      bigImgShow: function(url) {
        this.bigImgSrc = url;
        this.maskBtn = true;
      },

      // 关闭大图效果
      closeBigImg: function() { //关闭图片预览
        this.maskBtn = false;
      },

    },
    computed: {
      uploadUrl(){
        return 'http://qa.fortrun.cn/' + 'gemini/identity/whiteList/pic'
//        return httpTool.httpUrlEnv() + 'gemini/identity/whiteList/pic'
      },
      getHeader(){
        return {
          Session: sessionStorage.session_id,
          token: sessionStorage.session_id
        }
      }
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
      min-height: calc(100vh - 88px);
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
      min-height: calc(100vh - 88px);
    }
    .white_title {
      padding: 5px 10px;
      text-align: left;
      height: 50px;
      font-size: 14px;
      color: #fff;
      .tabs {
        position: absolute;
        left: 10px;
        top: 15px;
        span {
          position: relative;
          margin-right: 8px;
          color: #3798FC;
          font-size: 14px;
          text-align: center;
          line-height: 30px;
          display: inline-block;
          width: 74px;
          cursor: pointer;
          img {
            position: absolute;
            left: 0;
            top: 0;
            height: 30px;
            display: inline-block;
            width: 74px;
            z-index: -1;
          }
        }
        span.active {
          color: #fff;
        }
      }
    }
    .search_add {
      margin: 20px 0 30px;
      display: flex;
      justify-content: flex-start;
      padding: 0 10px;
      .search {
        margin-left: 180px;
        height: 40px;
        line-height: 40px;
        display: flex;
        justify-content: space-between;
        input {
          font-size: 14px;
          color: #408FE9;
          padding-left: 15px;
          outline: none;
          background: #041740;
          border-radius: 4px;
          border: 1px solid #5691D1;
        }
        input:hover {
          background-color: transparent;
        }
        input:-moz-placeholder {
          color: #408FE9;
          font-size: 14px;
        }
        input:-ms-input-placeholder {
          color: #408FE9;
          font-size: 14px;
        }
        input::-moz-placeholder {
          color: #408FE9;
          font-size: 14px;
        }
        input::-webkit-input-placeholder {
          color: #408FE9;
          font-size: 14px;
        }
        span {
          width: 100px;
          height: 36px;
          cursor: pointer;
          margin-left: 15px;
          img {
            display: inline-block;
            width: 100%;
            height: 100%;
          }
        }
        i {
          padding: 10px;
          width: 16px;
          height: 16px;
          display: inline-flex;
          cursor: pointer;
          img {
            display: inline-flex;
            width: 100%;
            height: 100%;
          }
        }
      }
      .add {
        width: 100px;
        height: 36px;
        cursor: pointer;
        img {
          display: inline-block;
          width: 100%;
          height: 100%;
        }
      }
    }
    .whiteLists {
      padding: 0 10px;
    }
    .el-row {
      margin: 0 !important;
      .el-col {
        width: 320px;
        border: 1px solid #3798FC;
        position: relative;
        margin-right: 15px;
        margin-bottom: 15px;
        background-color: #103A72;
        display: flex;
        justify-content: flex-start;
        border-radius: 8px;
        padding: 8px;
        .img {
          display: inline-block;
          width: 100px;
          height: 100px;
          margin-right: 8px;
          border-radius: 8px;
          img {
            display: inline-block;
            width: 100%;
            height: 100%;
          }
        }
        .content {
          text-align: left;
          p {
            font-size: 20px;
            color: #fff;
          }
          .name {
            margin-top: 5px;
            font-size: 15px;
            color: #fff;
            span {
              color: #408FE9;
              font-size: 14px;
            }
          }
          .remove {
            position: absolute;
            right: 8px;
            bottom: 8px;
            width: 60px;
            height: 24px;
            cursor: pointer;
            img {
              display: inline-block;
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
    .addToggle {
      .shadow {
        opacity: 0.6;
        background: #000000;
        position: fixed;
        width: 100vw;
        height: 100vh;
        left: 0;
        top: 0;
        z-index: 5;
      }
      .add_content {
        background: #FFFFFF;
        border: 1px solid #EAEEF5;
        border-radius: 4px;
        position: fixed;
        padding: 8px 12px;
        z-index: 10;
        width: 424px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        .add_title {
          display: flex;
          justify-content: space-between;
          color: #606266;
          font-size: 18px;
          i {
            display: inline-flex;
            width: 10px;
            height: 10px;
            padding: 8px;
            cursor: pointer;
          }
        }
        .add_list {
          .list {
            margin-top: 15px;
            display: flex;
            justify-content: space-between;
            .name {
              font-size: 14px;
              color: #909399;
              margin-top: 13px;
              margin-right: 30px;
            }
            .add_input {
              input {
                width: 302px;
                height: 40px;
                line-height: 40px;
                background: #FFFFFF;
                border: 1px solid #D8DCE6;
                border-radius: 4px;
                padding-left: 15px;
                color: #909399;
              }
              input:-moz-placeholder {
                color: #C0C4CC;
                font-size: 14px;
              }
              input:-ms-input-placeholder {
                color: #C0C4CC;
                font-size: 14px;
              }
              input::-moz-placeholder {
                color: #C0C4CC;
                font-size: 14px;
              }
              input::-webkit-input-placeholder {
                color: #C0C4CC;
                font-size: 14px;
              }
              .el-button {
                padding: 0;
                border: none;
              }
              img {
                display: inline-flex;
                width: 100px;
                height: 100px;
              }
            }
          }
          .list:last-of-type {
            justify-content: flex-start;
            .name {
              margin-right: 49px;
            }
          }
        }
        .btns {
          display: flex;
          justify-content: flex-end;
          text-align: center;
          div {
            font-size: 12px;
            width: 56px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            border-radius: 4px;
            display: inline-flex;
            justify-content: center;
            margin-left: 10px;
            cursor: pointer;
          }
          .cancel {
            color: #606266;
            border: 1px solid #DBDFE6;
          }
          .sure {
            color: #fff;
            background: #409EFF;
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
    .waringSetting {
      margin: 20px 0 30px;
      padding: 0 40px;
      .setting_tip {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 30px;
        img {
          width: 25px;
          height: 25px;
          margin-right: 10px;
        }
        span {
          color: #b9bec9;
          font-size: 14px;
        }
      }
      /deep/ .el-form-item__label {
        text-align: left;
        font-size: 14px;
        color: #b9bec9;
      }
      /deep/ .el-form-item__content {
        width: 26%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
      /deep/ .el-input {
        margin-right: 15px;
        width: 50%;
        input {
          background-color: transparent;
          font-size: 14px;
          color: #b9bec9;
          outline: none;
          border-color: #4270b6;
        }
        input:-moz-placeholder {
          color: #697180;
        }
        input:-ms-input-placeholder {
          color: #697180;
        }
        input::-moz-placeholder {
          color: #697180;
        }
        input::-webkit-input-placeholder {
          color: #697180;
        }
      }
      /deep/ .el-button {
        background-color: transparent;
        border: none;
        padding: 8px 20px;
        img {
          width: 30px;
          height: 30px;
        }
      }
      .submit {
        width: 56%;
        margin-top: 40px;
        padding: 0;
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
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
