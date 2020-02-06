<template>
  <div class="page" ref="page" :style="PassToke?'':'background:linear-gradient(#409eff,#72b7ff);'">
    <!--文件页面-->
    <div class="app-files" v-if="PassToke">
      <!--导航进步-->
      <div class="controls">
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
      </div>
      <!--标题-->
      <div class="head-title">
        <div class="list" style="flex: 1;">
          <el-checkbox v-model="checked" @change="onCheckAll"></el-checkbox>
        </div>
        <div class="list" style="flex: 7;">
          <span v-show="isColumntitle">{{columntitle}}</span>
          <span v-show="!isColumntitle">名称</span>
        </div>
        <div class="list" style="flex: 1;">
          <span v-show="isColumntitle" @click="onAllDownLoad">{{FileSize}}</span>
          <span v-show="!isColumntitle">大小</span>
        </div>
        <div class="list" style="flex: 2;">
          <span v-show="!isColumntitle">修改日期</span>
        </div>
      </div>
      <!--文件列表-->
      <div class="file-list" v-if="FileList.length != 0">
        <div class="list" v-for="(item,index) in FileList"
             @click.stop="onFiles(item,index)"
             :key="index">
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
          <a class="name" style="flex: 6;"
             :href="item.type===0?`${Global.host}${item.url}`:'javascript:;'"
             :download="item.name">
            <input type="text"
                   v-model="item.name"
                   disabled="true"
                   placeholder="请输入文件名称">
          </a>
          <div class="operation" style="flex: 1;" @click.stop="onStop">
            <el-popover placement="bottom"
                        width="100"
                        trigger="click">
              <div class="add-list">
                <div class="list" @click.stop="onDownLoad(item,index)">
                  <span class="iconfont icon-download"></span>
                  <span>下载</span>
                </div>
              </div>
              <span class="iconfont icon-more" slot="reference"></span>
            </el-popover>
          </div>
          <div class="size" style="flex: 1;">{{item.type===0?item.size:''}}</div>
          <div class="time" style="flex: 2;">{{item.ctime}}</div>
        </div>
      </div>
      <no-resources v-if="FileList.length === 0"></no-resources>
    </div>
    <password-check @PassTok="getPassTok" v-else></password-check>
    <!--照片查看-->
    <photo-banner :PhotoList="PhotoList" ref="photo"></photo-banner>
  </div>
</template>

<script>
  import {ShareFileList, CreateFolder, Uploading, DeleteFile, RenameFile, CompressedFiles} from '../../axios/api'
  import PasswordCheck from "../../components/PasswordCheck/PasswordCheck";
  import NoResources from "../../components/NoResources/NoResources";
  import PhotoBanner from "../../components/PhotoBanner/PhotoBanner";

  export default {
    name: "SharePage",
    components: {PhotoBanner, NoResources, PasswordCheck},
    data() {
      return {
        // 全选
        checked: false,
        FileList: [],
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
        // 鼠标移出 false 回车 true
        isFileNameWay: false,
        // 选择文件
        columntitle: '',
        isColumntitle: false,
        FileSize: 0,
        // 详细弹出层
        filesDrawer: false,
        FileInfo: {},
        DrawerSize: '40%',
        // 密码进入
        PassToke: '',
        privacy: '',
        ShareUrl: '',
        // 照片列表
        PhotoList: [],
      }
    },
    activated() {

    },
    mounted() {
      this.PassToke = sessionStorage.getItem('PassToke')||'';
      this.privacy = this.$route.query.privacy||'';
      this.ShareUrl = this.$route.query.ShareUrl||'';
      // 判断是否 私密链接
      if(this.privacy==2){
        this.PassToke = '2'
      }
      // 计算
      if(this.$refs['page'].clientWidth < 768){
        this.DrawerSize = '80%';
      }
      if (this.$route.query.ino) {
        this.ino = this.$route.query.ino || '';
        this.url = this.$route.query.url || '';
        this.NavUrl = this.url.split('/');
      }else {
        this.NavUrl = [];
        this.url = '';
        this.ino = '';
      }
      this.getData();
    },
    methods: {
      async getData() {
        await ShareFileList({
          ShareUrl: this.ShareUrl,
          PassToke: this.PassToke,
          privacy: this.privacy,
          ino: this.ino,
          url: this.url,
          status: 1,
        }).then(res => {
          if(res.status === -100){
            this.PassToke = '';
            sessionStorage.removeItem('PassToke');
            this.$message.error(res.message);
            return;
          }
          this.FileList = res.result;
        })
      },
      /**
       * 文件点击
       */
      onFiles(item, index) {
        this.ino = item.ino;
        this.url = item.url;
        let idx = 0;
        if (item.type === 1) {
          this.$router.push({name: 'SharePage', query: {ShareUrl: this.ShareUrl,privacy: this.privacy,ino: item.ino, url: item.url}});
        }
        if ('.png|.jpg|.gif|'.indexOf(item.name.split('.')[1] + '|') != -1) {
          this.PhotoList = [];
          for (let i = 0; i < this.FileList.length; i++) {
            if('.png|.jpg|.gif|'.indexOf(this.FileList[i].name.split('.')[1] + '|') != -1){
              idx++;
              this.FileList[i].index = idx;
              this.PhotoList.push(this.FileList[i]);
            }
          }
          this.$refs['photo'].show(item.index);
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
        }).then(res => {
          this.isCatalogue = false;
          this.getData();
        })
      },
      /**
       * 创建文件按键监听
       */
      onKeyupFolder(e) {
        if (e.keyCode === 13) {
          CreateFolder({
            url: this.url,
            ino: this.ino,
            fileName: this.fileName,
          }).then(res => {
            this.isCatalogue = false;
            this.getData();
            this.fileName = '新建文件夹';
          });
        }
      },
      /**
       * 文件详情
       */
      onFileDetails(item,index){
        this.FileInfo = item;
        this.filesDrawer = true;
      },
      /**
       * 下载点击
       */
      onDownLoad(item, index) {
        var link = document.createElement('a');
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
       * 文件删除
       */
      onDelFile(item, index) {
        DeleteFile({
          FilesArr: [{
            url: this.url,
            name: item.name,
            type: item.type,
          }]
        }).then(res => {
          this.getData();
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
          console.log('相等都为true');
        } else {
          this.checked = false;
          console.log('不相等');
        }
        // 判断是否全部为false
        if (sum == offChenk) {
          this.isColumntitle = false;
        }
        this.columntitle = `${filesSum}个文件夹${fileSum}个文件`;
        this.FileSize = this.util.renderSize(this.FileSize);
      },
      onStop() {
        console.log(22)
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
              url: this.url,
              name: this.FileList[i].name,
              type: this.FileList[i].type,
            })
          }
        }
        DeleteFile({
          FilesArr,
        }).then(res => {
          this.isColumntitle = false;
          this.getData();
        })
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
       * 获取密码token
       */
      getPassTok(val){
        this.PassToke = val;
        this.getData();
      }
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
        }else {
          this.NavUrl = [];
          this.url = '';
          this.ino = '';
        }
        this.getData();
      },
    }
  }
</script>

<style scoped lang="stylus">
  @import "SharePage.styl"
</style>
