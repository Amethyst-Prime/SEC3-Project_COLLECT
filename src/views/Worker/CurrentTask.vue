<template>
  <div>
    <el-card>
      <div v-if="taskList.length===0" class="empty">
        <el-empty description="你还没有正在执行的任务" image-size="180"></el-empty>
      </div>
      <div v-else class="task-container" v-for="(item, index) in taskList">
        <el-card class="task-card">
          <div @click="handleTaskDetails(index)">
            <task-item :item="item"></task-item>
          </div>

          <div class="task-foot">
            <div class="icon-btn" @click="showMyReport(index)">
              <el-tooltip class="box-item" effect="dark" content="所有报告" placement="bottom">
                <img class="icon" :src="icon.list" alt="所有报告"/>
              </el-tooltip>
            </div>
            <div class="icon-btn" @click="handleReportDetail(index)">
              <el-tooltip class="box-item" effect="dark" content="填写报告" placement="bottom">
                <img class="icon" :src="icon.report" alt="填写报告"/>
              </el-tooltip>
            </div>
            <div class="icon-btn" @click="downloadApp(index, fileType.EXECUTABLE)">
              <el-tooltip class="box-item" effect="dark" content="下载待测应用" placement="bottom">
                <img class="icon" :src="icon.app" alt="下载待测应用"/>
              </el-tooltip>
            </div>
            <div class="icon-btn" @click="downloadApp(index, fileType.DESCRIPTION)">
              <el-tooltip class="box-item" effect="dark" content="下载测试文档" placement="bottom">
                <img class="icon" :src="icon.download" alt="下载测试文档"/>
              </el-tooltip>
            </div>
          </div>
        </el-card>
      </div>

      <el-pagination background hide-on-single-page layout="prev, pager, next, ->, total"
                     @current-change="changePage" :page-size="pageSize" :total="total">
      </el-pagination>
    </el-card>
  </div>

  <el-dialog v-model="taskDetailsVisible" title="任务详情" width="55%" destroy-on-close :close-on-click-modal="false"
             center>
    <task-details :task-details="taskDetails" :show-file="true"></task-details>

  </el-dialog>

  <!--任务报告-->
  <el-dialog v-model="reportVisible" title="任务报告" width="65%" destroydestroy-on-close
             :close-on-click-modal="false"
             center>
    <div class="report-dialog">
      <div class="current-report">
        <el-descriptions class="margin-top" title="任务内容" :column="4" direction="vertical">
          <el-descriptions-item label="">{{ taskDetails.brief }}</el-descriptions-item>
        </el-descriptions>
        <el-divider></el-divider>
        <div class="report_form">
          <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
            <el-form-item prop="title" label="标题" :rules="[{ required: true, message: '请输入标题信息', trigger: 'blur' },]">
              <el-input v-model="dynamicValidateForm.title"></el-input>
            </el-form-item>
            <el-form-item prop="device" label="设备信息"
                          :rules="[{ required: true, message: '请输入设备信息', trigger: 'blur' },]">

              <el-select v-model="dynamicValidateForm.device" class="m-2" style="width: 100%">
                <el-option
                    v-for="item in taskDetails.devices"
                    :key="item"
                    :label="item"
                    :value="item"
                >
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
              <el-button @click="hideReportDetails()">取消</el-button>
            </div>
            <div class="button1">
              <el-button type="primary" @click="handleSubmit(-1)">提交</el-button>
            </div>
          </div>
        </el-row>
      </div>
      <el-divider direction="vertical"></el-divider>
      <!--      左右均分-->
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
import {uploadImgUrl, appDownload} from "@/api/file";
import {dateParse} from "@/utils/util";
import {FILETYPE, OPERATION, TASKSTATE, TASKTYPE, TASKLEVEL} from "@/utils/constant";
import {ElMessage} from "element-plus";
import {getworkerAllTasks} from "@/api/task";
import {deleteImg} from "@/api/file";
import {submitReport} from "@/api/report";
import {sendLog} from "@/api/log";
import TaskDetails from "@/components/TaskDetails";
import TaskItem from "@/components/TaskItem";


