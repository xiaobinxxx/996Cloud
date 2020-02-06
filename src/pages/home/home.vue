<template>
  <div class="page" ref="page" @click="PopperIndex = -1">
    <!--侧边导航栏-->
    <div class="app-navigation" ref="app-navigation">
      <div class="nav-list" ref="app-nav-list">
        <div class="list" :class="{'active':view===''}">
          <router-link :to="{path: '/',query:{view:''}}">
            <span class="iconfont icon-folder icon"></span>
            <span>全部文件</span>
          </router-link>
        </div>
        <div class="list" :class="{'active':view==='favorites'}">
          <router-link :to="{path: '/',query:{view:'favorites'}}">
            <span class="iconfont icon-star icon"></span>
            <span>收藏</span>
          </router-link>
        </div>
        <div class="list" :class="{'active':view==='sharingout'}">
          <router-link :to="{path: '/',query:{view:'sharingout'}}">
            <span class="iconfont icon-star icon"></span>
            <span>我分享的文件</span>
          </router-link>
        </div>
      </div>
    </div>
    <!--文件页面-->
    <div class="app-files" v-loading="isLoading">
      <!--导航进步-->
      <div class="controls">
        <a href="javascript:;" class="nav-list" @click="onMenuShow" v-if="MenuIcon">
          <span class="iconfont icon-menu"></span>
        </a>
        <a href="javascript:;" class="nav-list" @click="onNavSkip({},-1)">
          <span class="iconfont icon-home"></span>
          <span class="more"></span>
        </a>
        <a class="nav-list" v-for="(item,index) in NavUrl"
           href="javascript:;"
           @click="onNavSkip(item,index)"
           :data-index="index"
           :key="index">
          <span v-if="index != 0">{{item}}</span>
          <span class="more" v-if="index != 0"></span>
        </a>
        <!--添加-->
        <el-popover placement="bottom"
                    width="180"
                    trigger="click"
                    v-if="view===''">
          <div class="add-list">
            <div class="lists" @click.stop="onUpLoad">
              <span class="iconfont icon-uploading"></span>
              <span>上传</span>
              <input type="file" ref="file" @change="ChangeFile" multiple hidden>
            </div>
            <div class="lists" @click.stop="onAddList(1)">
              <span class="iconfont icon-folder"></span>
              <span v-if="!isCatalogue">文件夹</span>
              <input type="text"
                     v-model="fileName"
                     v-focus="isCatalogue"
                     v-blur="!isCatalogue"
                     @blur="AddBlurFocus"
                     @keyup="onKeyupFolder"
                     v-else>
            </div>
          </div>
          <div class="add-btn" slot="reference">
            <span class="iconfont icon-add"></span>
          </div>
        </el-popover>
      </div>
      <div class="progress" v-show="$store.state.progress.complete != 0">
        <el-progress :percentage="$store.state.progress.complete"></el-progress>
      </div>
      <!--标题-->
      <div class="head-title">
        <div class="list" style="flex: 1;">
          <el-checkbox v-model="checked" @change="onCheckAll"></el-checkbox>
        </div>
        <div class="list" style="flex: 7;">
          <span v-show="isColumntitle">{{columntitle}}</span>
          <span v-show="!isColumntitle" @click="onFileSort(1)">名称 <i class="sort"
                                                                     :style="isSortName?'transform: rotate(180deg)':''"></i></span>
        </div>
        <div class="list" style="flex: 1;">
          <span v-show="isColumntitle" @click="onAllDownLoad">{{FileSize}}</span>
          <span v-show="!isColumntitle" @click="onFileSort(2)">大小 <i class="sort"
                                                                     :style="isSortSize?'transform: rotate(180deg)':''"></i></span>
        </div>
        <div class="list" style="flex: 2;">
          <span v-show="isColumntitle" @click="onAllDel"><i class="iconfont icon-del"></i>删除</span>
          <span v-show="!isColumntitle" @click="onFileSort(3)">修改日期 <i class="sort"
                                                                       :style="isSortDate?'transform: rotate(180deg)':''"></i></span>
        </div>
      </div>
      <!--文件列表-->
      <div class="file-list">
        <div class="list" v-for="(item,index) in FileList"
             @click.stop="!item.isName?onFiles(item,index):''"
             :key="index">
          <!--收藏-->
          <div class="collect" @click.stop="onCollectFile(item,index)">
            <span class="iconfont icon-star icon"
                  :style="item.isCollect===1?'display: inline-block;color: #409eff;':''"></span>
          </div>
          <!--图标-->
          <div class="icon"
               style="flex: 1;">

            <div class="thumb"
                 v-if="'.png|.jpg|.gif|'.indexOf(item.name.split('.')[1]+'|')!=-1">
              <img :src="`${Global.host}${item.url}`" alt="">
            </div>
            <div class="thumb iconfont base-color icon-word"
                 v-else-if="'.doc|.docx|'.indexOf(item.name.split('.')[1]+'|')!=-1">

            </div>
            <div class="thumb iconfont base-color icon-yasuo"
                 v-else-if="'.tar|.zip|.rar|.7z|'.indexOf(item.name.split('.')[1]+'|')!=-1">

            </div>
            <div class="thumb iconfont base-color icon-music"
                 v-else-if="'.mp3|.3gs|.flac|'.indexOf(item.name.split('.')[1]+'|')!=-1">

            </div>
            <div class="thumb iconfont base-color icon-video"
                 v-else-if="'.mp4|.avi|.mov|.wmv|.flv|.mpg|'.indexOf(item.name.split('.')[1]+'|')!=-1">

            </div>
            <div class="thumb iconfont base-color icon-pdf"
                 v-else-if="'.pdf|'.indexOf(item.name.split('.')[1]+'|')!=-1">
            </div>
            <div class="thumb iconfont base-color icon-exe"
                 v-else-if="'.exe|'.indexOf(item.name.split('.')[1]+'|')!=-1">
            </div>
            <div class="thumb iconfont base-color icon-folder"
                 :class="item.type===0?'icon-file':'icon-folder'"
                 v-else>
            </div>
            <div class="" @click.stop="onStop">
              <el-checkbox class="check"
                           v-model="item.isCheck"
                           @change="onFilesChange"
                           :style="item.isCheck?'display:inline-block':''">
              </el-checkbox>
            </div>
          </div>
          <!--名称-->
          <a class="name"
             style="flex: 6;"
             :href="item.type===0 && !item.isName?`${Global.host}${item.url}`:'javascript:;'"
             :download="item.name">
            <div class="block" v-if="item.isName">
              <input type="text"
                     v-model="item.name"
                     placeholder="请输入文件名称"
                     class="isname"
                     v-focus="item.isName"
                     v-blur="!item.isName"
                     @keyup.stop="onKeyupFileName(index,$event)"
                     @blur.stop="onBlurFileName(index,$event)">
            </div>
            <div class="block" v-else>
              <input type="text"
                     class="one-omit"
                     v-model="item.name"
                     disabled="true"
                     placeholder="请输入文件名称">
            </div>
          </a>
          <!--工具-->
          <div class="operation" style="flex: 1;" @click.stop="onStop">
            <span class="iconfont icon-share" @click="onFileDetails(item,index)"></span>
            <span class="iconfont icon-more" slot="reference" @click="PopperIndex = index"></span>
            <div class="popover" v-show="PopperIndex === index">
              <div class="add-list">
                <div class="lists" @click="onFileDetails(item,index)">
                  <span class="iconfont icon-detail"></span>
                  <span>详细</span>
                </div>
                <div class="lists" @click.stop="onRename(item,index)">
                  <span class="iconfont icon-ren"></span>
                  <span>重命名</span>
                </div>
                <div class="lists" @click.stop="onDownLoad(item,index)">
                  <span class="iconfont icon-download"></span>
                  <span>下载</span>
                </div>
                <div class="lists" @click.stop="onDecompression(item,index)"
                     v-if="'.tar|.zip|.rar|.7z|'.indexOf(item.name.split('.')[1]+'|')!=-1">
                  <span class="iconfont icon-jieya"></span>
                  <span>解压</span>
                </div>
                <div class="lists" @click.stop="onDelFile(item,index)">
                  <span class="iconfont icon-del"></span>
                  <span>删除</span>
                </div>
              </div>
            </div>
          </div>
          <div class="size" style="flex: 1;">{{item.type===0?item.size:''}}</div>
          <div class="time" style="flex: 2;">{{item.ctime}}</div>
        </div>
      </div>
      <no-resources hint="暂无文件内容" v-show="FileList.length === 0"></no-resources>
    </div>
    <!--详细弹出层-->
    <el-drawer
            title="文件详情"
            :size="DrawerSize"
            :visible.sync="filesDrawer"
            :show-close="false"
            :with-header="false">
      <!--文件详情-->
      <file-details :FileInfo="FileInfo" v-if="FileInfo.ShareUrl"></file-details>
    </el-drawer>
    <!--照片查看-->
    <photo-banner :PhotoList="PhotoList" ref="photo"></photo-banner>
    <!--视频查看-->
