<template>
  <div class="file-details">
    <!--文件信息-->
    <div class="file-info" v-if="FileInfo.url">
      <div class="thmub">
        <img :src="`${Global.host}${FileInfo.url}`"
             v-if="'.png|.jpg|.gif|'.indexOf(FileInfo.name.split('.')[1]+'|')!=-1">
        <span class="iconfont base-color icon-word"
              v-else-if="'.doc|.docx|'.indexOf(FileInfo.name.split('.')[1]+'|')!=-1">

            </span>
        <span class="iconfont base-color icon-yasuo"
              v-else-if="'.tar|.zip|.rar|.7z|'.indexOf(FileInfo.name.split('.')[1]+'|')!=-1">

            </span>
        <span class="iconfont base-color icon-music"
              v-else-if="'.mp3|.3gs|.flac|'.indexOf(FileInfo.name.split('.')[1]+'|')!=-1">

            </span>
        <span class="iconfont base-color icon-pdf"
              v-else-if="'.pdf|'.indexOf(FileInfo.name.split('.')[1]+'|')!=-1">

            </span>
        <span class="iconfont base-color"
              :class="FileInfo.type===0?'icon-file':'icon-folder'"
              v-else>
            </span>
      </div>
      <div class="item">
        <div class="title">
          <span class="one-omit">{{FileInfo.name}}</span>
        </div>
        <div class="date-num">
          <span class="iconfont icon-star icon"
                @click="onCollectFile"
                :style="FileInfo.isCollect===1?'display: inline-block;color: #409eff;':''"></span>
          <span>{{FileInfo.size}}</span>
          <span>{{FileInfo.ctime}}</span>
        </div>
      </div>
    </div>
    <!--文件操作-->
    <div class="file-operation">
      <div class="operation-tab">
        <el-tabs v-model="operationActive">
          <el-tab-pane label="分享" name="second">
            <el-tabs type="card" v-model="sharActive">
              <el-tab-pane label="公开分享" name="pubilc">
                <div class="link" v-if="FileInfo.ShareId">
                  <div class="ti">链接生成成功快去分享给朋友吧</div>
                  <el-link type="primary" :href="`#/SharePage?ShareUrl=${FileInfo.ShareUrl}`"
                           target="_blank">{{Global.href}}/#/SharePage?ShareUrl={{FileInfo.ShareUrl}}
                  </el-link>
                </div>
                <div class="pass" v-if="FileInfo.password">
                  <span>密码:</span>
                  <span>
                    <input :type="FileInfo.isPassword?'text':'password'" disabled :value="FileInfo.password">
                    <i class="el-icon-view el-input__icon" slot="suffix" @click="onLookPassword"></i>
                  </span>
                </div>
                <div class="block" v-if="!FileInfo.ShareId">
                  <span class="demonstration">设置密码:</span>
                  <el-input placeholder="请输入密码" v-model="sharPassword" class="shar-password" show-password></el-input>
                </div>
                <div class="block" v-if="FileInfo.ShareId">
                  <span class="demonstration">失效日期：{{FileInfo.EndTime}}</span>
                </div>
                <div class="block" v-if="!FileInfo.ShareId">
                  <span class="demonstration">选择失效日期:</span>
                  <el-date-picker
                          v-model="ExpiryDate"
                          @change="ExpiryChange"
                          type="date"
                          :picker-options="pickerOptions"
                          placeholder="选择日期">
                  </el-date-picker>
                </div>
                <div class="create-btn">
                  <el-button type="primary" @click.stop="onCreateLink(1)"
                             :loading="isCreateFile"
                             v-if="!FileInfo.ShareId">{{isCreateFile?'生成中':'生成链接'}}
                  </el-button>
                  <el-button type="primary" @click.stop="onCreateLink(2)"
                             v-if="FileInfo.ShareId">取消分享
                  </el-button>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import {GenerateShare, CancelShareFile,CollectFile} from '../../axios/api'

  export default {
    name: "FileDetails",
    data() {
      return {
        // 详细弹出层
        filesDrawer: false,
        operationActive: 'second',
        sharActive: 'pubilc',
        sharPassword: '',
        isCreateFile: false,
        DrawerSize: '40%',
        ExpiryDate: '',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 1.64e7
          }
        }
      }
    },
    props: {
      FileInfo: {
        type: Object,
      }
    },
    mounted() {
      this.FileInfo.isPassword = false;
    },
    methods: {
      /**
       * 失效列表触发
       */
      ExpiryChange(val) {
        this.FileInfo.EndTime = new Date(val).getTime() / 1000;
      },
      /**
       * 生成链接点击
       */
      onCreateLink(type) {
        if (!this.FileInfo.EndTime || this.FileInfo.EndTime == 'Invalid Date') {
          this.$message.error('请选择失效时间');
          return;
        }
        // 判断是否是生成  1 生成 2 取消
        if (type === 1) {
          this.isCreateFile = true;
          GenerateShare({
            url: this.FileInfo.url,
            ino: this.FileInfo.ino,
            name: this.FileInfo.name,
            type: this.FileInfo.type,
            EndTime: this.FileInfo.EndTime,
            password: this.sharPassword,
            isPrivacy: this.sharPassword ? 1 : 2,
          }).then(res => {
            this.FileInfo.ShareUrl = `${res.result.ShareUrl}&privacy=${this.sharPassword ? 1 : 2}`;
            this.FileInfo.ShareId = res.result.ShareId;
            this.FileInfo.password = res.result.password;
            this.FileInfo.isPassword = false;
            this.FileInfo.EndTime = new Date(this.FileInfo.EndTime * 1000).toLocaleString();
            this.isCreateFile = false;
          })
        } else if (type === 2) {
          CancelShareFile({
            ShareId: this.FileInfo.ShareId,
          }).then(res => {
            this.FileInfo.ShareUrl = '';
            this.FileInfo.EndTime = 0;
            this.FileInfo.ShareId = '';
            this.$message.success(res.message);
            this.$forceUpdate();
          })
        }
      },
      /**
       * 查看密码
       */
      onLookPassword(){
        this.FileInfo.isPassword = !this.FileInfo.isPassword;
        this.$forceUpdate();
      },
      /**
       * 收藏文件
       */
      onCollectFile(item,index){
        CollectFile({
          url: this.FileInfo.url,
          ino: this.FileInfo.ino,
          fileName: this.FileInfo.name,
          type: this.FileInfo.type,
          status: this.FileInfo.isCollect === 1 ? 2 : 1,         // 1 是 2 否
        }).then(res =>{
          if (!this.ino) {
            this.getData();
          } else {
            this.getFile();
          }
          this.$message.success(res.message);
        })
      },
    },
  }
</script>

<style scoped lang="stylus">
  @import "FileDetails.styl"
</style>
