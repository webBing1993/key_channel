<!-- 白名单-->
<template>
  <div>
    <div class="whiteList" v-show="showTrue">
      <div v-if="whiteList.length != 0">
        <div class="search_add">
          <div class="search">
            <input type="text" v-model="name" placeholder="请输入人员姓名">
            <i @click="reach"><img src="../../assets/index/sousuo@2x.png" alt=""></i>
          </div>
          <div class="add" @click="add">+添加</div>
        </div>
        <el-row :gutter="20">
          <el-col :span="6"  v-for="item in whiteList">
            <div class="grid-content">
              <div class="img">
                <img :src="item.img_url" alt="">
              </div>
            </div>
            <div class="content">
              <div class="name">{{item.name}}</div>
              <div class="remove" @click="remove(item)">删除</div>
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

        <!-- 添加人员弹框-->
        <div class="addToggle" v-if="addShow">
          <div class="shadow"></div>
          <div class="add_content">
            <div class="add_title">
              <span>添加人员</span>
              <i @click="cancel"><img src="../../assets/index/guanbi.png" alt=""></i>
            </div>
            <div class="add_list">
              <div class="list">
                <div class="name">人员姓名</div>
                <div class="add_input">
                  <input type="text" v-model="add_name" placeholder="请输入姓名">
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
      <div class="noMsg" v-else>
        <div class="img"><img src="../../assets/index/zanwuneirong.png" alt=""></div>
        <p>暂无内容</p>
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
        showTrue: false,
        whiteList: [],
        currentPage: 1,
        total: 0,
        name: '',
        add_name: '',
        imageUrl: '',
        addShow: false,
      }
    },
    mounted () {
      this.getWhite(0);
    },
    methods: {

      ...mapActions([
        'goto',
        'getWhiteList',
        'delWhiteItem',
        'uploadBmd'
      ]),
      getWhite (page) {
        this.whiteList = [];
        this.getWhiteList ({
          offset: page,
          limit: 30,
          data:{
            likeName: this.name,
            createTimeStart:'',
            createTimeEnd:'',
            removed:false
          },
          onsuccess: body => {
            this.showTrue = true;
            this.total = parseInt(body.headers['x-total-count']);
            this.whiteList = [...body.data.data];
          }
        })
      },

      // 删除操作
      remove (item) {
        this.$confirm('请确认删除该人员', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.delWhiteItem({
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
          this.uploadBmd({
            data:{
              image_url: this.imageUrl,
              name: this.add_name
            },
            onsuccess:()=>{
              this.$emit('getMessage', '');
              this.addShow = false;
              this.getWhite(0);
              this.add_name == '';
              this.imageUrl == ''
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
      }

    },
    computed: {
      uploadUrl(){
        let httpUrl = this.httpUrlEnv;
        if (httpUrl.indexOf('key_channel')) {
          httpUrl = httpUrl.split('key_channel')[0];
        }
        return httpUrl + 'gemini/identity/whiteList/pic'
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
    .search_add {
      margin: 30px 0;
      display: flex;
      justify-content: space-between;
      .search {
        background: #FFFFFF;
        border: 1px solid #D8DCE6;
        border-radius: 4px;
        height: 40px;
        line-height: 40px;
        display: flex;
        justify-content: space-between;
        input {
          font-size: 14px;
          color: #000;
          border: none;
          padding-left: 15px;
          outline: none;
        }
        input:hover {
          border: none;
          background-color: transparent;
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
        width: 108px;
        height: 36px;
        line-height: 36px;
        background: #389FFF;
        border-radius: 4px;
        font-size: 14px;
        color: #fff;
        cursor: pointer;
      }
    }
    .el-row {
      margin: 0 !important;
      .el-col {
        width: 158px;
        border: 1px solid #409EFF;
        position: relative;
        padding: 0 !important;
        margin-right: 30px;
        margin-bottom: 30px;
        display: flex;
        justify-content: flex-start;
        height: 82px;
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
          text-align: left;
          .name {
            margin-top: 5px;
            font-size: 12px;
            color: #000;
          }
          .remove {
            position: absolute;
            left: 88px;
            bottom: 8px;
            padding: 8px 15px;
            border: 1px solid #DBDFE6;
            border-radius: 3px;
            color: #606266 ;
            font-size: 12px;
            cursor: pointer;
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
            justify-content: flex-start;
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
      margin: 150px auto;
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

</style>
