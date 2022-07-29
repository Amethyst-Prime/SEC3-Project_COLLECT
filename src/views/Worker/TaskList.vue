<template>
  <div>
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="推荐任务" name="recommendTask"></el-tab-pane>
        <el-tab-pane label="所有任务" name="allTask"></el-tab-pane>
      </el-tabs>
      <div v-if="taskList.length===0" class="empty">
        <el-empty description="暂无任务可接受" image-size="180"></el-empty>
      </div>
      <div v-else class="task-container" v-for="(item, index) in taskList">
        <el-card class="task-card" @click="handleTaskDetails(index)">
          <div class="task-card-body">
            <task-item :item="item"></task-item>
          </div>
        </el-card>
        <el-row></el-row>
      </div>
      <el-pagination v-if="currentShow==='all'" background hide-on-single-page layout="prev, pager, next, ->, total"
                     @current-change="changePage" :page-size="pageSize" :total="total">
      </el-pagination>
    </el-card>
  </div>

  <el-dialog v-model="taskDetailsVisible" title="任务详情" width="55%" destroy-on-close :close-on-click-modal="false"
             center>
    <TaskDetails :task-details="taskDetails"></TaskDetails>
    <template #footer>
      <span>
        <el-button style="width: 100px" @click="hideTaskDetails()">取消</el-button>
        <el-button style="width: 100px" @click="acceptTask()" type="primary">接受任务</el-button>
      </span>
    </template>
  </el-dialog>

</template>


<script>
import {
  dateParse,
} from "@/utils/util";
import {
  FILETYPE, OPERATION,
  TASKSTATE,
  TASKTYPE,
  TASKLEVEL,
  DEVICE
} from "@/utils/constant";
import {
  uploadUrl
} from "@/api/file";
import {
  ElMessage
} from "element-plus";
import {
  acceptTask, getUnjoinedTasks, getRecommendTask
} from "@/api/task"
import {sendLog} from "@/api/log";
import TaskDetails from "@/components/TaskDetails";
import TaskItem from "@/components/TaskItem";

const Options = ['Bug探索', '用例执行', '用例设计', '功能测试'];


