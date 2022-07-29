<template>
  <transition name="el-zoom-in-top">
    <div v-show="reportDetailVisible">
      <div class="report-tree">
        <el-card>
          <div class="report-preview">
            <!--        预览-->
            <ReportPreview :reportInfo="reportInfo"></ReportPreview>
            <!--评分-->
            <div class="score-mode">
              <div class="current-score">
                <span>报告分数</span>
                <el-rate
                    v-model="currentScore"
                    disabled
                    show-score
                    text-color="#ff9900">
                </el-rate>
              </div>
              <div class="comment">
                <el-button type="primary" @click="handleComments(reportInfo.id)">撰写评论</el-button>
              </div>
              <div class="comment">
                <el-button type="primary" @click="handleFollowUp()">跟帖</el-button>
              </div>
            </div>
            <el-card class="box-card comment-card" shadow="never" style="margin-top: 15px">
              <div>
              <div class="comment-header">
                <span>我的评论</span>
                <div></div>
              </div>
              <div style="font-size: 10px;">
              <el-rate
                  v-model="reportComments.myScore"
                  disabled
                  text-color="#ff9900">
              </el-rate>
                {{reportComments.myTime}}
              </div>
              <div>
                {{this.reportComments.myComment}}
              </div>
              <el-divider></el-divider>
              </div>
              <div  class="comment-header">
                <el-badge :value="this.reportComments.nums" :max="99" class="item">
                  <span>所有评论</span>
                </el-badge>
              </div>
              <div></div>
              <div class="comment-list" v-for="(user,index) of reportComments.commentList">
                <div style="font-weight: bold;">{{user.uname}}</div>
                <div style="font-size: 10px;">
                <el-rate
                    v-model="user.userScore"
                    disabled
                    text-color="#ff9900">
                </el-rate>
                  {{user.commentTime}}
                </div>
                <div >{{user.comment}}</div>
                <el-divider></el-divider>
              </div>
            </el-card>
          </div>
        </el-card>
      </div>
    </div>
  </transition>
  <!--        写评论-->

  <el-dialog v-model="commentTableVisible" ref="commentTable" title="评论撰写" width="55%" destroydestroy-on-close
             :close-on-click-modal="false"
             center>
    <el-form :model="reportScore" :label-position='top' :rules="rules"  ref="reportScore"  label-width="100px" >
      <el-form-item  prop="score" >
        <div style="position: relative; left: 50%; transform: translateX(-50%); transform: translateX(-105px);">
          <div style="font-size: 18px" class="score">请为报告评分</div>
          <el-rate
              v-model="reportScore.score"
              :colors="colors">
          </el-rate>
        </div>
      </el-form-item>
    <el-divider></el-divider>
      <el-form-item prop="comment" label="具体评价" >
    <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 6}"
        placeholder="请简要指出该报告的缺陷以及改进方法"
        v-model="reportScore.comment">
    </el-input>
      </el-form-item>
    </el-form>
    <div style="margin: 20px;"></div>
    <template #footer>
      <el-button style="width: 100px" type="primary" @click="scoreReport()">提交评论</el-button>
    </template>
  </el-dialog>

  <!--  报告树-->
        <div v-if="this.isEmpty===true" class="empty">
          <el-card>
          <el-empty description="还没有用户提交报告哦！" image-size="180"></el-empty>
          </el-card>
        </div>
          <div v-else class="task-content">
          <el-card>
        <div class="report-preview">
        <el-tree :data="reportsData"
                 :expand-on-click-node="false"
                 default-expand-all
                 highlight-current
                 :props="defaultProps"
                 :render-content="renderContent"
                 node-key="rid">
        </el-tree>
        </div>
          </el-card>
        </div>

  <!--跟帖报告-->
  <el-dialog v-model="reportVisible" ref="reportFollowUp" title="任务报告" width="65%" destroydestroy-on-close
             :close-on-click-modal="false"
             center>
    <div class="report-dialog">
      <div class="current-report">
    <el-descriptions class="margin-top" title="任务内容" :column="4" direction="vertical">
      <el-descriptions-item label="">{{ taskInfo.brief }}</el-descriptions-item>
    </el-descriptions>
    <el-divider></el-divider>
    <div class="report_form">
      <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
        <el-form-item prop="title" label="标题" :rules="[{ required: true, message: '请输入标题信息', trigger: 'blur' },]">
          <el-input v-model="dynamicValidateForm.title"></el-input>
        </el-form-item>
        <el-form-item prop="device" label="设备信息" :rules="[{ required: true, message: '请输入设备信息', trigger: 'blur' },]">
          <el-select v-model="dynamicValidateForm.device" class="m-2" style="width: 100%">
            <el-option
                v-for="item in taskInfo.devices"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- bugList -->
        <el-form-item v-for="(bug, index) in dynamicValidateForm.bugList"
                      :label="'BUG' + (index+1)+':'"
                      :key="bug" prop="bugList"
                      :rules="[{ required: true, message: '请简要描述bug内容以及复现过程', trigger: 'blur' }]">
          <!--这里的index是第几个bug-->
          <el-col>
            <div class="bugPic">
              缺陷应用截图：
              <el-upload :action="uploadImgUrl" list-type="picture-card"
                         :before-remove="(pics, picsLists)=>handleRemove(pics, picsLists, index)"
                         :on-success="(response, pics, picsLists)=>handleSuccess(response, pics, picsLists, index)">
                <el-icon>
                  <Plus/>
                </el-icon>
              </el-upload>
            </div>
            <div class="bug-description">缺陷情况说明：
              <el-input v-model="bug.bug_detail"></el-input>
            </div>
            <div class="bug-description">缺陷复现步骤：
              <el-input v-model="bug.bug_trigger"></el-input>
            </div>
            <br>
            <el-button style="width: 100%;" type="primary" plain @click.prevent="removeBug(index)">删除</el-button>
          </el-col>
        </el-form-item>
        <el-form-item>
          <div class="task-button">
            <el-button style="width: 100%;" type="primary" @click="addBug">新增反馈</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <el-row></el-row>
    <el-row>
      <div class="task-button">
        <div class="button2">
          <el-button @click="hideSubmitDetails()">取消</el-button>
        </div>
        <div class="button1">
          <el-button type="primary" @click="submitFollowUp(reportInfo.id,true)">提交</el-button>
        </div>
      </div>
    </el-row>
      </div>
      <el-divider direction="vertical"></el-divider>
    <div class="report-list" v-show="hasSimilarReport===true">
      <span class="report-list-header">可协同报告列表</span>
      <!--        报告列表-->
      <div class="report-container" v-for="(report,index) in coopReportList">
        <el-card class="report-card">

          <div class="report-total">
            <div class="report-info">报告编号：{{ report.rid }}</div>
            <div class="report-info">报告名称：{{ report.title }}</div>
            <div class="report-info">相似度：
              <el-tag>{{ report.similarity }}</el-tag>
            </div>
            <div class="report-info">
              <el-button type="primary" style="float: right" @click="followUpConfirm(report.rid)">跟帖</el-button>
            </div>
          </div>

        </el-card>
      </div>
    </div>
    </div>
  </el-dialog>
