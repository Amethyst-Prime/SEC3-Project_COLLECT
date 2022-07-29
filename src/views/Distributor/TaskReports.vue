<template>
  <transition name="el-zoom-in-top">
    <div v-show="reportDetailVisible">
      <div class="report-tree">
        <el-card>
          <div class="report-preview">
            <!--        预览-->
            <ReportPreview :reportInfo="reportInfo"></ReportPreview>
            <!--评分-->
            <div v-show="isScoreVisible">
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
              </div>
              <el-card class="box-card comment-card" shadow="never" style="margin-top: 15px">
                <div class="comment-header">
                  <el-badge :value="this.reportComments.nums" :max="99" class="item">
                    <span>所有评论</span>
                  </el-badge>
                </div>
                <div></div>
                <div class="comment-list" v-for="(user,index) of reportComments.commentList">
                  <div style="font-weight: bold">{{ user.uname }}</div>
                  <div style="font-size: 10px;">
                    <el-rate
                        v-model="user.userScore"
                        disabled
                        text-color="#ff9900">
                    </el-rate>
                    {{ user.commentTime }}
                  </div>
                  <div>{{ user.comment }}</div>
                  <el-divider></el-divider>
                </div>
              </el-card>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </transition>
  <!--  报告树 -->
  <div class="task-content">
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="报告树列表" name="tree-text">
          <div v-if="this.isEmpty===true" class="empty">
            <el-empty description="还没有用户提交报告哦！" image-size="180"></el-empty>
          </div>
          <div v-else class="tree-preview">
            <el-tree :data="reportsData"
                     :expand-on-click-node="false"
                     default-expand-all
                     highlight-current
                     :props="defaultProps"
                     :render-content="renderContent"
                     node-key="rid">
            </el-tree>
          </div>
        </el-tab-pane>
        <el-tab-pane label="报告树可视化" name="tree-graph">
          <div v-if="this.isEmpty===true" class="empty">
            <el-empty description="还没有用户提交报告哦！" image-size="180"></el-empty>
          </div>
          <div v-else class="tree-preview">
            <Tree ref="treeImg" :tree-data="treeData" @getReport="getReport"></Tree>
          </div>
        </el-tab-pane>
        <el-tab-pane label="相似度可视化" name="report-similarity">
          <div v-if="this.isEmpty===true" class="empty">
            <el-empty description="还没有用户提交报告哦！" image-size="180"></el-empty>
          </div>
          <div v-else class="tree-preview">
            <Similarity ref="similarityImg" :similarity-data="similarityData" @getReport="getReport"></Similarity>
          </div>
        </el-tab-pane>
        <el-tab-pane label="报告融合" name="report-fusion">
          <div v-if="this.isEmpty===true" class="empty">
            <el-empty description="还没有用户提交报告哦！" image-size="180"></el-empty>
          </div>
          <div v-else>
            <div v-if="this.isFusion===false && this.isLoading===false" class="empty">
              <el-empty description="尚未生成融合报告" image-size="180"></el-empty>
              <el-button type="primary" v-loading="buttonLoadingVisible" v-if="isLoading===false" plain class="step-bar"
                         @click="initReportFusion()">生成融合报告
              </el-button>
            </div>

            <div v-else class="tree-preview">
              <div v-for="(report,index) in fusionReportList">
                <div class="fusion-report">
                  {{ report.title }}
                  <el-button type="text" class="fusionButton" @click="getFusionReportByID(report.id)">查看报告</el-button>
                </div>
              </div>
              <el-button type="primary" v-loading="buttonLoadingVisible" v-if="isLoading===false" plain class="step-bar"
                         @click="initReportFusion()">生成融合报告
              </el-button>
              <div class="step-bar" v-show="isLoading" name="el-fade-in-linear">
                <el-steps :active="this.currentStep" finish-status="success">
                  <el-step title="等待合并"></el-step>
                  <el-step title="计算相似度"></el-step>
                  <el-step title="聚类"></el-step>
                  <el-step title="有效性检查"></el-step>
                  <el-step title="选择主报告"></el-step>
                  <el-step title="合并报告"></el-step>
                </el-steps>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import {getReports, getSimilarity, getReportTree, getReportByID, getComments} from "@/api/report";