export default {
  name: "TaskList",
  components: {TaskItem, TaskDetails},
  data() {
    return {
      activeName: 'recommendTask',
      radio: '1',
      icon: {
        detail: require('@/assets/icon/detail.png'),
        get: require('@/assets/icon/get.png'),
        ignore: require('@/assets/icon/ignore.png'),
        quit: require('@/assets/icon/x.png'),
      },
      checkAll: false,
      checkedOptions: ['Bug探索', '用例执行'],
      options: Options,
      isIndeterminate: true,
      total: 0,
      taskList: [],
      recommendTaskList: [],
      pageSize: 10,
      currentPage: 1,
      taskDetailsVisible: false,
      uploadType: FILETYPE,
      taskTypes: TASKTYPE,
      taskStates: TASKSTATE,
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
      taskDetails: {},
      currentShow: 'recommend'
    };
  },
  mounted() {
    this.initTaskList();
  },
  methods: {
    initTaskList() {
      this.getRecommendTaskList();
    },
    getRecommendTaskList() {
      this.taskList = [];
      getRecommendTask().then(res => {
        console.log(res.data)
        if (res.code === 0) {
          this.taskList = [];
        } else if (res.code === 1 && res.data !== null) {
          this.taskList = [];
          for (let i = 0; i < res.data.tasks.length; i++) {
            let temp = res.data.tasks[i];
            temp.createTime = dateParse(temp.createTime);
            temp.deadlineTime = dateParse(temp.deadlineTime);
            temp.taskTypeValue = temp.taskType;
            temp.taskType = TASKTYPE[temp.taskType].label;
            temp.taskLevelValue = TASKLEVEL[temp.taskLevel].label;
            let unpublished = false;
            switch (res.data.tasks[i].taskState) {
              case TASKSTATE.UNRELEASED:
                temp.taskState = {
                  type: 'info',
                  label: "未发布",
                  value: res.data.tasks[i].taskState
                }
                unpublished = true;
                break;
              case TASKSTATE.RELEASED:
                temp.taskState = {
                  type: 'success',
                  label: "已发布",
                  value: res.data.tasks[i].taskState
                }
                break;
              case TASKSTATE.CONDITION_SATISFIED:
                temp.taskState = {
                  type: 'danger',
                  label: "人数已满",
                  value: res.data.tasks[i].taskState
                }
                break;
              case TASKSTATE.EXPIRED:
                temp.taskState = {
                  type: 'warning',
                  label: "已过期",
                  value: res.data.tasks[i].taskState
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

    getTaskList(page) {
      console.log("---------------------------------")
      let payload = {
        page: page,
        size: this.pageSize
      }
      getUnjoinedTasks(payload).then(res => {
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
              case TASKSTATE.UNRELEASED:
                temp.taskState = {
                  type: 'info',
                  label: "未发布",
                  value: res.data.content[i].taskState
                }
                unpublished = true;
                break;
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
      console.log(this.taskDetails);
      console.log(DEVICE[this.taskDetails.devices[0]].label)
      // 日志-浏览任务
      let taskTagVO = {
        tid: this.taskDetails.id,
        categoryList: this.taskDetails.categories,
        devices: this.taskDetails.devices,
        taskLevel: this.taskDetails.taskLevel,
        taskType: this.taskDetails.taskTypeValue,

      };
      sendLog(OPERATION.glance, taskTagVO);
    },
    hideTaskDetails() {
      this.taskDetailsVisible = false;
    },

    changePage(val) {
      this.currentPage = val;
      this.getTaskList(val - 1);
    },

    handleCheckAllChange(val) {
      this.checkedOptions = val ? Options : [];
      this.isIndeterminate = false;
    },
    handleCheckedOptionsChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.options.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.options.length;
    },
    handleTabClick(tab, event) {
      console.log(tab.props.name);
      let name = tab.props.name;
      if (name === 'recommendTask') {
        this.currentShow = "recommend"
        this.getRecommendTaskList();
      } else if (name === 'allTask') {
        this.currentShow = "all"
        this.getTaskList(0);
      }
    },
    acceptTask() {
      let payload = new FormData();
      payload.append('tid', this.taskDetails.id);
      acceptTask(payload).then(res => {
        if (res.code === 1) {
          ElMessage.success("接受成功！")
          if (this.currentShow = "all") {
            this.getTaskList(this.currentPage - 1);
          } else {
            this.getRecommendTaskList();
          }

          // 日志-接受任务
          let taskTagVO = {
            tid: this.taskDetails.id,
            categoryList: this.taskDetails.categories,
            devices: this.taskDetails.devices,
            taskLevel: this.taskDetails.taskLevel,
            taskType: this.taskDetails.taskTypeValue
          };
          sendLog(OPERATION.accept, taskTagVO);
        } else {
          ElMessage.error("接受失败，任务已过期，或人数已满");
        }
      })

      this.taskDetailsVisible = false;
    }
  }
}
</script>

<style scoped>

.button1 {
  flex: 1;
}

.button2 {
  float: right;
  flex: 1;
}


.taskbutton {
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
}

.innerdiv {
  margin: 30px;
}

.taskA {
  flex: 1;
}

.taskB {
  flex: 1;
}

.taskC {
  flex: 1;
}

.basicinfo {
  line-height: 2;
}

.task-container {
  margin: 10px 10px;
  width: 99%;
  height: 190px;
  display: flex;
  justify-content: center;
}

.task-card {
  width: 100%;
  height: 180px;
}

.task-card:hover {
  width: 100%;
  height: 180px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.5);
}

.task-card-body {
  width: 100%;
  height: 100%;
  display: flex;
}

.task-info {
  width: 100%;
  flex: 5;
  cursor: pointer;
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

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 100%;
}

.el-row {
  margin-bottom: 20px;
}

.el-col {
  border-radius: 4px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>