<!--    <video-details :VidoeList="VidoeList" ref="video"></video-details>-->
    <!--返回顶部-->
    <el-backtop target=".app-files"></el-backtop>
  </div>
</template>

<script>
  import {
    HomeFile,
    getFiles,
    CreateFolder,
    Uploading,
    DeleteFile,
    RenameFile,
    CompressedFiles,
    CollectFile,
    ShareFileDetail,
    CollectFileList,
    MyShareList,
    unCompressedFiles,
    downloadFile,
  } from '../../axios/api'
  import FileDetails from "../../components/FileDetails/FileDetails";
  import PhotoBanner from "../../components/PhotoBanner/PhotoBanner";
  import NoResources from "../../components/NoResources/NoResources";
  export default {
    name: "home",
    components: {NoResources, PhotoBanner, FileDetails},
    data() {
      return {
        // 全选
        checked: false,
        FileList: [],
        SearchList: [],
        isFocus: true,
        isLoading: false,
        // 文件列表更多索引
        PopperIndex: -1,
        // 切换页面展示
        view: '',
        ino: 0,
        url: '',
        // 导航url
        NavUrl: [],
        // 导航计数
        NavNum: [],
        // 目录
        isCatalogue: false,
        fileName: '新建文件夹',
        // 重命名文件
        FileName: '',
        NewFileName: '',
        FileIno: '',
        FileUrl: '',
        // 鼠标移出 false 回车 true
        isFileNameWay: false,
        // 选择文件
        columntitle: '',
        isColumntitle: false,
        FileSize: 0,
        // 详细弹出层
        filesDrawer: false,
        DrawerSize: '40%',
        FileInfo: {},
        // 照片列表
        PhotoList: [],
        // 菜单
        MenuIcon: false,
        isMenu: true,
        // 视频列表
        VideoList: [],
        // 排序
        isSortName: false,
        isSortSize: false,
        isSortDate: false,
      }
    },
    directives: {
      focus: {
        inserted: function (el, {value}) {
          if (value) {
            el.focus();
            el.select();
          }
        }
      },
      blur: {
        inserted: function (el, {value}) {
          if (value) {
            el.blur();
          }
        }
      }
    },
    created() {
    },
    mounted() {
      if (this.$refs['page'].clientWidth < 768) {
        this.DrawerSize = '80%';
      }
      if (this.$route.query.ino) {
        this.ino = this.$route.query.ino || '';
        this.url = this.$route.query.url || '';
        this.NavUrl = this.url.split('/');
        this.getFile();
        return;
      }
      this.NavUrl = [];
      this.url = '';
      this.ino = '';
      this.getData();
      // 默认设置窗口大小变化
      if (document.body.clientWidth > 768) {
        this.$refs['app-navigation'].style.width = '250px';
        this.$refs['app-nav-list'].style.display = 'block';
        this.DrawerSize = '40%';
        this.MenuIcon = false;
      } else {
        this.$refs['app-navigation'].style.width = '0';
        this.$refs['app-nav-list'].style.display = 'none';
        this.DrawerSize = '80%';
        this.MenuIcon = true;
      }
      // 监听窗口大小变化
      window.onresize = () => {
        if (document.body.clientWidth > 768) {
          this.$refs['app-navigation'].style.width = '250px';
          this.$refs['app-nav-list'].style.display = 'block';
          this.DrawerSize = '40%';
          this.MenuIcon = false;
        } else {
          this.$refs['app-navigation'].style.width = '0';
          this.$refs['app-nav-list'].style.display = 'none';
          this.DrawerSize = '80%';
          this.MenuIcon = true;
        }
      };
    },
    methods: {
      getData() {
        this.view = this.$route.query.view || '';
        switch (this.view) {
          case '':
            this.getHome();
            break;
          case 'favorites':
            this.getCollection();
            break;
          case 'sharingout':
            this.getShare();
            break;
        }
      },
      /**
       * 首页文件数据
       */
      getHome() {
        this.isLoading = true;
        HomeFile({
          ino: this.ino,
          url: this.url,
        }).then(res => {
          this.isLoading = false;
          this.FileList = res.result;
          this.SearchList = res.result;
        })
      },
      /**
       * 收藏文件数据
       */
      getCollection() {
        this.isLoading = true;
        CollectFileList({
          ino: this.ino,
          url: this.url,
        }).then(res => {
          this.isLoading = false;
          this.FileList = res.result;
          this.SearchList = res.result;
        })
      },
      /**
       * 分享出去文件数据
       */
      getShare() {
        this.isLoading = true;
        MyShareList().then(res => {
          this.isLoading = false;
          this.FileList = res.result;
          this.SearchList = res.result;
        })
      },
      /**
       * 进入目录
       */
      getFile() {
        this.isLoading = true;
        getFiles({
          ino: this.ino,
          url: this.url,
        }).then(res => {
          this.isLoading = false;
          this.FileList = res.result;
          this.SearchList = res.result;
        })
      },
      /**
       * 文件点击
       */
      onFiles(item, index) {
        this.ino = item.ino;
        this.url = item.url;
        this.PopperIndex = -1;
        let ImgFormat = '.png|.jpg|.gif|';
        let VideoFormat = '.mp4|.avi|.mov|.wmv|.flv|.mpg|';
        let idx = 0;
        if (item.type === 1) {
          this.$router.push({name: 'home', query: {ino: item.ino, url: item.url}});
        }
        // 图片文件
        if (ImgFormat.indexOf(item.name.split('.')[1] + '|') != -1) {
          this.PhotoList = [];
          for (let i = 0; i < this.FileList.length; i++) {
            if (ImgFormat.indexOf(this.FileList[i].name.split('.')[1] + '|') != -1) {
              idx++;
              this.FileList[i].index = idx;
              this.PhotoList.push(this.FileList[i]);
            }
          }
          this.$refs['photo'].show(item.index);
          return;
        }
        // 视频文件
        if (VideoFormat.indexOf(item.name.split('.')[1] + '|') != -1) {
          this.VideoList = [];
          for (let i = 0; i < this.FileList.length; i++) {
            if (VideoFormat.indexOf(this.FileList[i].name.split('.')[1] + '|') != -1) {
              idx++;
              this.FileList[i].index = idx;
              this.VideoList.push(this.FileList[i]);
            }
          }
          this.$router.push({name: 'VideoDetails',query:{VideoList: encodeURIComponent(JSON.stringify(this.VideoList)),index: item.index}})
          return;
        }
      },
      /**
       * 导航点击
       */
      onNavSkip(item, index) {
        this.NavNum = [];
        if (index === -1) {
          this.$router.go(`-${this.NavUrl.length - 1}`);
          return;
        }
        for (let i = 0; i < this.NavUrl.length; i++) {
          this.NavNum.push(i);
        }
        this.NavNum.reverse();
        this.$router.go(`-${this.NavNum[index] + 1}`);
      },
      /**
       * 添加列表点击
       */
      onAddList(type) {
        switch (type) {
          case 0:     // 上传文件
            break;
          case 1:     // 新建目录
            this.isCatalogue = true;
            break;
        }
      },
      /**
       * 文件上传点击
       */
      onUpLoad() {
        this.$refs['file'].click();
      },
      /**
       * 文件上传变化
       */
      ChangeFile(e) {

        let files = e.target.files;
        Uploading({
          files: files,
          url: this.url,
          ino: this.ino,
        })
        // Uploading({
        //   files: files,
        //   url: this.url,
        //   ino: this.ino,
        // }).then(res => {
        //   this.isCatalogue = false;
        //   if (!this.ino) {
        //     this.getData();
        //   } else {
        //     this.getFile();
        //   }
        // })
      },
      /**
       * 创建文件按键监听
       */
      onKeyupFolder(e) {
        if (e.keyCode === 13) {
          this.isLoading = true;
          CreateFolder({
            url: this.url,
            ino: this.ino,
            fileName: this.fileName,
          }).then(res => {
            this.isCatalogue = false;
            this.isLoading = false;
            if(res.status != 0){
              this.$message.error(res.message);
              return;
            }
            if (!this.ino) {
              this.getData();
            } else {
              this.getFile();
            }
            this.fileName = '新建文件夹';
          });
        }
      },
      /**
       * 创建文件失去焦点
       */
      AddBlurFocus(e) {
        this.isCatalogue = false;
      },
      /**
       * 文件重命名按键监听
       */
      onKeyupFileName(index, e) {
        if (e.keyCode === 13) {
          this.FileList[index].isName = false;
          this.isFileNameWay = true;
          this.NewFileName = e.target.value;
          RenameFile({
            name: this.FileName,
            NewName: this.NewFileName,
            url: this.url,
            FileIno: this.FileIno,
            FileUrl: this.FileUrl,
          }).then(res => {
            this.isFileNameWay = false;
            if (!this.ino) {
              this.getData();
            } else {
              this.getFile();
            }
          });
        }
      },
      /**
       * 重命名文件失去焦点
       */
      onBlurFileName(index, e) {
        this.FileList[index].isName = false;
        if (!this.isFileNameWay) {
          this.NewFileName = e.target.value;
          RenameFile({
            name: this.FileName,
            NewName: this.NewFileName,
            url: this.url,
            FileIno: this.FileIno,
            FileUrl: this.FileUrl,
          }).then(res => {
            this.isCatalogue = false;
            if (!this.ino) {
              this.getData();
            } else {
              this.getFile();
            }
          });
        }
        this.$forceUpdate();
      },
      /**
       * 文件详情
       */
      onFileDetails(item, index) {
        this.FileInfo = item;
        ShareFileDetail({
          ino: item.ino,
        }).then(res => {
          this.FileInfo.ShareUrl = `${res.result.ShareUrl}&privacy=${res.result.isPrivacy}`;
          this.FileInfo.ShareId = res.result.ShareId;
          this.FileInfo.password = res.result.password;
          this.FileInfo.EndTime = new Date(res.result.EndTime * 1000).toLocaleString();
          this.filesDrawer = true;
        });
      },
      /**
       * 重命名点击
       */
      onRename(item, index) {
        this.FileList[index].isName = true;
        this.FileName = item.name;
        this.FileIno = item.ino;
        this.FileUrl = item.url;
        this.PopperIndex = -1;
      },
      /**
       * 下载点击
       */
      onDownLoad(item, index) {
        var link = document.createElement('a');
        this.PopperIndex = -1;
        // 判断你是不是文件夹
        if (item.type === 1) {
          CompressedFiles({
            FilesArr: [{
              url: this.url,
              name: item.name,
              type: item.type,
            }]
          }).then(res => {
            link.setAttribute("download", res.result.name);
            link.href = `${this.Global.host}${res.result.url}`;
            link.click();
          });
          return;
        }
        link.setAttribute("download", item.name);
        link.href = `${this.Global.host}${item.url}`;
        link.click();
      },
      /**
       * 解压文件
       */
      onDecompression(item, index) {
        this.PopperIndex = -1;
        this.$message.info('正在解压文件...');
        unCompressedFiles({
          FilesArr: [{
            url: this.url,
            name: item.name,
            type: item.type,
          }]
        }).then(res => {
          if (!this.ino) {
            this.getData();
          } else {
            this.getFile();
          }
          this.$message.success(res.message);
        })
      },
      /**
       * 全选点击
       */
      onCheckAll(value) {
        let fileSum = 0;
        let filesSum = 0;

        this.isColumntitle = true;
        this.FileSize = 0;
        for (let i = 0; i < this.FileList.length; i++) {
          // 判断是否选中
          if (value) {
            this.FileList[i].isCheck = true;
            this.FileSize += this.FileList[i].SizeNum;
          } else {
            this.FileList[i].isCheck = false;
            this.isColumntitle = false;
          }
          // 判断类型
          if (this.FileList[i].type === 0) {
            fileSum++;
          } else {
            filesSum++;
          }
        }
        this.columntitle = `${filesSum}个文件夹${fileSum}个文件`;
        this.FileSize = this.util.renderSize(this.FileSize);
      },
      /**
       * 列表文件选择点击
       */
      onFilesChange(value) {
        let fileSum = 0;
        let filesSum = 0;
        // 记录二维数组长度
        let sum = 0;
        // 记录check为true的二维数组长度
        let chenk = 0;
        let offChenk = 0;
        this.isColumntitle = true;
        this.FileSize = 0;
        for (let i = 0; i < this.FileList.length; i++) {
          sum++;
          // 判断是否为true
          if (this.FileList[i].isCheck) {
            chenk++;
            this.FileSize += this.FileList[i].SizeNum;
            // 判断类型
            if (this.FileList[i].type === 0) {
              fileSum++;
            } else {
              filesSum++;
            }
          } else {
            offChenk++;
          }
        }
        // 比较二维数组长度是否等于check为true二维数组长度
        if (sum == chenk) {
          this.checked = true;
          // console.log('相等都为true');
        } else {
          this.checked = false;
          // console.log('不相等');
        }
        // 判断是否全部为false
        if (sum == offChenk) {
          this.isColumntitle = false;
        }
        this.columntitle = `${filesSum}个文件夹${fileSum}个文件`;
        this.FileSize = this.util.renderSize(this.FileSize);
      },
      onStop() {
        // console.log(22)
      },
      /**
       * 删除文件
       */
      DelFile(FilesArr){
        if(FilesArr.length === 0){
          this.$message.info('请选择删除的文件');
          return;
        }
        DeleteFile({
          FilesArr,
        }).then(res => {
          this.isColumntitle = false;
          this.isLoading = false;
          if(res.status != 0){
            this.$message.error(res.message);
            return;
          }
          if (!this.ino) {
            this.getData();
          } else {
            this.getFile();
          }
          this.$message.success(res.message);
        })
      },
      /**
       * 文件删除
       */
      onDelFile(item, index) {
        this.isLoading = true;
        let FilesArr = [{
          url: item.url,
          name: item.name,
          ino: item.ino,
          type: item.type,
        }];
        this.DelFile(FilesArr);
        this.PopperIndex = -1;
      },
      /**
       * 选中删除
       */
      onAllDel(e) {
        let FilesArr = [];
        for (let i = 0; i < this.FileList.length; i++) {
          // 判断是否为true
          if (this.FileList[i].isCheck) {
            FilesArr.push({
              url: this.FileList[i].url,
              name: this.FileList[i].name,
              type: this.FileList[i].type,
              ino: this.FileList[i].ino,
            })
          }
        }
        this.DelFile(FilesArr);
      },
      /**
       * 选中下载
       */
      onAllDownLoad() {
        // let FilesArr = [];
        // for(let i = 0; i < this.FileList.length;i++){
        //   // 判断是否为true
        //   if(this.FileList[i].isCheck){
        //     FilesArr.push({
        //       url: this.url,
        //       name: this.FileList[i].name,
        //       type: this.FileList[i].type,
        //     })
        //   }
        // }
        //
        // CompressedFiles({
        //   FilesArr,
        // }).then(res =>{
        //
        // })
      },
      /**
       * 收藏文件
       */
      onCollectFile(item, index) {
        CollectFile({
          url: item.url,
          ino: item.ino,
          fileName: item.name,
          type: item.type,
          status: item.isCollect === 1 ? 2 : 1,         // 1 是 2 否
        }).then(res => {
          if (!this.ino) {
            this.getData();
          } else {
            this.getFile();
          }
          this.$message.success(res.message);
        })
      },
      /**
       * 菜单展示
       */
      onMenuShow() {
        if (this.isMenu) {
          this.$refs['app-navigation'].style.width = '50%';
          setTimeout(() => {
            this.$refs['app-nav-list'].style.display = 'block';
          }, 300);
        } else {
          this.$refs['app-navigation'].style.width = '0';
          this.$refs['app-nav-list'].style.display = 'none';
        }
        this.isMenu = !this.isMenu;
      },
      /**
       * 文件大小比较
       * a {number}
       * b {number}
       */
      sortSize(a, b) {
        return b.SizeNum - a.SizeNum;
      },
      /**
       * 时间大小比较
       * a {number}
       * b {number}
       */
      sortDate(a, b) {
        return b.ctimeNum - a.ctimeNum;
      },
      /**
       * 排序
       */
      onFileSort(type) {
        switch (type) {
          case 1:       // 名称排序
            this.isSortName = !this.isSortName;
            this.FileList.reverse();
            break;
          case 2:       // 大小排序
            this.isSortSize = !this.isSortSize;
            this.isSortSize ? this.FileList.sort(this.sortSize) : this.FileList.reverse();
            break;
          case 3:       // 时间排序
            this.isSortDate = !this.isSortDate;
            this.isSortDate ? this.FileList.sort(this.sortDate) : this.FileList.reverse();
            break;
        }
      },
    },
    watch: {
      //监听相同路由下参数变化的时候，从而实现异步刷新
      '$route'(to, from) {
        //做一些路由变化的响应
        //重新获取数据
        if (this.$route.query.url && this.$route.query.ino) {
          this.ino = this.$route.query.ino || '';
          this.url = this.$route.query.url || '';
          this.NavUrl = this.url.split('/');
          this.getFile();
          return
        }
        this.NavUrl = [];
        this.url = '';
        this.ino = '';
        this.getData();
      },
      '$store.state.SearchValue.keyword': function (val) {
        this.FileList = this.util.fuzzyQuery(this.SearchList, val);
      },
      '$store.state.progress.complete': function (val) {
        if(val >= 100){
          this.isCatalogue = false;
          this.$store.state.progress.complete = 0;
          if (!this.ino) {
            this.getData();
          } else {
            this.getFile();
          }
        }
      },
    }
  }
</script>

<style scoped lang="stylus">
  @import "home.styl"
</style>