</template>


<script>
import {FILETYPE, OPERATION, TASKSTATE, TASKTYPE, TASKLEVEL} from "@/utils/constant";
import {uploadImgUrl,deleteImg} from "@/api/file";
import {getMyReports, getReportByID, submitReport, getReportTree, scoreReport,getComments,commentReport} from "@/api/report";
import {ElMessage} from "element-plus";
import {ImgBaseUrl} from "@/api/file";
import {dateParse} from "@/utils/util";
import {getTask} from "@/api/task";
import ReportPreview from "@/components/ReportPreview";
import {getUser} from "@/api/user"


export default {
  name: "MyReports",
  components: {ReportPreview},
  data() {
    let validatePass=(rule,value,callback)=>{
      if(value===''&&this.reportScore.score<=2){
        callback(new Error('请说明打分理由'))
      }
      else callback();
    };
    return {
      coopReportList:[],
      reportsData: [],
      isEmpty:false,
      uploadImgUrl: uploadImgUrl,
      taskInfo: {},
      taskDetails: {},
      reportVisible: false,
      dynamicValidateForm: {
        bugList: [
          {
            bug_detail: "",
            bug_trigger: "",
            url: []
          }
        ],
        device: "",
        tid: 0,
        time: new Date(),
        title: "",
        wid: 0
      },
      currentScore:0,
      reportScore: {
        score: 0,
        comment: "",
      },
      reportComments:{
        nums:0,
        commentList:[],
        myScore:0,
        myTime:"",
        myComment:"",
      },
      rules: {
        score:[{required:true,message:'请为报告评分',trigger:'blur'}],
        comment:[{validator:validatePass,trigger:'blur'}]
      },
      taskId: this.$route.query.id,
      imgBaseUrl: ImgBaseUrl,
      reportInfo: {},
      commentTableVisible: false,
      reportList: [],
      reportDetailVisible: false,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      defaultProps: {
        children: 'children',
        label: 'title',
      },
      hasSimilarReport:false,
      uuid: "",
    }
  },
  mounted() {
    this.initReports();
  },
  methods: {
    initReports() {
      this.getReportTree();
    },

    handleComments() {
      this.commentTableVisible = true;
      this.reportScore={
        score: 0,
        comment: ""
      }
    },

    getReportTree() {
      this.reportsData = [];
      let tid = new FormData();
      tid.append("tid", this.taskId);
      getReportTree(tid).then(res => {
        if (res.code === 1) {
          if(res.data.children.length===0)this.isEmpty=true;
          this.reportsData.push({title: '所有报告', children: res.data.children})
        }
      })
    },

    scoreReport() {
      this.$refs.reportScore.validate((valid,obj)=>{
        if(valid){
          let payload = new FormData();
          payload.append('comment', this.reportScore.comment)
          payload.append('rid', this.reportInfo.id)
          payload.append('score', this.reportScore.score)
          scoreReport(payload).then(res => {
            if (res.code === 1) {
              ElMessage.success("评论成功！")
              this.commentTableVisible=false;
              this.reportScore= {
                score: 0,
                comment: "",
              }
            }
          })
          location.reload();
        }
      })
    },

    getReports() {
      let tid = new FormData();
      tid.append("tid", this.taskId);
      getMyReports(tid).then(res => {
        if (res.code === 1) {
          this.reportList = res.data;
          this.reportList.map(report => {
            report.time = dateParse(report.time);
          })
        } else {
          ElMessage.error("获取报告列表失败");
        }
      })
    },

    //取得报告数据并加载给预览界面
    getReportByID(id,score) {
      this.getTask();
      let reportId = id;
      let payload = new FormData();
      payload.append("rid", reportId);
      getReportByID(payload).then(res => {
        if (res.code === 1) {
          this.reportInfo = JSON.parse(JSON.stringify(res.data));
          this.reportInfo.time = dateParse(this.reportInfo.time);
          for (let i = 0; i < this.reportInfo.bugList.length; i++) {
            this.reportInfo.bugList[i].url = JSON.parse(this.reportInfo.bugList[i].url).map((url) => {
              return ImgBaseUrl + '/' + url
            });
          }
        } else {
          ElMessage.error("获取报告失败！");
        }
      })
      this.currentScore=score.toFixed(1);
      this.getReportComments(reportId);
      this.reportDetailVisible = true;
    },

    getReportComments(reportId){
      this.reportComments={
            nums:0,
            commentList:[],
            myScore:0,
            myTime:"",
            myComment:"",
      };
      let rid=new FormData();
      rid.append('rid',reportId);
      let info = this.$storage.getItem("userInfo");
      getComments(rid).then(res=>{
        console.log(res.data)
        if(res.code===1){
          this.reportComments.myScore=res.data.user_score[info.id];
          this.reportComments.nums=res.data.count;
          for(let user in res.data.comments){
            let temp=res.data.comments[user];
            temp.commentTime=temp.timeStamp.slice(0,4)+'年'+temp.timeStamp.slice(5,7)+'月'+temp.timeStamp.slice(8,10)+'日'
            for(let userscore in res.data.user_score){
              if(userscore==user){
                temp.userScore=res.data.user_score[userscore]
              }
            }
            this.reportComments.commentList.push(temp);
          }
        }
        //我的评论
        for(let User in res.data.comments){
          if(User==info.id) {
            let obj=res.data.comments[info.id];
            this.reportComments.myComment=obj.comment;
            this.reportComments.myTime=obj.timeStamp.slice(0,4)+'年'+obj.timeStamp.slice(5,7)+'月'+obj.timeStamp.slice(8,10)+'日'
          }
        }
        console.log(this.reportComments.commentList)
      })
    },
    getTask() {
      this.taskInfo = {};
      getTask(this.taskId).then(res => {
        this.taskInfo = res;
      })
    },

    renderContent(h, {node, data, store}) {
      let flag = node.label === '所有报告'
      if (flag) {
        return (
            h('span',
                {
                  class: "custom-tree-node"
                },
                h('span', null, node.label)
            )
        )
      } else {
        return h(
            'span',
            {
              class: 'custom-tree-node',
            },
            h('span', {class:'title-restrain'}, node.label),
            h('span',
                null,
                h('button',
                    {
                      //style:{float:"right"},
                      class: "el-button el-button--text tree-button",
                      onClick: () => {
                        this.getReportByID(data.rid,data.score);
                      },
                    },
                    "查看报告"
                )
            )
        )
      }
    },

    handleFollowUp() {
      this.hasSimilarReport = false;
      this.reportVisible = true;
      this.dynamicValidateForm.bugList = [{
        "bug_detail": "",
        "bug_trigger": "",
        "url": []
      }];
      this.uuid = JSON.stringify(this.taskDetails.id + this.$storage.getItem("userInfo").id + Date.now());
    },
    handleRemove(pics, picsLists, index) {

      let idx = picsLists.indexOf(pics);//idx是第几个图片，每个bug都有一个自己的picsLists
      let payload = {
        filename: this.dynamicValidateForm.bugList[index].url[idx]
      }
      deleteImg(payload).then(res => {
            if (res.code === 1) {
              ElMessage.success("删除成功！")
              this.dynamicValidateForm.bugList[index].url.splice(idx, 1)
            } else {
              ElMessage.error("删除失败！")
            }
          }
      )
    },
    handleSuccess(response, pics, picsLists, index) {
      this.dynamicValidateForm.bugList[index].url.push(response.data.filename);
    },
    removeBug(index) {
      if (this.dynamicValidateForm.bugList.length === 1) {
        ElMessage.warning("请至少填写一个BUG")
      } else {
        this.dynamicValidateForm.bugList.splice(index, 1)
      }
    },
    addBug() {
      this.dynamicValidateForm.bugList.push({
        "bug_detail": "",
        "bug_trigger": "",
        "url": []
      });
    },
    hideSubmitDetails() {
      this.$refs.dynamicValidateForm.resetFields();
      this.dynamicValidateForm.bugList = [{
        "bug_detail": "",
        "bug_trigger": "",
        "url": []
      }];
      this.reportVisible = false;
    },

    submitFollowUp(reportID,changed) {
      this.$refs.dynamicValidateForm.validate((valid,obj)=>{
        let showSimilarityList = this.hasSimilarReport;
        if(valid){
          let uuid = this.uuid;
          let tid = this.taskId;
          let payload = {
            hasChanged: changed,
            rid: reportID,
            uuid: uuid,
          }
          let reportVO = JSON.parse(JSON.stringify(this.dynamicValidateForm));
          for (let i = 0; i < reportVO.bugList.length; i++) {
            reportVO.bugList[i].url = JSON.stringify(reportVO.bugList[i].url);
          }
          if(showSimilarityList===true){
            this.$confirm('您的报告内容与他人有较多重复，是否坚持跟帖当前报告？', '警告', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              payload.hasChanged = false;
              this.submit(payload, reportVO, tid);
              this.hasSimilarReport = false;
            }).catch(() => {
              this.hasSimilarReport = false;
              this.uuid = JSON.stringify(this.taskDetails.id + this.$storage.getItem("userInfo").id + Date.now());
            });
          }else {
            this.submit(payload, reportVO, tid);
          }
        }
      })

    },
    submit(payload, reportVO, tid) {
      console.log(payload.rid)
      submitReport(payload, reportVO, tid).then(res => {
        console.log(res)
        if (res.code === 1) {
          ElMessage.success("提交成功");
          this.reportVisible = false;
          this.$refs.dynamicValidateForm.resetFields();
          this.dynamicValidateForm.bugList = [{
            "bug_detail": "",
            "bug_trigger": "",
            "url": []
          }];
          // 日志-提交报告
          let taskTagVO = {
            tid: this.taskDetails.id,
            categoryList: this.taskDetails.categories,
            devices: this.taskDetails.devices,
            taskLevel: this.taskDetails.taskLevel,
            taskType: this.taskDetails.taskTypeValue
          };
          sendLog(OPERATION.submit, taskTagVO, reportVO.device);
          this.hasSimilarReport = false;
        } else {
          ElMessage.warning("存在相似度过高的报告，请重新修改或与其协作");
          this.coopReportList = res.data.list;
          this.hasSimilarReport = true;
        }
      })
    },
    followUpConfirm(rid) {
      this.$confirm('您的报告将以跟帖的形式与该报告进行协同测试，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submitFollowUp(rid,false)
        this.$message({
          type: 'success',
          message: '跟帖成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消跟帖'
        });
      });
    },
  }
}
</script>

<style scoped>
.comment-header{
  font-weight: bold;
  font-size: 19px;
  margin-bottom: 10px;
}
.current-report{
  flex:1;
}
.report-list{
  width: 100%;
  flex:1;
}
.report-dialog{
  display: flex;
}

.comment-card{
  overflow: auto;
  max-height: 500px;
  background-color:#F2F6FC;
}

.score-mode {
  display: flex;
}

.current-score {
  flex: 4;
  margin-left: 4px;

}
.comment {
  flex: 1;
  float: right;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  float: right;
}

.comment-table {
  display: flex;
  text-align: center;
}

.report-tree {

  width: 49%;
  float: right;
}

.report-preview {
  width:100%;
  overflow: auto;
  height: calc(100vh - 130px);
}

.task-content {
  width: 49%;
  float: left;
}

.task-card {
  box-shadow: none !important;
}

.task-card:hover {
  background-color: #F2F6FC;
}

.empty {
  width: 100%;
}

.report-info-item {
  display: flex;
  align-items: center;
  height: 100%
}

.button1 {
  flex: 1;
}

.button2 {
  float: right;
  flex: 1;
}

.task-button {
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
}

</style>
<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.title-restrain{
  width: calc(40vw - 120px);
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>