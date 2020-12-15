<template>
  <div style="width: 100%">
    <div class="homeIndex" v-show="homeIndexShow">
      <div class="home_container">
        <!-- 酒店列表栏-->
        <div class="hotelLists" ref="hotelAside">
          <el-aside v-show="colseOpenLeft">
            <div class="bg"><img src="../../assets/index/zuo.png" alt="" ></div>
            <div class="hotel_content">
              <div class="title" ref="hotelTitleHeigth">场所列表</div>
              <div class="search" ref="hotelSearchHeigth">
                <input type="text" placeholder="请输入场所名称" v-model="hotelName">
                <div class="searchBtn" @click="searchHotel">
                  <img src="../../assets/index/sousuo.png" alt="">
                </div>
              </div>
              <div class="hotel_tabs" ref="hotelTabsHeigth">
                <span @click="hotelTabs(-1, '全部')">全部({{hotelAreaLen}})<img :src="hotelTab == -1 ? handerImg.img[1] : handerImg.img[0]" alt=""></span>
                <span v-for="(item, index) in hotelArea" @click="hotelTabs(index, item.name)">{{item.name}}({{item.count}})<img :src="hotelTab == index ? handerImg.img[1] : handerImg.img[0]" alt=""></span>
              </div>
              <div class="hotel_lists" ref="hotelListsHeigth">
                <div class="content" v-if="hotelLists.length != 0">
                  <div class="list" v-for="(item, index) in hotelLists" :class="hotelCurrent == index ? 'active' : ''" @click="hotelItem(item, index)">
                    <span class="hotel_name">{{item.name}}</span>
                    <span class="hotel_btn"><img src="../../assets/index/chakan.png" alt=""></span>
                  </div>
                </div>
                <div class="noMsg" v-else>
                  <div class="img"><img src="../../assets/index/zanwuneirong.png" alt=""></div>
                  <p>暂无内容</p>
                </div>
              </div>
            </div>
          </el-aside>
          <!-- 控制左边收张-->
          <div class="leftColseOpen" @click="closeOpenClickLeft">
            <img :src="colseOpenLeft ? closeOpen[1] : closeOpen[0]" alt="">
          </div>
        </div>
        <div class="home_content" :style="contentWidthIndex == 0 ? contentWidth[0] : contentWidthIndex == 1 ? contentWidth[1] : contentWidth[2]">
          <!-- 陌生人待处理-->
          <el-container  ref="elAside">
            <el-aside>
              <div class="bg"><img src="../../assets/index/zuo.png" alt="" ></div>
              <div class="stranger_title">
                <div class="stranger_tab">
                  <div class="tabTitle">类型筛选</div>
                  <el-select v-model="strangerValue" @change="strangerSelect" placeholder="请选择">
                    <el-option
                      v-for="item in strangerTabs"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </div>
                <!--<div :class="strangerTab == 1 ? 'active stranger_tab' : 'stranger_tab'" @click="strangerTabClick(1)">-->
                  <!--<img src="../../assets/index/zuoxuanzhong.png" alt="" v-if="strangerTab == 1">-->
                  <!--<img src="../../assets/index/zuoweixuan.png" alt="" v-else>-->
                  <!--陌生人(未处理)-->
                <!--</div>-->
                <!--<div :class="strangerTab == 2 ? 'active stranger_tab' : 'stranger_tab'" @click="strangerTabClick(2)">-->
                  <!--<img src="../../assets/index/zuoxuanzhong.png" alt="" v-if="strangerTab == 2">-->
                  <!--<img src="../../assets/index/zuoweixuan.png" alt="" v-else>-->
                  <!--模糊抓拍-->
                <!--</div>-->
              </div>
              <div class="stranger_list" v-if="strangerTab == 1">
                <div :class="item.guestType == 'BLACK' ? 'list listRed' : item.guestType == 'GRAY' ? 'listYellow list' : 'list'" v-for="(item,index) in strangerList" :key="index">
                  <div class="img">
                    <img :src="item.facial_pic" alt="" @click="bigImgShow(item.facial_pic)">
                  </div>
                  <div class="list_content">
                    <p><span>时间：</span><span>{{dateDiff(item.filming_time)}} ({{datetimeparse(item.filming_time,'hh:mm:ss')}})</span></p>
                    <p><span>地点：</span><span>{{item.hotelName}}{{item.location ? item.location : '-'}}</span></p>
                    <p><span>来源：</span><span>{{ item.guestType == 'STAFF' ? '工作人员库' : item.guestType == 'GROUP_STAFF' ? '集团工作人员库' : item.guestType == 'GRAY' ? '灰名单人员库' : item.guestType == 'BLACK' ? '黑名单人员库' : '-' }}</span></p>
                    <!--<div class="handle" @click="handelBtn(item.illegal_guest_id,1)"><img src="../../assets/index/chuli.png" alt=""></div>-->
                    <el-button type="primary" class="handle" :loading="item.handleLoading"  @click="handelBtn(item,1)" :style="handleBg"></el-button>
                  </div>
                </div>
                <div class="noMsg" v-if="strangerList.length == 0">
                  <div class="img"><img src="../../assets/index/zanwuneirong.png" alt=""></div>
                  <p>暂无内容</p>
                </div>
              </div>
              <div class="stranger_list" v-if="strangerTab == 2">
                <div class="list" v-for="(item,index) in indistinctList" :key="index">
                  <div class="img">
                    <img :src="item.facial_pic" alt="" @click="bigImgShow(item.facial_pic)">
                  </div>
                  <div class="list_content">
                    <p><span>时间：</span><span>{{datetimeparse(item.filming_time,'MM-DD hh:mm:ss')}}</span></p>
                    <p><span>地点：</span><span>{{item.hotelName}}{{item.location ? item.location : '-'}}</span></p>
                    <p><span>来源：</span><span>{{ item.guestType == 'STAFF' ? '工作人员库' : item.guestType == 'GROUP_STAFF' ? '集团工作人员库' : item.guestType == 'GRAY' ? '灰名单人员库' : item.guestType == 'BLACK' ? '黑名单人员库' : '-' }}</span></p>
                    <el-button type="primary" class="handle" :loading="item.handleLoading"  @click="handelBtn(item,2)"  :style="handleBg"></el-button>
                  </div>
                </div>
                <div class="noMsg" v-if="indistinctList.length == 0">
                  <div class="img"><img src="../../assets/index/zanwuneirong.png" alt=""></div>
                  <p>暂无内容</p>
                </div>
              </div>
            </el-aside>
            <!-- 中间主页-->
            <el-main ref="mainHeight">
              <el-container>
                <el-header>
                  <el-row>
                    <el-col :span="8">
                      <div class="bg"><img src="../../assets/index/zhongshnag.png" alt=""></div>
                      <div class="timerChange">
                        <div class="time_title">日期筛选</div>
                        <div class="timer_change" v-show="activeNames == 1">
                          <el-date-picker
                            v-model="dayTime"
                            type="datetimerange"
                            format="yyyy-MM-dd HH:mm"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="handleTimeChange">
                          </el-date-picker>
                        </div>
                        <div class="timer_change" v-show="activeNames == 2">
                          <el-date-picker
                            v-model="weekTime"
                            type="week"
                            format="yyyy 第 WW 周"
                            placeholder="选择周"
                            @change="handleTimeChange">
                          </el-date-picker>
                        </div>
                        <div class="timer_change" v-show="activeNames == 3">
                          <el-date-picker
                            v-model="monthTime"
                            type="month"
                            format="yyyy-MM月"
                            placeholder="选择日期"
                            @change="handleTimeChange">
                          </el-date-picker>
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="16">
                      <div class="bg"><img src="../../assets/index/zhongshnag.png" alt=""></div>
                      <div class="tabs">
                        <div :class="activeNames == 1 ? 'tabs_item is_active' : 'tabs_item'">
                          <div class="item_tab_one" @click="handleChange(1)">
                            今日处理 <span>{{total1}}</span>
                          </div>
                          <div class="item_tab_two" v-if="activeNames == 1">
                            <div :class="tab2 ? 'item_tab active' : 'item_tab'" @click="handleTabChange(1)">陌生人 <span>{{total2}}</span></div>
                            <div :class="tab3 ? 'item_tab active' : 'item_tab'" @click="handleTabChange(2)">工作人员 <span>{{total3}}</span></div>
                            <div :class="tab4 ? 'item_tab active' : 'item_tab'" @click="handleTabChange(3)">黑名单 <span>{{total4}}</span></div>
                            <div :class="tab5 ? 'item_tab active' : 'item_tab'" @click="handleTabChange(4)">灰名单 <span>{{total5}}</span></div>
                          </div>
                        </div>
                        <div :class="activeNames == 2 ? 'tabs_item is_active' : 'tabs_item'">
                          <div class="item_tab_one" @click="handleChange(2)">
                            本周抓拍 <span>{{weekNum}}</span>
                          </div>
                          <div class="item_tab_two" v-if="activeNames == 2">
                            <div :class="tab2 ? 'item_tab active' : 'item_tab'" @click="handleTabChange(1)">陌生人 <span>{{total2}}</span></div>
                            <div :class="tab3 ? 'item_tab active' : 'item_tab'" @click="handleTabChange(2)">工作人员 <span>{{total3}}</span></div>
                            <div :class="tab4 ? 'item_tab active' : 'item_tab'" @click="handleTabChange(3)">黑名单 <span>{{total4}}</span></div>
                            <div :class="tab5 ? 'item_tab active' : 'item_tab'" @click="handleTabChange(4)">灰名单 <span>{{total5}}</span></div>
                          </div>
                        </div>
                        <div :class="activeNames == 3 ? 'tabs_item is_active' : 'tabs_item'">
                          <div class="item_tab_one" @click="handleChange(3)">
                            本月抓拍 <span>{{monthNum}}</span>
                          </div>
                          <div class="item_tab_two" v-if="activeNames == 3">
                            <div :class="tab2 ? 'item_tab active' : 'item_tab'" @click="handleTabChange(1)">陌生人 <span>{{total2}}</span></div>
                            <div :class="tab3 ? 'item_tab active' : 'item_tab'" @click="handleTabChange(2)">工作人员 <span>{{total3}}</span></div>
                            <div :class="tab4 ? 'item_tab active' : 'item_tab'" @click="handleTabChange(3)">黑名单 <span>{{total4}}</span></div>
                            <div :class="tab5 ? 'item_tab active' : 'item_tab'" @click="handleTabChange(4)">灰名单 <span>{{total5}}</span></div>
                          </div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </el-header>
                <el-main>
                  <div class="bg"><img src="../../assets/index/zhong.png" alt=""></div>
                  <!-- 今日抓拍列表-->
                  <div class="toDay_lists lists" v-if="tab1">
                    <el-row :gutter="8">
                      <el-col :xs="4" :sm="4" :md="3" :lg="2" :xl="2"  class="list" v-for="(item,index) in toDayLists" v-bind:key="index">
                        <div :class="item.guestType == 'BLACK' ? 'grid-content bg-purple listRed' : item.guestType == 'GRAY' ? 'listYellow grid-content bg-purple' : 'grid-content bg-purple'">
                          <div class="img">
                            <img :src="item.facial_pic" alt=""  @click.stop="bigImgShow(item.facial_pic)">
                          </div>
                          <el-popover
                            placement="right"
                            title="人员详情"
                            width="200"
                            trigger="hover">
                            <div class="popoverBox">
                              <div class="popover_list">
                                <span>抓拍时间：</span>
                                <span>{{ datetimeparse(item.filming_time,'hh:mm:ss') }}</span>
                              </div>
                              <div class="popover_list">
                                <span>人员类型：</span>
                                <span>{{ item.guestType == 'STAFF' ? '工作人员' : item.guestType == 'GROUP_STAFF' ? '集团工作人员' : item.guestType == 'GRAY' ? '灰名单' : item.guestType == 'BLACK' ? '黑名单' : '陌生人' }}</span>
                              </div>
                              <div class="popover_list">
                                <span>抓拍地点：</span>
                                <span>{{ item.location }}</span>
                              </div>
                            </div>
                            <el-button slot="reference">
                              <div :class="item.guestType == 'BLACK' ? 'content listRed' : item.guestType == 'GRAY' ? 'listYellow content' : 'content'">
                                {{ dateDiff(item.filming_time) }}
                              </div>
                            </el-button>
                          </el-popover>
                        </div>
                      </el-col>
                    </el-row>
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange1"
                      :current-page.sync="currentPage1"
                      :page-size="60"
                      layout="total, prev, pager, next"
                      :total="activeNames == 1 ? total1 : activeNames == 2 ? weekNum : monthNum" v-if="toDayLists.length != 0">
                    </el-pagination>
                    <div class="noMsg" v-else>
                      <div class="img"><img src="../../assets/index/zanwuneirong.png" alt=""></div>
                      <p>暂无内容</p>
                    </div>
                  </div>
                  <!-- 陌生人列表-->
                  <div class="stranger_lists lists" v-if="tab2">
                    <el-row :gutter="8">
                      <el-col :xs="4" :sm="4" :md="3" :lg="2" :xl="2"  class="list" v-for="(item,index) in strangerLists" v-bind:key="index">
                        <div :class="item.guestType == 'BLACK' ? 'grid-content bg-purple listRed' : item.guestType == 'GRAY' ? 'listYellow grid-content bg-purple' : 'grid-content bg-purple'">
                          <div class="img">
                            <img :src="item.facial_pic" alt=""  @click.stop="bigImgShow(item.facial_pic)">
                          </div>
                          <el-popover
                            placement="right"
                            title="人员详情"
                            width="200"
                            trigger="hover">
                            <div class="popoverBox">
                              <div class="popover_list">
                                <span>抓拍时间：</span>
                                <span>{{ datetimeparse(item.filming_time,'hh:mm:ss') }}</span>
                              </div>
                              <div class="popover_list">
                                <span>人员类型：</span>
                                <span>{{ item.guestType == 'STAFF' ? '工作人员' : item.guestType == 'GROUP_STAFF' ? '集团工作人员' : item.guestType == 'GRAY' ? '灰名单' : item.guestType == 'BLACK' ? '黑名单' : '陌生人' }}</span>
                              </div>
                              <div class="popover_list">
                                <span>抓拍地点：</span>
                                <span>{{ item.location }}</span>
                              </div>
                            </div>
                            <el-button slot="reference">
                              <div :class="item.guestType == 'BLACK' ? 'content listRed' : item.guestType == 'GRAY' ? 'listYellow content' : 'content'">
                                {{ dateDiff(item.filming_time) }}
                              </div>
                            </el-button>
                          </el-popover>
                        </div>
                      </el-col>
                    </el-row>
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange2"
                      :current-page.sync="currentPage2"
                      :page-size="60"
                      layout="total, prev, pager, next"
                      :total="total2" v-if="strangerLists.length != 0">
                    </el-pagination>
                    <div class="noMsg" v-else>
                      <div class="img"><img src="../../assets/index/zanwuneirong.png" alt=""></div>
                      <p>暂无内容</p>
                    </div>
                  </div>
                  <!-- 工作人员列表-->
                  <div class="white_lists lists" v-if="tab3">
                    <el-row :gutter="8">
                      <el-col :xs="4" :sm="4" :md="3" :lg="2" :xl="2"  class="list" v-for="(item,index) in whiteLists" v-bind:key="index">
                        <div :class="item.guestType == 'BLACK' ? 'grid-content bg-purple listRed' : item.guestType == 'GRAY' ? 'listYellow grid-content bg-purple' : 'grid-content bg-purple'">
                          <div class="img">
                            <img :src="item.facial_pic" alt=""  @click.stop="bigImgShow(item.facial_pic)">
                          </div>
                          <el-popover
                            placement="right"
                            title="人员详情"
                            width="200"
                            trigger="hover">
                            <div class="popoverBox">
                              <div class="popover_list">
                                <span>抓拍时间：</span>
                                <span>{{ datetimeparse(item.filming_time,'hh:mm:ss') }}</span>
                              </div>
                              <div class="popover_list">
                                <span>人员类型：</span>
                                <span>{{ item.guestType == 'STAFF' ? '工作人员' : item.guestType == 'GROUP_STAFF' ? '集团工作人员' : item.guestType == 'GRAY' ? '灰名单' : item.guestType == 'BLACK' ? '黑名单' : '陌生人' }}</span>
                              </div>
                              <div class="popover_list">
                                <span>抓拍地点：</span>
                                <span>{{ item.location }}</span>
                              </div>
                            </div>
                            <el-button slot="reference">
                              <div :class="item.guestType == 'BLACK' ? 'content listRed' : item.guestType == 'GRAY' ? 'listYellow content' : 'content'">
                                {{ dateDiff(item.filming_time) }}
                              </div>
                            </el-button>
                          </el-popover>
                        </div>
                      </el-col>
                    </el-row>
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange3"
                      :current-page.sync="currentPage3"
                      :page-size="60"
                      layout="total, prev, pager, next"
                      :total="total3" v-if="whiteLists.length != 0">
                    </el-pagination>
                    <div class="noMsg" v-else>
                      <div class="img"><img src="../../assets/index/zanwuneirong.png" alt=""></div>
                      <p>暂无内容</p>
                    </div>
                  </div>
                  <!-- 在住人列表-->
                  <div class="ailve_lists lists" v-if="tab4">
                    <el-row :gutter="8">
                      <el-col :xs="4" :sm="4" :md="3" :lg="2" :xl="2"  class="list" v-for="(item,index) in aliveLists" v-bind:key="index">
                        <div :class="item.guestType == 'BLACK' ? 'grid-content bg-purple listRed' : item.guestType == 'GRAY' ? 'listYellow grid-content bg-purple' : 'grid-content bg-purple'">
                          <div class="img">
                            <img :src="item.facial_pic" alt=""  @click.stop="bigImgShow(item.facial_pic)">
                          </div>
                          <el-popover
                            placement="right"
                            title="人员详情"
                            width="200"
                            trigger="hover">
                            <div class="popoverBox">
                              <div class="popover_list">
                                <span>抓拍时间：</span>
                                <span>{{ datetimeparse(item.filming_time,'hh:mm:ss') }}</span>
                              </div>
                              <div class="popover_list">
                                <span>人员类型：</span>
                                <span>{{ item.guestType == 'STAFF' ? '工作人员' : item.guestType == 'GROUP_STAFF' ? '集团工作人员' : item.guestType == 'GRAY' ? '灰名单' : item.guestType == 'BLACK' ? '黑名单' : '陌生人' }}</span>
                              </div>
                              <div class="popover_list">
                                <span>抓拍地点：</span>
                                <span>{{ item.location }}</span>
                              </div>
                            </div>
                            <el-button slot="reference">
                              <div :class="item.guestType == 'BLACK' ? 'content listRed' : item.guestType == 'GRAY' ? 'listYellow content' : 'content'">
                                {{ dateDiff(item.filming_time) }}
                              </div>
                            </el-button>
                          </el-popover>
                        </div>
                      </el-col>
                    </el-row>
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange4"
                      :current-page.sync="currentPage4"
                      :page-size="60"
                      layout="total, prev, pager, next"
                      :total="total4" v-if="aliveLists.length != 0">
                    </el-pagination>
                    <div class="noMsg" v-else>
                      <div class="img"><img src="../../assets/index/zanwuneirong.png" alt=""></div>
                      <p>暂无内容</p>
                    </div>
                  </div>
                  <!-- 访客列表-->
                  <div class="ailve_lists lists" v-if="tab5">
                    <el-row :gutter="8">
                      <el-col :xs="4" :sm="4" :md="3" :lg="2" :xl="2"  class="list" v-for="(item,index) in visitorLists" v-bind:key="index">
                        <div :class="item.guestType == 'BLACK' ? 'grid-content bg-purple listRed' : item.guestType == 'GRAY' ? 'listYellow grid-content bg-purple' : 'grid-content bg-purple'">
                          <div class="img">
                            <img :src="item.facial_pic" alt=""  @click.stop="bigImgShow(item.facial_pic)">
                          </div>
                          <el-popover
                            placement="right"
                            title="人员详情"
                            width="200"
                            trigger="hover">
                            <div class="popoverBox">
                              <div class="popover_list">
                                <span>抓拍时间：</span>
                                <span>{{ datetimeparse(item.filming_time,'hh:mm:ss') }}</span>
                              </div>
                              <div class="popover_list">
                                <span>人员类型：</span>
                                <span>{{ item.guestType == 'STAFF' ? '工作人员' : item.guestType == 'GROUP_STAFF' ? '集团工作人员' : item.guestType == 'GRAY' ? '灰名单' : item.guestType == 'BLACK' ? '黑名单' : '陌生人' }}</span>
                              </div>
                              <div class="popover_list">
                                <span>抓拍地点：</span>
                                <span>{{ item.location }}</span>
                              </div>
                            </div>
                            <el-button slot="reference">
                              <div :class="item.guestType == 'BLACK' ? 'content listRed' : item.guestType == 'GRAY' ? 'listYellow content' : 'content'">
                                {{ dateDiff(item.filming_time) }}
                              </div>
                            </el-button>
                          </el-popover>
                        </div>
                      </el-col>
                    </el-row>
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange5"
                      :current-page.sync="currentPage5"
                      :page-size="60"
                      layout="total, prev, pager, next"
                      :total="total5" v-if="visitorLists.length != 0">
                    </el-pagination>
                    <div class="noMsg" v-else>
                      <div class="img"><img src="../../assets/index/zanwuneirong.png" alt=""></div>
                      <p>暂无内容</p>
                    </div>
                  </div>
                </el-main>
              </el-container>
            </el-main>
          </el-container>
        </div>
        <!-- 右边图表-->
        <div class="statisticsShow">
          <!-- 控制右边收张-->
          <div class="rightColseOpen" @click="closeOpenClickRight">
            <img :src="colseOpenRight ? closeOpen[3] : closeOpen[2]" alt="">
          </div>
          <el-aside v-show="colseOpenRight">
            <statistics :totalLists="totalLists"></statistics>
          </el-aside>
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
  import ElCol from "element-ui/packages/col/src/col";
  import Statistics from './statisticsMaster.vue';
  import Vue from 'vue'
  export default {
    components: {ElCol, Statistics},
    name: 'keyChannel',
    data () {
      return {
        homeIndexShow: false,
        maskBtn:false,         // 控制大图
        handerImg: {
          img: [require('../../assets/index/topweixuan.png'), require('../../assets/index/topxuanzhong.png')]
        },
        colseOpenLeft: true,  // ture 表示左边展开状态  false 表示左边收缩状态
        colseOpenRight: true,  // ture 表示右边展开状态  false 表示右边收缩状态
        closeOpen: [require('../../assets/index/zuoshouqi.png'), require('../../assets/index/zuozhankai.png'),require('../../assets/index/youshouqi.png'), require('../../assets/index/youzhankai.png')],   // 左右收张图片集合
        hotelName: '',  // 搜索内容
        hotelArea: [],  // 酒店分布区域
        hotelAreaLen: 0, // 酒店总数
        hotelLists: [],  // 酒店列表
        changeLists: [],  // 酒店列表临时数据
        hotelTab: -1,  // 酒店区域选中
        hotelCurrent: -1, // 当前酒店选中
        bigImgSrc: '',         // 大图url
        strangerList: [],   // 陌生人待处理的列表
        indistinctList: [], // 陌生人模糊抓拍列表
        strangerNum: 0,     // 陌生人待处理的数量
        tab1: true,
        tab2: false,
        tab3: false,
        tab4: false,
        tab5: false,
        currentPage1: 1,
        currentPage2: 1,
        currentPage3: 1,
        currentPage4: 1,
        currentPage5: 1,
        total1: 0,              // 今日抓拍数量
        total2: 0,              // 陌生人数量
        total3: 0,              // 工作人员数量
        total4: 0,              // 在住人数量
        total5: 0,              // 访客数量
        totalLists: [],         // 总的数组，存放各个数量
        weekNum: 0,           // 本周抓拍数量
        monthNum: 0,          // 本月抓拍数量
        allNum: 0,            // 所有抓拍数量
        toDayLists: [],        // 今日抓拍列表
        strangerLists: [],        // 陌生人列表
        whiteLists: [],        // 工作人员列表
        aliveLists: [],        // 黑名单人员列表
        visitorLists: [],        // 灰名单人员列表
        websock: null,
        strangerTab: 1,      // 左边tab切换
        timer: null,
        loading: null,
        wsuri: null,
        wsuri_: null,  // 作对比使用
        contentWidth: [
          'width: calc(100vw - 630px);',
          'width: calc(100vw - 345px);',
          'width: calc(100vw - 30px);'
        ],   // main 宽度
        contentWidthIndex: 0,  // 状态
        handleBg: {
          backgroundImage: "url(" + require("../../assets/index/chuli.png") + ")",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100%, 100%",
        },
        strangerTabs: [
          {
            name: '全部',
            value: 'SUSPICIOUS_GUEST',
            id: 1,
          },
          {
            name: '黑名单人员(未处理)',
            value: 'BLACK',
            id: 2,
          },
          {
            name: '灰名单人员(未处理)',
            value: 'GRAY',
            id: 3,
          },
          {
            name: '陌生人(未处理)',
            value: 'SUSPICIOUS_GUEST',
            id: 4,
          },
          {
            name: '模糊抓拍',
            value: 'SUSPICIOUS_GUEST',
            id: 5,
          }
        ],
        strangerValue: 1,
        handleIndex_: 1,
        leftPage: 1,
        activeNames: 1,
        dayTime: [],
        weekTime: '',
        monthTime: '',
      }
    },
    beforeMount () {
      if (this.activeNames == 1  && this.dayTime.length == 0) {
        // 日选择
        this.dayTime.push(new Date().toLocaleDateString(), new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 60000));
      }else if (this.activeNames == 2 && this.weekTime === '') {
        // 周选择
        this.weekTime = new Date(new Date()-(new Date().getDay()-1)*86400000+(24*60*60*1000)).toLocaleDateString();
      }else if (this.activeNames == 3 && this.monthTime === '') {
        // 月选择
        this.monthTime = new Date().toLocaleDateString();
      }
      this.totalList();
    },
    mounted () {
      sessionStorage.hotelId = '';
      this.loading = Vue.prototype.$loading({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      this.hotelAllList();
//      this.getLists(0,'',0,18,'');
      this.indistinctList = [];
      this.strangerNum = [];
//      this.getLists(0,'SUSPICIOUS_GUEST',5,100,'SUSPICIOUS_GUEST');
      this.wsuri = 'wss://qa.fortrun.cn/keychannel/websocket/' + sessionStorage.roleId + '_' + encodeURIComponent(sessionStorage.session_id);
      this.$nextTick(() => {
        setTimeout(() => {
          this.initWebSocket();
          this.timer = setInterval(() => {
            this.websocketsend(888);
          },10000);
        }, 3000)
      });


      let that = this;
//      window.addEventListener('load',function (e) {
//        that.beforeunloadHandler();
//      })
    },
    methods: {

      ...mapActions([
        'getDoubtfulList','totalGuest','hasChecked', 'hotelListAll'
      ]),

      watchTest() {
        console.log(111123456789);
        this.websock.close();
        clearInterval(this.timer);
      },


      // 主体一级选择
      handleChange(val) {
        this.activeNames = val;
        if (val == 1) {
          // 日选择
          this.dayTime = [new Date().toLocaleDateString(), new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 60000)];
        }else if (val == 2) {
          // 周选择
          this.weekTime = new Date(new Date()-(new Date().getDay()-1)*86400000+(24*60*60*1000)).toLocaleDateString();
        }else if (val == 3) {
          // 月选择
          this.monthTime = new Date().toLocaleDateString();
        }
        this.handleTabChange(0);
      },

      // 二级选择
      handleTabChange(num) {
        this.currentPage1 = 1;
        this.currentPage2 = 1;
        this.currentPage3 = 1;
        this.currentPage4 = 1;
        this.currentPage5 = 1;
        if (num == 0) {
          this.tab1 = true;
          this.tab2 = false;
          this.tab3 = false;
          this.tab4 = false;
          this.tab5 = false;
          this.getLists(0,'',0,60,'');
        }else if (num == 1) {
          this.tab1 = false;
          this.tab2 = true;
          this.tab3 = false;
          this.tab4 = false;
          this.tab5 = false;
          this.getLists(0,'SUSPICIOUS_GUEST',1,60,'READ');
        }else if (num == 2) {
          this.tab1 = false;
          this.tab2 = false;
          this.tab3 = true;
          this.tab4 = false;
          this.tab5 = false;
          this.getLists(0,'STAFF',2,60,'');
        }else if (num == 3) {
          this.tab1 = false;
          this.tab2 = false;
          this.tab3 = false;
          this.tab4 = true;
          this.tab5 = false;
          this.getLists(0,'BLACK',3,60,'READ');
        }else {
          this.tab1 = false;
          this.tab2 = false;
          this.tab3 = false;
          this.tab4 = false;
          this.tab5 = true;
          this.getLists(0,'GRAY',4,60,'READ');
        }
        if (this.strangerList.length < 100) {
          this.getLists(0,this.strangerTabs[this.strangerValue-1].value,5,100,'SUSPICIOUS_GUEST');
        }
        this.totalList();
      },

      // 日期选择
      handleTimeChange(val) {
        console.log(val);
        if (this.tab1) {
          this.handleTabChange(0);
        }else if (this.tab2) {
          this.handleTabChange(1);
        }else if (this.tab3) {
          this.handleTabChange(2);
        }else if (this.tab4) {
          this.handleTabChange(3);
        }else {
          this.handleTabChange(4);
        }
      },

      // 选择
      strangerSelect(val) {
          console.log(val);
        this.strangerList = [];
        this.leftPage = 0;
          if (val == 1) {
            this.getLists(0,'SUSPICIOUS_GUEST',5,100,'SUSPICIOUS_GUEST');
          }else {
            this.getLists(0,this.strangerTabs[val-1].value,5,100,'SUSPICIOUS_GUEST');
          }
      },

      beforeunloadHandler (e) {
        this.$router.replace({name:'index'})
      },

      // 打开大图效果
      bigImgShow: function(url) {
        if (url.indexOf('assets/index') != -1) {
          this.bigImgSrc = require('../../assets/index/noMan.png');
        }else {
          this.bigImgSrc = url;
        }
        this.maskBtn = true;
      },

      // 关闭大图效果
      closeBigImg: function() { //关闭图片预览
        this.maskBtn = false;
      },

      // 左边展开收缩
      closeOpenClickLeft(){
        this.colseOpenLeft = !this.colseOpenLeft;
        if (this.colseOpenLeft && this.colseOpenRight) {
          this.contentWidthIndex = 0;
        }else if (!this.colseOpenLeft && !this.colseOpenRight) {
          this.contentWidthIndex = 2;
        }else {
          this.contentWidthIndex = 1;
        }
      },

      // 右边展开收缩
      closeOpenClickRight() {
        this.colseOpenRight = !this.colseOpenRight;
        if (this.colseOpenLeft && this.colseOpenRight) {
          this.contentWidthIndex = 0;
        }else if (!this.colseOpenLeft && !this.colseOpenRight) {
          this.contentWidthIndex = 2;
        }else {
          this.contentWidthIndex = 1;
        }
      },

      // 获取酒店列表
      hotelAllList () {
        this.hotelListAll({
          onsuccess: body => {
            if (body.data.code == 0) {
              this.hotelLists = body.data.data;
              this.changeLists = body.data.data;
              let data = this.sortList(this.hotelLists);
              for (var i = 0; i < data.length;) {
                let count = 0;
                let arr = [];
                let area = '';
                for (var j = i; j < data.length; j++) {
                  if(data[i].area == data[j].area){
                    count++;
                    arr.push(data[j]);
                  }
                }
                area = data[i].area;
                this.hotelArea.push({
                  roomList: arr,
                  name: area,
                  count: count
                });
                this.hotelAreaLen += count;
                i+=count;
              }
              console.log('this.hotelArea', this.hotelArea);
              this.$nextTick(() => {
                this.hotelTabs(-1, '全部');
                setTimeout(() => {
                  this.$refs.hotelListsHeigth.style.height = (this.$refs.hotelAside.offsetHeight - this.$refs.hotelTabsHeigth.offsetHeight - this.$refs.hotelSearchHeigth.offsetHeight - this.$refs.hotelTitleHeigth.offsetHeight - 16) + 'px';
                },150)
              })
            }
          }
        })
      },

      // 数组排序
      sortList(singers){
        return singers.sort((a, b) => {
          return a['area'].localeCompare(b['area'])
        })
      },

      // 查看酒店
      hotelItem(item, index) {
        this.hotelCurrent = index;
        sessionStorage.hotelId = item.id;
        this.getLists(0,'',0,60,'');
        this.totalList();
        this.indistinctList = [];
        this.strangerList = [];
        this.leftPage = 0;
        if (this.strangerValue == 1) {
          this.getLists(0,'SUSPICIOUS_GUEST',5,100,'SUSPICIOUS_GUEST');
        }else {
          this.getLists(0,this.strangerTabs[this.strangerValue-1].value,5,100,'SUSPICIOUS_GUEST');
        }
        this.wsuri = 'wss://qa.fortrun.cn/keychannel/websocket/' + item.id + '_' + encodeURIComponent(sessionStorage.session_id);
        this.websock.close();
        this.$nextTick(() => {
//          this.initWebSocket();
        })
      },

      // 酒店列表tab切换
      hotelTabs(index, name) {
        this.hotelTab = index;
        if (name == '全部') {
          this.hotelLists = this.changeLists;
          sessionStorage.hotelId = '';
          this.hotelCurrent = -1;
          this.getLists(0,'',0,60,'');
          this.indistinctList = [];
          this.strangerList = [];
          this.leftPage = 0;
          if (this.strangerValue == 1) {
            this.getLists(0,'SUSPICIOUS_GUEST',5,100,'SUSPICIOUS_GUEST');
          }else {
            this.getLists(0,this.strangerTabs[this.strangerValue-1].value,5,100,'SUSPICIOUS_GUEST');
          }
          this.wsuri = 'wss://qa.fortrun.cn/keychannel/websocket/' + sessionStorage.roleId + '_' + encodeURIComponent(sessionStorage.session_id);
          this.websock.close();
          this.$nextTick(() => {
//            this.initWebSocket();
            this.totalList();
          })
        }else {
          this.hotelArea.forEach(item => {
            if (item.name == name) {
              this.hotelLists = item.roomList;
            }
          });
          this.hotelItem(this.hotelLists[0], 0);
        }
      },

      // 酒店搜索
      searchHotel() {
        let arr = [];
        this.hotelTab = -1;
        this.changeLists.forEach(item => {
          if (item.name.indexOf(this.hotelName) != -1) {
            arr.push(item);
          }
        });
        this.hotelLists = arr;
      },

      // tab切换
      tabClick(num) {
        this.currentPage1 = 1;
        this.currentPage2 = 1;
        this.currentPage3 = 1;
        this.currentPage4 = 1;
        this.currentPage5 = 1;
        if (num == 0) {
          this.tab1 = true;
          this.tab2 = false;
          this.tab3 = false;
          this.tab4 = false;
          this.tab5 = false;
          this.getLists(0,'',0,60,'');
        }else if (num == 1) {
          this.tab1 = false;
          this.tab2 = true;
          this.tab3 = false;
          this.tab4 = false;
          this.tab5 = false;
          this.getLists(0,'SUSPICIOUS_GUEST',1,60,'READ');
        }else if (num == 2) {
          this.tab1 = false;
          this.tab2 = false;
          this.tab3 = true;
          this.tab4 = false;
          this.tab5 = false;
          this.getLists(0,'STAFF',2,60,'');
        }else if (num == 3) {
          this.tab1 = false;
          this.tab2 = false;
          this.tab3 = false;
          this.tab4 = true;
          this.tab5 = false;
          this.getLists(0,'BLACK',3,60,'READ');
        }else {
          this.tab1 = false;
          this.tab2 = false;
          this.tab3 = false;
          this.tab4 = false;
          this.tab5 = true;
          this.getLists(0,'GRAY',4,60,'READ');
        }
        this.totalList();
      },

      // 左边tab切换
      strangerTabClick(index) {
        this.strangerTab = index;
      },

      // 分页
      handleSizeChange (val) {

      },

      handleCurrentChange1(val) {
        console.log(`当前页: ${val}`);
        this.getLists(val-1,'',0,60,'');
      },
      handleCurrentChange2(val) {
        console.log(`当前页2: ${val}`);
        this.getLists(val-1,'SUSPICIOUS_GUEST ',1,60,'READ');
      },
      handleCurrentChange3(val) {
        console.log(`当前页3: ${val}`);
        this.getLists(val-1,'STAFF',2,60,'');
      },
      handleCurrentChange4(val) {
        console.log(`当前页4: ${val}`);
        this.getLists(val-1,'BLACK',3,60,'READ');
      },
      handleCurrentChange5(val) {
        console.log(`当前页5: ${val}`);
        this.getLists(val-1,'GRAY',4,60,'READ');
      },

      // 距离现在相差几小时函数
      dateDiff(outTime) {
        let newTime = new Date().getTime();
        let iHour;
        iHour = parseInt(Math.abs(newTime - outTime) / 1000 / 60 / 60);
        if (iHour > 0) {
          if (iHour > 24) {
            return this.datetimeparse(outTime,'MM/dd').split('/')[0] + '月' + this.datetimeparse(outTime,'MM/dd').split('/')[1] + '日'
          }else {
            return iHour+'小时前';
          }
        }else {
          let m;
          m = parseInt(Math.abs(newTime - outTime) / 1000 / 60);
          return m+'分钟前'
        }
      },


      // 获取数据列表
      getLists (page,statuses,type,limit,status) {
        page = page * 60;
        this.doubtfulList = [];
        let startTime, endTime;
        if (this.activeNames == 1) {
          startTime = new Date(this.dayTime[0]).getTime();
          endTime = new Date(this.dayTime[1]).getTime() + 59*1000;
        }else if (this.activeNames == 2) {
          startTime = new Date(this.weekTime).getTime() - (24*60*60*1000);
          endTime = new Date(this.weekTime).getTime() + (24*60*60*1000*6)-1000;
        }else if (this.activeNames == 3) {
          let year = this.datetimeparse(new Date(this.monthTime).getTime(), 'yy');
          let month = this.datetimeparse(new Date(this.monthTime).getTime(), 'MM');
          let day = new Date(year,month,0).getDate();
          startTime = new Date(new Date(year+'/'+month+'/'+'01').toLocaleDateString()).getTime();
          endTime = new Date(year+'/'+month+'/'+day).getTime() + (24*60*60*1000)-1000;
        }
        let obj = {
          createTimeStart: startTime,
          createTimeEnd: endTime,
          hotelId: sessionStorage.hotelId
        };
        if (status != '') {
          obj.status = status
        }
        if (statuses != '') {
          obj.guestType = statuses
        }
        this.getDoubtfulList ({
          offset: page,
          limit: limit,
          data: obj,
          onsuccess: body => {
            if (type == 0) {
//              this.total1 = parseInt(body.headers['x-total-count']);
              this.toDayLists = [...body.data.data];
            }else if (type == 1) {
//              this.total2 = parseInt(body.headers['x-total-count']);
              this.strangerLists = [...body.data.data];
            }else if (type == 2) {
//              this.total3 = parseInt(body.headers['x-total-count']);
              this.whiteLists = [...body.data.data];
            }else if (type == 3) {
//              this.total4 = parseInt(body.headers['x-total-count']);
              this.aliveLists = [...body.data.data];
            }else if (type == 4) {
              this.visitorLists = [...body.data.data];
            }else {
              this.strangerNum = parseInt(body.headers['x-total-count']);
              body.data.data.forEach(item => {
                item.handleLoading = false;
              });
              if (this.strangerValue == 1) {
                if (this.leftPage != 0) {
                  this.strangerList = [...this.strangerList, ...body.data.data];
                }else {
                  this.strangerList = body.data.data
                }
              }else if (this.strangerValue == 2) {
                body.data.data.forEach(item => {
                    if (item.guestType == 'BLACK') {
                      this.strangerList.push(item);
                    }
                });
              }else if (this.strangerValue == 3) {
                body.data.data.forEach(item => {
                  if (item.guestType == 'GRAY') {
                    this.strangerList.push(item);
                  }
                });
              }else {
                body.data.data.forEach(item => {
                  if (this.strangerValue == 5 && Math.abs(item.bluriness && item.bluriness) >= 0.4) {
                    this.strangerList.push(item);
                  }else if (this.strangerValue == 4 && Math.abs(item.bluriness && item.bluriness) < 0.4) {
                    this.strangerList.push(item);
                  }
                });
              }
//              body.data.data.forEach(item => {
//                item.handleLoading = false;
//                if (Math.abs(item.bluriness && item.bluriness) >= 0.4) {
//                  this.indistinctList.push(item);
//                }else {
//                  this.strangerList.push(item);
//                }
//              });
//              this.strangerList = [...body.data.data];
            }
            setTimeout(() => {
              this.loading.close();
            }, 1000);
            this.$nextTick(() => {
              this.homeIndexShow = true;
              this.$refs.elAside.$children[0].$el.style.height = this.$refs.mainHeight.$el.offsetHeight + 'px';
              this.$refs.elAside.$children[0].$el.firstChild.firstChild.style.height = (this.$refs.mainHeight.$el.offsetHeight - 1) + 'px';
              this.$refs.elAside.$children[0].$el.lastElementChild.style.maxHeight = (this.$refs.mainHeight.$el.offsetHeight - 48)+ 'px';
            })
          }
        })
      },

      // 获取总数列表
      totalList () {
        let startTime, endTime;
        if (this.activeNames == 1) {
          startTime = new Date(this.dayTime[0]).getTime();
          endTime = new Date(this.dayTime[1]).getTime() + 59*1000;
        }else if (this.activeNames == 2) {
          startTime = new Date(this.weekTime).getTime() - (24*60*60*1000);
          endTime = new Date(this.weekTime).getTime() + (24*60*60*1000*6)-1000;
        }else if (this.activeNames == 3) {
          let year = this.datetimeparse(new Date(this.monthTime).getTime(), 'yy');
          let month = this.datetimeparse(new Date(this.monthTime).getTime(), 'MM');
          let day = new Date(year,month,0).getDate();
          startTime = new Date(new Date(year+'/'+month+'/'+'01').toLocaleDateString()).getTime();
          endTime = new Date(year+'/'+month+'/'+day).getTime() + (24*60*60*1000)-1000;
        }
        this.totalGuest({
          data: {
            createTimeStart: startTime,
            createTimeEnd: endTime,
            hotelId: sessionStorage.hotelId,
          },
          onsuccess: body => {
            if (body.data.code == 0) {
              this.total1 = body.data.data.count;
              this.total2 = body.data.data.suspiciousCount;
              this.total3 = body.data.data.staffCount;
              this.total4 = body.data.data.blackCount;
              this.total5 = body.data.data.grayCount;
              this.weekNum = body.data.data.weekTotal;
              this.monthNum = body.data.data.monthTotal;
              this.allNum = body.data.data.total;
              this.totalAll();
            }
          }
        })
      },

      // 各组数量组成数组 日抓拍
      totalAll() {
        this.$nextTick(() => {
          this.totalLists = [];
          let obj = {},obj1 = {}, obj2 = {}, obj3 = {};
          obj.name = '陌生人';
          obj.value = this.total2;
          obj1.name = '在住人';
          obj1.value = this.total4;
          obj2.name = '工作人员';
          obj2.value = this.total3;
          obj3.name = '访客';
          obj3.value = this.total5;
          let startTime, endTime;
          if (this.activeNames == 1) {
            startTime = new Date(this.dayTime[0]).getTime();
            endTime = new Date(this.dayTime[1]).getTime() + 59*1000;
          }else if (this.activeNames == 2) {
            startTime = new Date(this.weekTime).getTime() - (24*60*60*1000);
            endTime = new Date(this.weekTime).getTime() + (24*60*60*1000*6)-1000;
          }else if (this.activeNames == 3) {
            let year = this.datetimeparse(new Date(this.monthTime).getTime(), 'yy');
            let month = this.datetimeparse(new Date(this.monthTime).getTime(), 'MM');
            let day = new Date(year,month,0).getDate();
            startTime = new Date(new Date(year+'/'+month+'/'+'01').toLocaleDateString()).getTime();
            endTime = new Date(year+'/'+month+'/'+day).getTime() + (24*60*60*1000)-1000;
          }
          this.totalLists.push(obj1, obj2, obj3, obj, startTime, endTime);
          sessionStorage.setItem('totalLists', JSON.stringify(this.totalLists));
          console.log('this.totalLists',this.totalLists);
        })
      },

      // 待处理的处置事件
      handelBtn(item,type){
        item.handleLoading = true;
        this.hasChecked({
          illegalGuestId: item.illegal_guest_id,
          onsuccess:body=>{
            this.$message({
              message: '处置成功',
              type: 'success'
            });
            if (type == 1) {
              this.strangerNum--;
              this.strangerList.forEach((i,index) => {
                if (i.illegal_guest_id == item.illegal_guest_id) {
                  this.$nextTick(() => {
                    this.strangerList.splice(index, 1);
                    this.total1++;
                    if (item.guestType == 'BLACK') {
                      this.total4++;
                    }else if (item.guestType == 'GRAY') {
                      this.total5++;
                    }else if (item.guestType == 'STAFF') {
                      this.total3++;
                    }else {
                      this.total2++;
                    }
                    if (this.tab1 && this.currentPage1 == 1) {
                      this.toDayLists.unshift(item);
                      if (this.toDayLists.length > 60) {
                        this.toDayLists.splice(60,1);
                      }
                    }else if (this.tab4 && item.guestType == 'BLACK' && this.currentPage4 == 1) {
                      this.aliveLists.unshift(item);
                      if (this.aliveLists.length > 60) {
                        this.aliveLists.splice(60,1);
                      }
                    }else if (this.tab5 && item.guestType == 'GRAY' && this.currentPage5 == 1) {
                      this.visitorLists.unshift(item);
                      if (this.visitorLists.length > 60) {
                        this.visitorLists.splice(60,1);
                      }
                    }else if (this.tab2 && item.guestType == 'SUSPICIOUS_GUEST' && this.currentPage2 == 1) {
                      this.strangerLists.unshift(item);
                      if (this.strangerLists.length > 60) {
                        this.strangerLists.splice(60,1);
                      }
                    }
                  });
                }
                this.totalAll();
              });
              if (this.strangerList.length <= 50) {
                this.leftPage++;
                if (this.strangerValue == 1) {
                  this.getLists(this.leftPage,'SUSPICIOUS_GUEST',5,100,'SUSPICIOUS_GUEST');
                }else {
                  this.getLists(this.leftPage,this.strangerTabs[this.strangerValue-1].value,5,100,'SUSPICIOUS_GUEST');
                }
              }
            }else {
              this.indistinctList.forEach((i,index) => {
                if (i.illegal_guest_id == item.illegal_guest_id) {
                  this.$nextTick(() => {
                    this.indistinctList.splice(index, 1);
                    this.total1++;
                    this.total2++;
                    if (this.tab1 && this.currentPage1 == 1) {
                      this.toDayLists.unshift(i);
                      if (this.toDayLists.length > 60) {
                        this.toDayLists.splice(60,1);
                      }
                    }else if (this.tab2 && this.currentPage2 == 1) {
                      this.strangerLists.unshift(i);
                      if (this.strangerLists.length > 60) {
                        this.strangerLists.splice(60,1);
                      }
                    }
                  });
                }
                this.totalAll();
              })
            }
            item.handleLoading = false;
          }
        })
      },

      //初始化weosocket
      initWebSocket(){

        //ws地址
        // const wsuri = process.env.WS_API + "/websocket/threadsocket";
        if (this.websock != null) {
          this.websock.close();
        }
        this.websock = new WebSocket(this.wsuri);
        console.log(this.websock);
        this.websock.onopen = this.websocketonopen;
        this.websock.onmessage = this.websocketonmessage;
        this.websock.onclose = this.websocketclose;
        this.websock.onerror = this.websocketerror;
      },
      websocketonopen(e){ //建立通道
        // let redata = e;
        console.log('============websocket建立链接==============');
        this.wsuri_ = this.wsuri;
      },
      websocketonmessage(e){ //数据接收
        console.log('============websocket数据接收成功==============');
        console.log(e.data);
        if (e.data && e.data != '连接成功' && e.data != 888) {
          let val = JSON.parse(e.data);
          this.weekNum = val.weekTotal;
          this.monthNum = val.monthTotal;
          this.allNum = val.total;
          let newData = JSON.parse(val.illegalGuest);
          this.$nextTick(() => {
            if (this.strangerList.length != 0) {
              let arr = JSON.parse(JSON.stringify(this.strangerList));
              this.strangerList.forEach((item, index) => {
                if (item.illegal_guest_id == newData.illegal_guest_id) {
                  arr.splice(index, 1);
                }
              });
              this.strangerList = arr;
            }

            if (newData.guestType == 'SUSPICIOUS_GUEST' || newData.guestType == 'BLACK' || newData.guestType == 'GRAY') {
              this.strangerNum++;
              newData.handleLoading = false;
              if (this.strangerValue == 1) {
                this.strangerList.unshift(newData);
              }else if (this.strangerValue == 2 && newData.guestType == 'BLACK') {
                this.strangerList.unshift(newData);
              }else if (this.strangerValue == 3 && newData.guestType == 'GRAY') {
                this.strangerList.unshift(newData);
              }else if (this.strangerValue == 5 && newData.bluriness && Math.abs(newData.bluriness) >= 0.4) {
                this.strangerList.unshift(newData);
              }else if (this.strangerValue == 4 && newData.bluriness && Math.abs(newData.bluriness) < 0.4) {
                this.strangerList.unshift(newData);
              }
            }else {
              this.total1++;
              this.toDayLists.unshift(newData);
              if (this.toDayLists.length > 60) {
                this.toDayLists.splice(60,1);
              }
              if (newData.guestType == 'STAFF') {
                this.total3++;
                this.whiteLists.unshift(newData);
                if (this.whiteLists.length > 60) {
                  this.whiteLists.splice(60,1);
                }
              }
              if (newData.guestType == 'BLACK') {
                this.total4++;
                this.aliveLists.unshift(newData);
                if (this.aliveLists.length > 60) {
                  this.aliveLists.splice(60,1);
                }
              }
              if (newData.guestType == 'GRAY') {
                this.total5++;
                this.visitorLists.unshift(newData);
                if (this.visitorLists.length > 60) {
                  this.visitorLists.splice(60,1);
                }
              }
            }
//            this.totalAll();
          });
          console.log(newData);
        }
      },
      websocketsend(agentData){//数据发送
        console.log('============websocket数据发送成功==============');
//        if (this.websock.readyState===1) {
//          this.websock.send(agentData);
//        }else{
//          this.initWebSocket();
//        }
        this.websock.send(agentData);
      },
      websocketclose(e){  //关闭通道
        console.log("关闭通道connection closed (" + e.code + ")");
//        if (this.wsuri_ == this.wsuri) {
          this.websock.close();
          clearInterval(this.timer);
//          setTimeout(() => {
//            this.initWebSocket();
//          },3000);
//        }
//        this.initWebSocket();
      },
      websocketerror(e){  //通道异常
        console.log("通道异常connection closed (" + e.code + ")");
        this.websock.close();
        setTimeout(() => {
          if (this.handleIndex_ == 1 && window.location.href.split('#/')[1] == 'homeMaster') {
            this.initWebSocket();
          }
        },3000);
      },

      beforeRouteLeave(to,from,next) {
        this.websock.close();
        clearInterval(this.timer);
        next();
      }
    },
    watch: {
      handleIndex: {
        handler: function (val, oldVal) {
          this.handleIndex_ = val.split('&')[0];
          console.log(111333, val, oldVal);   // 接收父组件的值
          this.websock.close();
          clearInterval(this.timer);
        },
//        deep: true
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .homeIndex {
    padding: 10px 15px 0;
    /*width: calc(100vw - 47px);*/
    .home_container {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .hotelLists {
        position: relative;
        height: calc(100vh - 81px);
        margin-right: 15px;
        overflow: hidden;
        min-width: 20px;
        .hotel_content {
          overflow-y: scroll;
          /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
          -ms-overflow-style:none;
          /*火狐下隐藏滚动条*/
          overflow:-moz-scrollbars-none;
          -webkit-overflow-scrolling: touch; // 为了滚动顺畅
          height: calc(100vh - 81px);
        }
        .el-aside {
          width: 280px !important;
        }
        .leftColseOpen {
          position: absolute;
          right: 0;
          top: 0;
          width: 16px;
          height: calc(100vh - 84px);
          border: 2px solid #265792;
          line-height: calc(100vh - 84px);
          text-align: center;
        }
        .el-aside {
          padding: 8px 28px 8px 8px;
          width: 300px;
          .title {
            font-size: 14px;
            color: #fff;
            text-align: left;
          }
          .search {
            margin: 8px 0;
            display: flex;
            justify-content: space-between;
            input {
              border: 1px solid #4F83D0;
              border-radius: 4px;
              background-color: inherit;
              height: 36px;
              line-height: 36px;
              padding-left: 8px;
              width: 160px;
              color: #fff;
              font-size: 14px;
            }
            input:-moz-placeholder {
              color: #C6C6C6;
            }
            input:-ms-input-placeholder {
              color: #C6C6C6;
            }
            input::-moz-placeholder {
              color: #C6C6C6;
            }
            input::-webkit-input-placeholder {
              color: #C6C6C6;
            }
            .searchBtn {
              font-size: 14px;
              color: #fff;
              width: 86px;
              height: 36px;
              position: relative;
              background-color: transparent;
              img {
                position: absolute;
                z-index: -1;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
              }
            }
          }
          .hotel_tabs {
            text-align: left;
            span {
              font-size: 12px;
              color: #fff;
              display: inline-block;
              padding: 7px 14px;
              position: relative;
              margin: 0 10px 12px 0;
              img {
                position: absolute;
                z-index: -1;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
              }
            }
          }
          .hotel_lists {
            .list {
              margin-bottom: 10px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              border: 1px solid #3798FC;
              border-radius: 8px;
              padding: 17px 12px;
              .hotel_name {
                font-size: 14px;
                color: #fff;
              }
              .hotel_btn {
                width: 60px;
                display: inline-block;
              }
            }
            .list.active {
              background: #103A72;
            }
          }
        }
        .bg {
          position: absolute;
          z-index: -1;
          left: 0;
          top: 0;
          width: 280px;
          img {
            display: block;
            width: 100%;
            height: calc(100vh - 81px);
          }
        }
      }
      .hotelLists .hotel_content::-webkit-scrollbar {
        display: none; // 隐藏滚动条
      }
      .home_content {
        width: calc(100vw - 630px);
      }
      .el-container {
        .el-aside {
          width: 200px;
          padding: 8px;
          margin-right: 15px;
          position: relative;
          overflow: hidden;
          height: calc(100vh - 81px);
          .bg {
            position: absolute;
            z-index: -1;
            left: 0;
            top: 0;
            width: 100%;
            height: calc(100vh - 81px);
            img {
              display: block;
              width: 100%;
              height: calc(100vh - 81px);
            }
          }
          .stranger_title {
            font-size: 14px;
            text-align: left;
            line-height: 24px;
            display: inline-block;
            .stranger_tab {
              position: relative;
              text-align: center;
              cursor: pointer;
              color: #3596FC;
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 284px;
              .tabTitle {
                color: #408FE9;
                font-size: 14px;
              }
              .el-select {
                  max-width: 180px;
                /deep/ .el-input__inner {
                  background-color: transparent !important;
                  color: #3596FC;
                  border-color: #3596FC;
                }
              }
              img {
                position: absolute;
                width: 100%;
                height: 100%;
                z-index: -1;
                left: 0;
                top: 0;
              }
            }
            .active {
              color: #fff;
            }
          }
          .stranger_list {
            height: calc(100vh - 118px);
            overflow-y: scroll;
            /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
            -ms-overflow-style:none;
            /*火狐下隐藏滚动条*/
            overflow:-moz-scrollbars-none;
            -webkit-overflow-scrolling: touch; // 为了滚动顺畅
            -ms-scroll-chaining: chained;
            -ms-overflow-style: none;
            -ms-content-zooming: zoom;
            -ms-scroll-rails: none;
            -ms-content-zoom-limit-min: 100%;
            -ms-content-zoom-limit-max: 500%;
            -ms-scroll-snap-type: proximity;
            -ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);
            .list {
              margin-top: 8px;
              border: 1px solid #F46C6C;
              border-radius: 8px;
              padding: 8px;
              display: flex;
              justify-content: flex-start;
              .img {
                width: 100px;
                height: 100px;
                border-radius: 8px;
                img {
                  display: inline-flex;
                  width: 100%;
                  height: 100%;
                  cursor: pointer;
                }
              }
              .list_content {
                width: 174px;
                position: relative;
                margin-left: 8px;
                p {
                  display: flex;
                  justify-content: flex-start;
                  color: #fff;
                  font-size: 14px;
                  text-align: left;
                  display: -webkit-box;
                }
                p:last-of-type {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                }
                .handle {
                  width: 60px;
                  height: 24px;
                  display: inline-block;
                  position: absolute;
                  bottom: 0;
                  right: 0;
                  cursor: pointer;
                  font-size: 14px;
                  text-align: center;
                  line-height: 24px;
                }
                /deep/ .el-icon-loading {
                  position: absolute;
                  top: 25%;
                  left: 38%;
                  transform: translate(-50%, -50%);
                }
              }
            }
            .listRed {
              background-color: #FB2142;
            }
            .listYellow {
              background-color: #F5A623;
            }
          }
          .stranger_list::-webkit-scrollbar {
            display: none; // 隐藏滚动条
            width:0px;
            height:0px;
          }
          .stranger_list .-o-scrollbar{
            -moz-appearance: none !important;
            background: rgba(0,255,0,0) !important;
          }

        }
        .el-main {
          padding: 0;
          .el-header {
            height: 70px !important;
            padding: 0;
            .el-col-8 {
              height: 70px;
              width: calc(33.33333% - 15px);
              margin-right: 15px;
              position: relative;
              .bg {
                position: absolute;
                left: 0;
                top: 0;
                z-index: 8;
                width: 100%;
                height: 70px;
                img {
                  display: inline-block;
                  width: 100%;
                  height: 100%;
                }
              }
              .timerChange {
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                z-index: 10;
                display: flex;
                align-items: center;
                justify-content: space-around;
                flex-direction: column;
                .time_title {
                  font-size: 16px;
                  color: #408FE9;
                  padding-left: 13px;
                  height: 50%;
                  display: inline-flex;
                  width: calc(100% - 13px);
                  align-items: center;
                  justify-content: space-between;
                  border-bottom: 1px solid #265792;
                }
                .timer_change {
                  display: inline-flex;
                  align-items: center;
                  justify-content: flex-start;
                  width: 100%;
                }
                /deep/ .el-date-editor .el-range-input {
                  width: 42%;
                }
                /deep/ .el-date-editor.el-input {
                  width: 100%;
                }
                /deep/ .el-date-editor--datetimerange.el-input,
                /deep/.el-date-editor--datetimerange.el-input__inner,
                /deep/ .el-input--prefix .el-input__inner {
                  width: 100%;
                  padding: 0 10px;
                  height: 50%;
                  line-height: 1;
                }
                /deep/ .el-input--prefix .el-input__inner {
                  padding: 0 30px;
                }
                /deep/ .el-input__inner {
                  background-color: transparent;
                  border: none;
                  font-size: 16px;
                  color: #FFFFFF;
                  .el-range-input {
                    background-color: transparent;
                    font-size: 16px;
                    color: #FFFFFF;
                  }
                }
                /deep/ .el-date-editor .el-range-separator {
                  width: 6%;
                  font-size: 16px;
                  color: #FFFFFF;
                }
                /deep/ .el-date-editor .el-range__close-icon {
                  display: none;
                }
                /deep/ .el-input__icon {
                  line-height: 1;
                }
                /deep/ .el-icon-circle-close {
                  display: none;
                }
              }
            }
            .el-col-16 {
              height: 70px;
              position: relative;
              .bg {
                position: absolute;
                left: 0;
                top: 0;
                z-index: 8;
                width: 100%;
                height: 70px;
                img {
                  display: inline-block;
                  width: 100%;
                  height: 100%;
                }
              }
              .tabs {
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                z-index: 10;
                display: flex;
                align-items: center;
                justify-content: space-around;
                .tabs_item {
                  display: inline-flex;
                  align-items: center;
                  justify-content: space-around;
                  .item_tab_one {
                    background-color: transparent;
                    border: none;
                    font-size: 14px;
                    color: #A6ADB4;
                    height: 70px;
                    line-height: normal;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    cursor: pointer;
                    span {
                      display: block;
                    }
                  }
                  .item_tab_two {
                    width: 80%;
                    height: 100%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: space-around;
                    .item_tab {
                      display: inline-flex;
                      align-items: center;
                      justify-content: center;
                      flex-direction: column;
                      height: 100%;
                      cursor: pointer;
                      font-size: 14px;
                      color: #3798FC;
                      span {
                        display: block;
                        margin-top: 8px;
                      }
                    }
                    .active {
                      color: #FAFAFB;
                    }
                  }
                }
                .tabs_item.is_active {
                  width: 70%;
                  .item_tab_one {
                    font-size: 16px;
                    color: #fff;
                    span {
                      margin-top: 8px;
                    }
                  }
                }
              }
            }
          }
          .el-main {
            margin-top: 12px;
            padding: 12px 12px 40px;
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
              height: calc(100vh - 214px);
              overflow-y: scroll;
              /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
              -ms-overflow-style:none;
              /*火狐下隐藏滚动条*/
              overflow:-moz-scrollbars-none;
              -webkit-overflow-scrolling: touch; // 为了滚动顺畅
            }
            .lists::-webkit-scrollbar {
              display: none; // 隐藏滚动条
            }
            .lists {
              .el-row {
                /*margin-bottom: 10px;*/
                &:last-child {
                  margin-bottom: 0;
                }
              }
              .list {
                margin: 0 0 8px;
                min-width: 96px;
                .grid-content {
                  border-radius: 8px;
                  border: 2px solid #3798FC;
                  .img {
                    width: 100%;
                    height: 0;
                    padding-bottom: 100%;
                    position: relative;
                    img {
                      display: block;
                      width: 100%;
                      height: 100%;
                      position: absolute;
                      left: 0;
                      top: 0;
                      border-radius: 8px 8px 0 0;
                      cursor: pointer;
                    }
                  }
                  .el-button {
                    padding: 0;
                    width: 100%;
                    background: transparent;
                    border: none;
                    border-radius: 0 0 8px 8px;
                    .content {
                      background: #103A72;
                      padding: 11px 0;
                      text-align: center;
                      font-size: 14px;
                      color: #FFFFFF;
                      border-radius: 0 0 8px 8px;
                    }
                    .listRed {
                      background-color: #FB2142;
                    }
                    .listYellow {
                      background-color: #F5A623;
                    }
                  }
                }
                .listRed {
                  border-color: #FB2142;
                  .el-button {
                    .content {
                      border-radius: 0;
                    }
                  }
                }
                .listYellow {
                  border-color: #F5A623;
                  .el-button {
                    .content {
                      border-radius: 0;
                    }
                  }
                }
                .grid-content:hover {
                  /*border: 1px solid #F46C6C;*/
                }
              }
            }
          }
        }
      }
      .statisticsShow {
        position: relative;
        padding-left: 20px;
        height: calc(100vh - 81px);
        margin-left: 15px;
        .rightColseOpen {
          position: absolute;
          left: 0;
          top: 0;
          width: 18px;
          height: calc(100vh - 84px);
          border: 2px solid #265792;
          line-height: calc(100vh - 84px);
          text-align: center;
        }
        .el-aside {
          width: 280px !important;
        }
      }
    }
    .home_container>.el-aside {
      padding: 0;
      margin-right: 0;
      margin-left: 15px;
      height: auto;
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
  }

  /deep/ .el-pagination__total {
    color: #5691D1;
  }

  /deep/ .el-pagination {
    position: absolute;
    bottom: 10px;
    text-align: center;
    left: 50%;
    transform: translateX(-50%);
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