import {ElMessage} from "element-plus";
import {dateParse} from "@/utils/util";
import {getTask, getMergedTasks, mergeReport} from "@/api/task";
import {ImgBaseUrl} from "@/api/file";
import Tree from "@/components/Tree";
import ReportPreview from "@/components/ReportPreview";
import Similarity from "@/components/Similarity";
import {MERGESTATE} from "@/utils/constant";


export default {
  name: "TaskReports",
  components: {Tree, ReportPreview, Similarity},
  data() {
    return {
      time: "",
      similarityData: {},
      currentStep: 0,
      treeData: {
        rid: "0",
        title: "所有报告",
        children: [],
      },
      fusionReportList: [],
      isEmpty: false,
      isFusion: false,
      isLoading: false,
      reportsData: [],
      taskInfo: {},
      taskDetails: {},
      reportInfo: {},
      activeName: 'tree-text',
      commentTableVisible: false,
      buttonLoadingVisible: false,
      reportDetailVisible: false,
      isScoreVisible: false,
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
      reportScore: {
        score: 0,
        commentText: "",
      },
      reportComments: {
        nums: 0,
        commentList: [],
        myScore: 0,
        myTime: "",
        myComment: "",
      },
      currentScore: 0,
      defaultProps: {
        children: 'children',
        label: 'title',

      },
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      taskId: this.$route.query.id,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      reportList: [],
    }
  },
  mounted() {
    this.initReportList();
    this.getReportSimilarity();
    this.getTask()
    this.taskInfo = {};
  },
  methods: {
    initReportList() {
      this.getReportTree();
    },
    getTask() {
      this.taskInfo = {};
      return getTask(this.taskId).then(res => {
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
            h('span', {class: 'title-restrain'}, node.label),
            h('span',
                null,
                h('button',
                    {
                      //style:{float:"right"},
                      class: "el-button el-button--text tree-button",
                      onClick: () => {
                        this.isScoreVisible = true;
                        this.getReportByID(data.rid, data.score);
                      },
                    },
                    "查看报告"
                )
            )
        )
      }
    },
    getReport(rid, score = -1) {
      let rightScore = score;
      if (score === -1) {
        let payload = new FormData();
        payload.append("rid", rid);
        getComments(payload).then(res => {
          if (res.code === 1) {
            rightScore = res.data.score;
          }
        })
      }
      this.getReportByID(rid, rightScore);
    },

    getFusionReportByID(id) {
      this.getReportByID(id, 0);
    },

    getReportByID(id, score) {
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
      this.currentScore = score.toFixed(1);
      this.getReportComments(reportId);
      this.reportDetailVisible = true;
    },

    getReportTree() {
      this.reportsData = [];
      let tid = new FormData();
      tid.append("tid", this.taskId);
      getReportTree(tid).then(res => {
        if (res.code === 1) {
          if (res.data.children.length === 0) this.isEmpty = true;
          this.reportsData.push({title: '所有报告', children: res.data.children})

          this.treeData.children = res.data.children;

        }
      })
    },
    getReportSimilarity() {
      let tid = new FormData();
      tid.append("tid", this.taskId);
      getSimilarity(tid).then(res => {
        if (res.code === 1) {
          console.log(res.data);
          this.similarityData = res.data;
          console.log(this.similarityData)
        }
      })
    },
    getReportList(page) {
      let payload = new FormData();
      payload.append("page", page - 1);
      payload.append("size", this.pageSize);
      payload.append("tid", this.taskId);
      getReports(payload).then(res => {
        if (res.code === 1) {
          // console.log(res.data);
          if (res.data !== null) {
            for (let i = 0; i < res.data.content.length; i++) {
              let temp = res.data.content[i];
              temp.time = dateParse(temp.time);
              for (let j = 0; j < temp.bugList.length; j++) {
                temp.bugList[j].url = JSON.parse(temp.bugList[j].url);
              }
              this.reportList.push(temp);
            }
          }
        } else {
          ElMessage.error("获取报告失败！");
        }
      })
    },
    getReportComments(reportId) {
      this.reportComments.commentList = [];
      let rid = new FormData();
      rid.append('rid', reportId);
      let info = this.$storage.getItem("userInfo");
      getComments(rid).then(res => {
        console.log(res.data)
        if (res.code === 1) {
          this.reportComments.myScore = res.data.user_score[info.id];
          this.reportComments.nums = res.data.count;
          for (let user in res.data.comments) {
            let temp = res.data.comments[user];
            temp.commentTime = temp.timeStamp.slice(0, 4) + '年' + temp.timeStamp.slice(5, 7) + '月' + temp.timeStamp.slice(8, 10) + '日'
            for (let userscore in res.data.user_score) {
              if (userscore === user) {
                temp.userScore = res.data.user_score[userscore]
              }
            }
            this.reportComments.commentList.push(temp);
          }
        }
        for (let User in res.data.comments) {
          if (User === info.id) {
            let obj = res.data.comments[info.id];
            this.reportComments.myComment = obj.comment;
            this.reportComments.myTime = obj.timeStamp.slice(0, 4) + '年' + obj.timeStamp.slice(5, 7) + '月' + obj.timeStamp.slice(8, 10) + '日'
          }
        }
        console.log(this.reportComments.commentList)
      })
    },
    changePage(val) {
      this.currentPage = val;
      this.getReportList(val);
    },
//开始融合报告并返回加载结果
    initReportFusion() {
      this.currentStep = 0;
      let tid = new FormData();
      tid.append('tid', this.taskId);
      mergeReport(tid).then(res => {
        console.log(res)
        if (res.code === 1) {
          this.$message('正在融合报告');
          this.buttonLoadingVisible = true;
          this.timer = setInterval(this.refreshMergeState, 10000)
        } else {
          this.$message.error('正在运行报告融合，不要重复点击按钮');
        }
      })
    },

    refreshMergeState() {
      console.log("running")
      this.getTask().then(() => {
        switch (this.taskInfo.mergeState) {
          case MERGESTATE.PENDING: {
            console.log("Pending");
            this.isLoading = true;
            this.currentStep = 0;
            break;
          }
          case MERGESTATE.SIMILARITY: {
            console.log("Similarity");
            this.isLoading = true;
            this.currentStep = 1;
            break;
          }
          case MERGESTATE.CLUSTER: {
            console.log("Cluster");
            this.isLoading = true;
            this.currentStep = 2;
            break;
          }
          case MERGESTATE.FLUENCY: {
            console.log("Fluency");
            this.isLoading = true;
            this.currentStep = 3;
            break;
          }
          case MERGESTATE.CHOOSEMAIN: {
            console.log("ChooseMain");
            this.isLoading = true;
            this.currentStep = 4;
            break;
          }
          case MERGESTATE.MERGE: {
            console.log("Merge");
            this.isLoading = true;
            this.currentStep = 5;
            break;
          }
          case MERGESTATE.IDLE: {
            console.log("Idle");
            this.isLoading = false;
            this.currentStep = 0;
            clearInterval(this.timer);
            console.log("this timer has stopped");
            this.getMergedReports();//重新获取融合报告列表
            break;
          }//空闲状态就停止计时器
          default: {
            this.isLoading = false;
            clearInterval(this.timer);
            console.log("default case, timer stopped");
            break;
          }//未知状态
        }
      })
    },

    //获取融合报告列表
    getMergedReports() {
      this.buttonLoadingVisible = true;
      this.getTask().then(() => {
        switch (this.taskInfo.mergeState) {
          case MERGESTATE.PENDING: {
            console.log("Pending");
            this.isLoading = true;
            this.currentStep = 0;
            break;
          }
          case MERGESTATE.SIMILARITY: {
            console.log("Similarity");
            this.isLoading = true;
            this.currentStep = 1;
            break;
          }
          case MERGESTATE.CLUSTER: {
            console.log("Cluster");
            this.isLoading = true;
            this.currentStep = 2;
            break;
          }
          case MERGESTATE.FLUENCY: {
            console.log("Fluency");
            this.isLoading = true;
            this.currentStep = 3;
            break;
          }
          case MERGESTATE.CHOOSEMAIN: {
            console.log("ChooseMain");
            this.isLoading = true;
            this.currentStep = 4;
            break;
          }
          case MERGESTATE.MERGE: {
            console.log("Merge");
            this.isLoading = true;
            this.currentStep = 5;
            break;
          }
          case MERGESTATE.IDLE: {
            console.log("Idle");
            this.isLoading = false;
            this.currentStep = 0;
            console.log("first stop");
            break;
          }//空闲状态就停止计时器
          default: {
            this.isLoading = false;
            console.log("default case, timer stopped");
            break;
          }//未知状态
        }
        console.log(this.taskInfo.mergeState)
        if (this.taskInfo.mergeState != null && this.taskInfo.mergeState != MERGESTATE.IDLE) {
          this.isLoading = true;
          this.buttonLoadingVisible = true;
          this.timer = setInterval(this.refreshMergeState, 10000)
        } else {
          this.isLoading = false;
          this.buttonLoadingVisible = false;
        }
      });//更新状态
      this.fusionReportList = [];
      this.isScoreVisible = false;
      let tid = new FormData();
      tid.append("tid", this.taskId)
      getMergedTasks(tid).then(res => {
        if (res.code === 1) {
          if (res.data.list.length === 0) this.isFusion = false;
          else {
            this.isFusion = true;
            for (let i = 0; i < res.data.list.length; i++) {
              this.fusionReportList.push(res.data.list[i])
            }
          }
          console.log(this.fusionReportList)
        }
      })
    },


    handleClick(tab, event) {
      this.reportDetailVisible = false;
      if (parseInt(tab.index) === 0) {
        clearInterval(this.timer);//离开报告融合界面则关闭计时器
      } else if (parseInt(tab.index) === 1) {
        clearInterval(this.timer);//离开报告融合界面则关闭计时器
        this.$nextTick(() => {
          this.$refs.treeImg.initTree()
        })
      } else if (parseInt(tab.index) === 2) {
        clearInterval(this.timer);//离开报告融合界面则关闭计时器
        this.$nextTick(() => {
          this.$refs.similarityImg.initImg();
        })
      } else if (parseInt(tab.index) === 3) {
        this.$nextTick(() => {
          this.getMergedReports()
        })
      }
    },
  }
}
</script>

