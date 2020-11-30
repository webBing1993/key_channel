<template>
  <div>
    <div class="key_channel">
      <el-container>
        <el-header>
          <el-row class="headerTab">
            <el-col :span="12" class="headerTabL">
              <img src="../../assets/index/logo.png" alt="">
              <div class="tabs" v-if="!newSys && roleShow">
                <span class="active"><img :src="handerImg.img[1]" alt="">首页</span>
              </div>
              <div class="tabs" v-else-if="!newSys && !roleShow">
                <span :class="handleIndex == 1 ? 'active' : ''" @click="handleClick(1)"><img :src="handleIndex == 1 ? handerImg.img[1] : handerImg.img[0]" alt="">首页</span>
                <span :class="handleIndex == 2 ? 'active' : ''" @click="handleClick(2)"><img :src="handleIndex == 2 ? handerImg.img[1] : handerImg.img[0]" alt="">设置</span>
                <span :class="handleIndex == 3 ? 'active' : ''" @click="handleClick(3)" v-if="massage"><img :src="handleIndex == 3 ? handerImg.img[1] : handerImg.img[0]" alt="" >设备监控</span>
              </div>
              <div class="tabs" v-if="newSys && roleShow">
                <span :class="handleIndex == 1 ? 'active' : ''" @click="handleClick(4)"><img :src="handleIndex == 1 ? handerImg.img[1] : handerImg.img[0]" alt="">首页</span>
                <span :class="handleIndex == 2 ? 'active' : ''" @click="handleClick(5)"><img :src="handleIndex == 2 ? handerImg.img[1] : handerImg.img[0]" alt="">设置</span>
              </div>
              <div class="tabs" v-else-if="newSys && !roleShow">
                <span :class="handleIndex == 1 ? 'active' : ''" @click="handleClick(6)"><img :src="handleIndex == 1 ? handerImg.img[1] : handerImg.img[0]" alt="">首页</span>
                <span :class="handleIndex == 2 ? 'active' : ''" @click="handleClick(7)"><img :src="handleIndex == 2 ? handerImg.img[1] : handerImg.img[0]" alt="">设置</span>
                <span :class="handleIndex == 3 ? 'active' : ''" @click="handleClick(8)" v-if="massage"><img :src="handleIndex == 3 ? handerImg.img[1] : handerImg.img[0]" alt="" >设备监控</span>
              </div>
            </el-col>
            <el-col :span="12">
              <el-row class="ownInfo">
                <el-col :span="13">
                  <div class="passContact" v-if="!roleShow">
                    <el-button @click="changePhone">
                      <span>添加设备异常通知手机号 <span>{{ phone }}</span></span>
                      <span v-if="phone !== ''">修改</span>
                    </el-button>
                  </div>
                </el-col>
                <el-col :span="11">
                  <div class="name_logout">
                    <img src="../../assets/index/diwen.png" alt="">
                    <span class="name"><img src="../../assets/index/geren.png" alt=""><span>欢迎您，{{myName}}</span></span>
                    <!--<span class="logout" @click="logout">退出</span>-->
                    <el-dropdown class="logout">
                      <span class="el-dropdown-link">
                        <img src="../../assets/index/dropdown.png" alt="">
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-s-unfold" v-if="!newSys"  @click.native="changeRoute">切换系统</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-switch-button" @click.native="logout">退出登录</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-header>
        <el-container>
          <router-view  :handleIndex="handleIndex_" v-if="showTemplate" ref="square"></router-view>
        </el-container>
      </el-container>
    </div>
    <div class="statusTip" v-if="statusTip">
      <div class="shadow" @click="statusTipCancle"></div>
      <div class="tip_container">
        <div class="tip_title">
          <span>接收设备异常通知手机号</span>
          <i class="el-icon-close" @click="statusTipCancle"></i>
        </div>
        <el-form :model="changeItem" :rules="rules" label-position="left" ref="changeItem" label-width="140px" class="demo-ruleForm">
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="changeItem.phone" placeholder="请输入手机号码" type="tel" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-input placeholder="请输入验证码" maxlength="6" v-model="changeItem.code" class="input-with-select">
              <el-button slot="append" @click="sendcode" :disabled="changeItem.disabled">{{ changeItem.text }}</el-button>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('changeItem')">
              保存
            </el-button>
          </el-form-item>
        </el-form>
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
        showTemplate: true,
        newSys: sessionStorage.newSys == 'true' ? true : false,  // 判断是否是幼儿园相关
        roleShow: sessionStorage.roleId != '' ? true : false,  // 判断权限
        myName: '',
        handleIndex: 1,
        handleIndex_: 1,
        handerImg: {
          img: [require('../../assets/index/topweixuan.png'),require('../../assets/index/topxuanzhong.png')],
        },
        massage: sessionStorage.manage == 'true' ? true :false,
        phone: '',
        statusTip: false,    // tip显示
        changeItem: {
          phone: '',
          code: '',
          text: '获取验证码',
          time: 180,
          disabled: false
        },
        timerNull: null,
        rules: {
          phone: [
            { required: true, message: '请填写手机号码', trigger: 'blur' },
            { pattern: /^1\d{10}$/, message: '请填写11位手机号码' },
            { pattern: /^((13|14|15|16|17|18)[0-9]{1}\d{8})$/, message: '请填写正确的手机号码' }
          ],
          code: [
            { required: true, message: '请填写短信验证码', trigger: 'blur' },
          ],
        },
      }
    },
    mounted () {
      this.myName = sessionStorage.getItem('myName');
      this.handleIndex = sessionStorage.getItem('handleIndex') ? sessionStorage.getItem('handleIndex') : 1;
      this.getHotelNotifier();
    },
    methods: {

      ...mapActions([
        'replaceto', 'notifier', 'geNotifiertCode', 'updateNotifier'
      ]),

      // 切换系统
      changeRoute() {
//        window.open('http://hha.fortrun.cn:8006/smartdab/#/login', '_self');
        window.open('http://hotel.q.fortrun.cn/#', '_self');
      },

      // 退出事件
      logout () {
        sessionStorage.removeItem('tab');
        sessionStorage.removeItem('handleIndex');
        this.$refs.square.watchTest();
//        this.replaceto('/');
        window.location.href = localStorage.getItem('windowUrl_');
      },

      // tab点击事件
      handleClick(tab) {
//        this.showTemplate = false;
        this.$refs.square.watchTest();
        let t = tab;
        if (tab == 1) {
          this.replaceto('keyChannel')
//          this.replaceto('homeMasterIndex')
//          this.replaceto('home')
          t = 1;
        }else if(tab == 2) {
          this.replaceto('whiteList');
          t = 2;
        }else if(tab == 7) {
          this.replaceto('whiteListMaster');
          t = 2;
        }else if (tab == 3 || tab == 8) {
          this.replaceto('hotelStatus');
          t = 3;
        }else if (tab == 4) {
          this.replaceto('homeMaster');
          t = 1;
        }else if (tab == 5) {
          this.replaceto('blackList');
          t = 2;
        }else if (tab == 6) {
          this.replaceto('homeMasterIndex');
          t = 1;
        }
        sessionStorage.setItem('handleIndex', t);
        this.handleIndex = t;
        console.log('tab', tab, new Date().getTime());
//        this.$set('handleIndex_', tab);
//        this.handleIndex_+=1;
        this.handleIndex_ = t + '&' + new Date().getTime();
      },

      // 获取酒店通知者
      getHotelNotifier() {
          this.notifier({
            onsuccess: body => {
                if (body.data.code == 0) {
                    this.phone = body.data.data.phone;
                }
            },
            onfail: body => {

            },
            onerror: body => {

            }
          })
      },

      // 修改手机号
      changePhone() {
//        if (this.phone !== '') {
//            this.changeItem.phone = this.phone;
//        }
        this.changeItem.phone = '';
        this.changeItem.code = '';
        this.changeItem.disabled = false;
        this.changeItem.time = 180;
        this.changeItem.text = '获取验证码';
        clearTimeout(this.timerNull);
        this.statusTip = true;
      },

      // 隐藏弹框tip
      statusTipCancle() {
        this.statusTip = false;
      },

      // 保存
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {
              phone: this.changeItem.phone,
            };
            this.updateNotifier({
              data: data,
              code: this.changeItem.code,
              onsuccess: body => {
                  if (body.data.code == 0) {
                    this.$message({
                      type: 'success',
                      message: '账号绑定成功'
                    });
                    this.phone = this.changeItem.phone;
                    this.statusTip = false;
                  }
              }
            })
          } else {
            return
          }
        })
      },

      // 获取验证码
      sendcode() {
        let reg = 11 && /^((13|14|15|16|17|18)[0-9]{1}\d{8})$/;
        if(this.changeItem.phone === ''){
          this.$message('请输入手机号码');
          return;
        }else if(!reg.test(this.changeItem.phone)){
          this.$message.error('手机格式不正确');
          return;
        }else {
          this.changeItem.time = 180;
          this.changeItem.disabled = true;
          this.geNotifiertCode({
            data: {
              phone: this.changeItem.phone,
            },
            onsuccess: body => {
                console.log(5555545444);
              if (body.data.code == 0 || body.data.code == 30007) {
                this.timer();
                if (body.data.code != 0) {
                  this.$message.error(body.data.msg);
                }
              }
            }
          })
        }
      },

      timer() {
        if (this.changeItem.time > 0) {
          this.changeItem.time--;
          this.changeItem.text = this.changeItem.time+"s后重新获取";
          this.timerNull = setTimeout(this.timer, 1000);
        } else{
          this.changeItem.time = 0;
          this.changeItem.text = "重新获取";
          this.changeItem.disabled = false;
        }
      },

    },
    watch: {
      'myName': function (val) {
        if (val === '') {
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
      display: flex;
      align-items: center;
      padding: 10px 0;
      background-color: #041740;
      .headerTab {
        width: 100vw;
        height: 100%;
        display: flex;
        align-items: center;
        .headerTabL {
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
        .ownInfo {
          display: flex;
          align-items: center;
        }
        .passContact {
          /deep/ .el-button {
            border: 1px solid #4F83D0;
            border-radius: 4px;
            background-color: transparent;
            color: #3798FC;
            font-size: 12px;
            span {
              span {
                span {
                  color: #A6ADB4;
                  margin: 0 20px 0 10px;
                }
              }
            }
          }
        }
        .name_logout {
          text-align: right;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          height: 48px;
          position: relative;
          .name {
            width: 50%;
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
            span {
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
              display: inline-flex;
            }
          }
          .logout {
            position: absolute;
            right: 30px;
            font-size: 14px;
            color: #fff;
            padding: 0 30px;
            cursor: pointer;
            .el-dropdown-link {
              img {
                width: 24px;
              }
            }
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

  .statusTip {
    .shadow {
      opacity: 0.5;
      background: #000000;
      position: fixed;
      width: 100vw;
      height: 100vh;
      z-index: 1002;
      left: 0;
      top: 0;
    }
    .tip_container {
      min-width: 35vw;
      padding: 30px 20px;
      position: fixed;
      z-index: 1005;
      background: #FFFFFF;
      border-radius: 2px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .tip_title {
        margin-bottom: 22px;
        color: #303133;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      /deep/ .el-form-item {
        .el-form-item__content {
          text-align: left;
        }
      }
      .tip_btns {
        margin-top: 30px;
        text-align: center;
      }
      /deep/ .el-date-editor .el-range__close-icon {
        display: none;
      }
      /deep/ .el-date-editor .el-range-separator {
        width: 10%;
      }
      /deep/ .el-range-editor.el-input__inner {
        width: 60%;
      }
    }
  }

  /deep/ .el-dropdown-menu__item {
    display: block;
    font-size: 18px;
  }

</style>
