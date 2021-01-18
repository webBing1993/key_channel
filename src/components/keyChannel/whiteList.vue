<!-- 白名单-->
<template>
  <div>
    <div class="whiteList" v-show="showTrue">
      <div class="bg" ref="bgHeight"><img src="../../assets/index/baimingdan.png" alt=""></div>
      <div class="whiteContent">
        <div class="white_title">
          白名单
        </div>
        <div class="search_add">
          <div class="add" @click="add"><img src="../../assets/index/tianjia.png" alt=""></div>
          <div class="search">
            <input type="text" v-model="name" placeholder="请输入人员姓名">
            <span  @click="reach"><img src="../../assets/index/sousuo.png" alt=""></span>
            <!--<i @click="reach"><img src="../../assets/index/sousuo@2x.png" alt=""></i>-->
          </div>
        </div>
        <div v-if="whiteList.length != 0" class="whiteLists" ref="whiteLists">
          <el-row :gutter="15">
            <el-col :span="6"  v-for="item in whiteList" v-bind:key="item.id">
              <div class="grid-content">
                <div class="img">
                  <img :src="item.img_url" alt=""  @click="bigImgShow(item.img_url)">
                </div>
                <div class="content">
                  <p>工作人员</p>
                  <div class="name"><span>姓名：</span>{{item.name}}</div>
                  <div class="name"><span>类型：</span>白名单</div>
                  <div class="remove" @click="remove(item)"><img src="../../assets/index/shanchu.png" alt=""></div>
                </div>
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
        <div class="noMsg" v-else>
          <div class="img"><img src="../../assets/index/zanwuneirong.png" alt=""></div>
          <p>暂无内容</p>
        </div>

        <!-- 添加人员弹框-->
        <div class="addToggle" v-if="addShow">
          <div class="shadow"></div>
          <div class="add_content">
            <div class="content_left">
              <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="现场拍照" name="first">
                  <video
                    ref="video"
                    :width="videoWidth"
                    :height="videoHeight"
                    preload
                    style="object-fit: cover"
                    autoplay
                    playsinline
                    muted
                  >
                  </video>
                  <canvas ref="canvas" :width="videoWidth" :height="videoHeight" v-show="pause"></canvas>
                  <!-- 未检测到摄像设备-->
                  <div class="noVideo" v-if="noPause">
                    <div>
                      <img src="../../assets/index/Icon-paizhao.png" alt="">
                      <p>未检测到摄像设备请手动【添加照片】</p>
                    </div>
                  </div>
                  <div class="btns_">
                    <el-button v-if="!noPause && !imageUrl" @click="tabePhone">立即拍照</el-button>
                    <el-button v-else-if="activeName== 'first' && imageUrl" @click="reTabePhone">重新拍照</el-button>
                    <el-button v-if="noPause" @click="uploadBtn">添加照片</el-button>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="本地上传" name="second">
                  <el-upload
                    class="upload-demo"
                    :action="uploadUrl"
                    :headers="getHeader"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess1"
                    :before-upload="beforeAvatarUpload1"
                    list-type="picture"
                    ref="upload">
                    <img :src="imageUrl" alt="" v-if="imageUrl != ''">
                    <div class="noImg" v-else></div>
                    <div class="btns_">
                      <el-button >添加照片</el-button>
                    </div>
                  </el-upload>
                </el-tab-pane>
              </el-tabs>
            </div>
            <div class="content_right">
              <div class="closeTip">
                <i @click="cancel"><img src="../../assets/index/guanbi.png" alt=""></i>
              </div>
              <div class="lists">
                <div class="list">
                  <div class="list_title">人员姓名</div>
                  <div class="list_content">
                    <el-input v-model="add_name" placeholder="请输入人员姓名" clearable></el-input>
                  </div>
                </div>
                <div class="list">
                  <div class="list_title">名单类型</div>
                  <div class="list_content">
                    <el-radio-group v-model="identityTypes" size="mini">
                      <el-radio-button label="STAFF">白名单</el-radio-button>
                      <el-radio-button label="LODGER">住客</el-radio-button>
                    </el-radio-group>
                  </div>
                </div>
                <div class="list">
                  <div class="list_title">有效期</div>
                  <div class="list_content">
                    <el-date-picker
                      v-model="expireTime"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy - MM - dd"
                      value-format="timestamp">
                    </el-date-picker>
                    <el-checkbox v-model="expireChecked">长期有效</el-checkbox>
                  </div>
                </div>
              </div>
              <div class="btns">
                <el-button class="sure" @click="sure">保存</el-button>
                <el-button class="cancel" @click="cancel">取消</el-button>
              </div>
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
  import axios from 'axios'
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  export default {
    components: {ElButton}, name: 'keyChannel',
    data () {
      return {
        showTrue: false,
        whiteList: [],
        currentPage: 1,
        total: 0,
        name: '',
        add_name: '',
        identityTypes: '',
        expireTime: '',
        expireChecked: false,
        imageUrl: '',
        addShow: false,
        bigImgSrc: "",
        maskBtn:false,         // 控制大图
        activeName: 'second',
        pause: false,
        noPause: false,
        videoWidth: 317,
        videoHeight: 303,
      }
    },
    mounted () {
      this.getWhite(0);
    },
    methods: {

      ...mapActions([
        'goto',
        'getWhiteList',
        'newDelWhiteItem',
        'newUploadBmd'
      ]),

      handleClick(tab, event) {
        this.imageUrl = '';
        if (this.activeName == 'first') {
            this.initVideo();
        }
      },

      initVideo() {
        let that = this;
        that.video = document.getElementById("webcam");
        setTimeout(() => {
          navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;

          if (navigator.getUserMedia) {
            navigator.getUserMedia({
//                audio: true,
                video: {
                  width: 1280,
                  height: 800
                }
              },
              function(stream) {
                let video = that.$refs.video;
                video.srcObject = stream;
                video.onloadedmetadata = function(e) {
                  video.play();
                };
              },
              function(err) {
                this.noParse = true;
              }
            )}

        }, 300);
      },

      // 立即拍照
      tabePhone() {
        let that = this;
        let video = that.$refs.video;
        let canvas = that.$refs.canvas;
        let context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, that.videoWidth, that.videoHeight);
        let imgUrl = canvas.toBlob((blob) => {
          let filename = `${new Date().getTime()}.jpg`;
          //转换canvas图片数据格式为formData
          let file2 = new File([blob], filename, {type: 'image/jpg'});
          let formData = new FormData();
          formData.append('file', file2);
          console.log('that.getHeader', that.getHeader);
          axios.post(that.uploadUrl, formData, { headers: that.getHeader}).then(res=> {
            console.log(111, res);
            if (res.data.errcode == 0) {
              video.pause();
              that.imageUrl = res.data.data;
            }
          })
        })
      },

      // 重新拍照
      reTabePhone() {
        this.imageUrl = '';
        this.initVideo();
      },

      // 添加图片
      uploadBtn() {
        this.imageUrl = '';
        this.activeName = 'second';
        this.$refs.upload.$el.children[0].children[2].click();
      },

      watchTest() {
        console.log(111123456789);
      },

      getWhite (page) {
        page = page * 30;
        this.whiteList = [];
        this.getWhiteList ({
          offset: page,
          limit: 30,
          data:{
            likeName: this.name,
            createTimeStart:'',
            createTimeEnd:'',
            removed:false,
            identityTypes:["STAFF","LODGER"]
          },
          onsuccess: body => {
            this.showTrue = true;
            this.total = parseInt(body.headers['x-total-count']);
            this.whiteList = [...body.data.data];
            this.$nextTick(() => {
              this.$refs.whiteLists.style.height = (this.$refs.bgHeight.offsetHeight - 210) + 'px';
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
          this.newDelWhiteItem({
            data:{
              ids: [item.id]
            },
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
        this.imageUrl = '';
        this.add_name= '';
        this.identityTypes = '';
        this.expireTime = '';
        this.expireChecked = false;
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
        if (!this.imageUrl) {
          this.$message({
            type: 'warning',
            message: '请添加人员图'
          });
          return;
        }
        if(this.add_name == ''){
          this.$message({
            type: 'warning',
            message: '请填写人员姓名'
          });
          return
        }
        if(this.identityTypes == ''){
          this.$message({
            type: 'warning',
            message: '请选择名单类型'
          });
          return
        }
        if(!this.expireChecked && !this.expireTime){
          this.$message({
            type: 'warning',
            message: '请选择有效期'
          });
          return
        }
        let data = {
          image_url: this.imageUrl,
          name: this.add_name,
          identityType: this.identityTypes
        };
        if (!this.expireChecked) {
          data.expireTime = this.expireTime
        }
        console.log('data', data);
        this.newUploadBmd({
          data: data,
          onsuccess:()=>{
            this.$emit('getMessage', '');
            this.cancel();
            this.getWhite(0);
          }
        })
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
//        return 'http://qa.fortrun.cn/' + 'gemini/identity/whiteList/pic'
        return httpTool.httpUrlEnv() +  'gemini/identity/whiteList/pic'
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
      height: calc(100vh - 80px);
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
      height: calc(100vh - 60px);
    }
    .white_title {
      padding: 5px 10px;
      text-align: left;
      font-size: 14px;
      color: #fff;
    }
    .search_add {
      margin: 30px 0;
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
      overflow-y: scroll;
    }
    .whiteLists::-webkit-scrollbar {
      display: none;
    }
    .el-row {
      margin: 0 !important;
      .el-col {
        /*width: 320px;*/
        position: relative;
        margin-bottom: 15px;
        .grid-content {
          border: 1px solid #3798FC;
          border-radius: 8px;
          padding: 8px;
          background-color: #103A72;
          display: flex;
          justify-content: flex-start;
        }
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
            right: 16px;
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
        border-radius: 2px;
        position: fixed;
        padding: 8px 12px 52px;
        z-index: 10;
        width: 768px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        .content_left {
          width: 50%;
          position: relative;
          padding-right: 39px;
          /deep/ .el-tabs__nav-wrap {
            padding-left: 26px;
          }
          /deep/ .el-upload {
            img {
              display: block;
              width: 317px;
              height: 303px;
              border-radius: 8px;
            }
          }
          .noImg {
            width: 317px;
            height: 303px;
            background: #F5F5F5;
            border-radius: 8px;
          }
          .noVideo {
            background: #F5F5F5;
            border-radius: 8px;
            display: flex;
            width: 317px;
            height: 303px;
            align-items: center;
            justify-content: center;
            div {
              width: 130px;
              img {
                margin-bottom: 22px;
              }
              p {
                font-size: 14px;
                color: #6D6D6D;
              }
            }
          }
        }
        .content_left:after {
          position: absolute;
          width: 1px;
          background: rgba(151,151,151,0.14);
          height: 305px;
          right: 0;
          top: 36px;
        }
        .content_right {
          width: 50%;
          padding-left: 54px;
          .closeTip {
            text-align: right;
            i {
              padding: 9px 5px;
              width: 8px;
              height: 8px;
              cursor: pointer;
              display: inline-block;
            }
            img {
              width: 100%;
              height: 100%;
              display: block;
            }
          }
          .lists {
            .list {
              margin-bottom: 23px;
              .list_title {
                font-size: 14px;
                color: #303133;
                margin-bottom: 12px;
                text-align: left;
              }
              .list_content {
                text-align: left;
                /deep/ .el-input--suffix .el-input__inner {
                  width: 194px;
                }
                /deep/ .el-icon-circle-close {
                  display: none;
                }
                /deep/ .el-radio-button {
                  margin-right: 20px;
                }
                /deep/ .el-radio-button--mini .el-radio-button__inner {
                  border: 1px solid #DCDFE6;
                  border-radius: 4px;
                  padding: 13px 25px;
                }
              }
            }
          }
        }
        .btns {
          display: flex;
          justify-content: flex-start;
          text-align: center;
          margin-top: 90px;
          .el-button {
            width: 98px;
            line-height: 36px;
            text-align: center;
            border-radius: 4px;
            display: inline-flex;
            justify-content: center;
            margin-right: 10px;
            cursor: pointer;
            font-size: 14px;
            padding: 0;
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
        .btns_ {
          margin-top: 18px;
          .el-button {
            border: 1px solid #3798FC;
            border-radius: 4px;
            font-size: 14px;
            color: #3798FC;
            width: 98px;
            line-height: 36px;
            padding: 0;
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