export default {
  name: "currentTask",
  components: {TaskItem, TaskDetails},
  data() {
    return {
      coopReportList: [],
      uploadImgUrl: uploadImgUrl,
      dialogImageUrl: '',
      dialogVisible: false,
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
      icon: {
        report: require('@/assets/icon/report.png'),
        app: require('@/assets/icon/app.png'),
        download: require('@/assets/icon/download.png'),
        list: require('@/assets/icon/List.png'),
      },
      taskInfo: {
        name: "",
        bref: "",
        deadlineTime: "",
        taskType: "",
        id: "",
        maxNumber: "",
        taskState: "",
        taskLevel: "",
        devices: [],
        categories: "",
      },
      total: 0,
      taskList: [],
      pageSize: 10,
      currentPage: 1,
      taskDetailsVisible: false,
      reportVisible: false,
      uploadType: FILETYPE,
      taskTypes: TASKTYPE,
      taskStates: TASKSTATE,
      taskDetails: {},
      fileLists: [],
      fileType: FILETYPE,
      hasSimilarReport: false,
      // hasChanged: true,
      uuid: "",
    }
  },

  mounted() {
    this.initTaskList();
  },

  methods: {
    hideTaskDetails(index) {
      this.taskDetailsVisible = false;
    },
    initTaskList() {
      this.getTaskList(0);
    },
    getTaskList(page) {
      let payload = {
        page: page,
        size: this.pageSize
      }
      getworkerAllTasks(payload).then(res => {
        if (res.code === 1 && res.data !== null) {
          this.taskList = [];
          for (let i = 0; i < res.data.content.length; i++) {
            let temp = res.data.content[i];
            temp.createTime = dateParse(temp.createTime);
            temp.deadlineTime = dateParse(temp.deadlineTime);
            temp.taskTypeValue = temp.taskType;
            temp.taskType = TASKTYPE[temp.taskType].label;
            temp.taskLevelValue = TASKLEVEL[temp.taskLevel].label;
            let unpublished = false;
            switch (res.data.content[i].taskState) {
              case TASKSTATE.RELEASED:
                temp.taskState = {
                  type: 'success',
                  label: "已发布",
                  value: res.data.content[i].taskState
                }
                break;
              case TASKSTATE.CONDITION_SATISFIED:
                temp.taskState = {
                  type: 'danger',
                  label: "人数已满",
                  value: res.data.content[i].taskState
                }
                break;
              case TASKSTATE.EXPIRED:
                temp.taskState = {
                  type: 'warning',
                  label: "已过期",
                  value: res.data.content[i].taskState
                }
                unpublished = true;
                break;
            }
            if (unpublished === false) {
              this.taskList.push(temp);
            }
          }
          this.total = res.data.totalElements;
        } else {
          ElMessage.error("获取任务列表失败");
        }
      })
    },
    handleTaskDetails(index) {
      this.taskDetails = this.taskList[index];
      this.taskDetailsVisible = true;
    },
    changePage(val) {
      this.currentPage = val;
      this.getTaskList(val - 1);
    },
    // 报告部分
    handleReportDetail(index) {
      this.hasSimilarReport = false;
      this.taskDetails = this.taskList[index];
      this.reportVisible = true;
      this.dynamicValidateForm.bugList = [{
        "bug_detail": "",
        "bug_trigger": "",
        "url": []
      }];
      this.uuid = JSON.stringify(this.taskDetails.id + this.$storage.getItem("userInfo").id + Date.now());
    },
    hideReportDetails() {
      this.hasSimilarReport = false;
      this.$refs.dynamicValidateForm.resetFields();
      this.dynamicValidateForm.bugList = [{
        "bug_detail": "",
        "bug_trigger": "",
        "url": []
      }];
      this.reportVisible = false;
    },
    // resetForm(formName) {
    //   this.$refs[formName].resetFields();
    // },
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
    //图片删除
    handleRemove(pics, picsLists, index) {
      console.log(index);//index是第几个bug
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
    downloadApp(index, type) {
      this.fileLists = this.taskList[index].fileList;
      let payload = new FormData();
      payload.append("fileType", type)
      payload.append("tid", this.taskList[index].id)
      console.log(payload);
      appDownload(payload).catch(err => {
        ElMessage.error("文件不存在！")
      });
    },
    handleSubmit(rid) {
      this.$refs.dynamicValidateForm.validate((valid, obj) => {
        let showSimilarityList = this.hasSimilarReport;
        if (valid) {
          console.log(rid)
          let tid = this.taskDetails.id;
          let reportVO = JSON.parse(JSON.stringify(this.dynamicValidateForm));
          let uuid = this.uuid;
          let Changed;
          if(rid===-1)Changed=true;
          else Changed=false;
          let payload = {
            hasChanged: Changed,
            rid: rid,
            uuid: uuid,
          }
          for (let i = 0; i < reportVO.bugList.length; i++) {
            reportVO.bugList[i].url = JSON.stringify(reportVO.bugList[i].url);
          }
          if (showSimilarityList === true&&rid===-1) {
            this.$confirm('您的报告内容与他人有较多重复，是否坚持单独提交？', '警告', {
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
          } else {
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
        this.handleSubmit(rid)
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
    showMyReport(index) {
      this.$storage.setItem("query", {id: this.taskList[index].id});
      this.$router.push({path: "/currentTask/MyReports", query: {id: this.taskList[index].id}})
    }
  }

}
</script>

<style scoped>
.report-card {
  width: 100%;
}

.report-info {
  flex: 1;
  width: 100%;
}

.report-total {
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.report-container {
  width: 100%;
  display: flex;
  margin: 10px 0px;
}

.report-list-header {
  font-size: 16px;
  font-weight: bold;
  color: black;

}

.current-report {
  flex: 1;
}

.report-dialog {
  display: flex;
}

.report-list {
  width: 100%;
  flex: 1;
}

.devices {

  margin: 2px;
}

.report_form {
  width: 90%
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

.task-container {
  margin: 10px 10px;
  width: 99%;
  height: 220px;
  display: flex;
  justify-content: center;
}

.task-card {
  width: 100%;
  height: 200px;
}

.task-card:hover {
  width: 100%;
  height: 200px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.5);
}

.task-task-card-mainbody {
  width: 100%;
  height: 180px;
  display: flex;
  flex-direction: column;
}

.task-card-body {
  width: 100%;
  height: 180px;
  flex: 5;
  display: flex;
  flex-direction: column;
}

.task-info {
  width: 100%;
  flex: 5;
  cursor: pointer;
}

.task-foot {
  flex: 1;
  display: flex;
  border-top: 1px solid #ddd;
}

.icon {
  margin-top: 7px;
  width: 1.5em;
  height: 1.5em;
}

.icon-btn {
  flex: 1;
  height: 35px;
  cursor: pointer;
  display: flex;
  justify-content: center;
}

.icon-btn:hover {
  background-color: #E4E7ED;
}
</style>