<style scoped>
.task-header {
  margin-bottom: 20px;
}

.fusion-report {
  font-size: 16px;
  overflow: hidden;
}

.fusionButton {
  margin-right: 10px;
  color: #409EFF;
  font-size: 14px;
  float: right
}

.step-bar {
  width: 100%;
  height: 40px;
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translate(-50%, -50%);
}

.report-preview {
  width: 100%;
  overflow: auto;
  height: calc(100vh - 135px);
}

.tree-preview {
  width: 100%;
  overflow: auto;
  height: calc(100vh - 190px);
}

.report-tree {

  width: 49%;
  float: right;
}

.task-content {
  width: 49%;
  float: left;
}

.task-content {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

}

.comment-card {
  overflow: auto;
  max-height: 500px;
  background-color: #F2F6FC;
}

.comment-header {
  font-weight: bold;
  font-size: 19px;
  margin-bottom: 10px;
}

.report-tree {

  width: 49%;
  float: right;
}

.task-card {
  box-shadow: none !important;
}

.task-card:hover {
  background-color: #F2F6FC;
}

.empty {
  width: 100%;
  overflow: auto;
  height: calc(100vh - 190px);
}

.report-info-item {
  display: flex;
  align-items: center;
  height: 100%
}

</style>
<style>
.title-restrain {
  width: calc(40vw - 120px);
  overflow: hidden;
  text-overflow: ellipsis;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>