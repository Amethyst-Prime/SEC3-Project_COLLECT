<template>
  <div>
    <el-card>
      <div v-if="taskList.length===0" class="empty">
        <el-empty description="你还没有已结束的任务" image-size="180"></el-empty>
      </div>
      <div v-else class="task-container" v-for="(item, index) in taskList">
        <el-card class="task-card" @click="handleTaskDetails(index)">

          <div class="task-card-body">
            <task-item :item="item"></task-item>
          </div>

        </el-card>
        <el-row></el-row>
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
</template>

<script>
import {
  dateParse,
} from "@/utils/util";
import {
  FILETYPE,
  TASKSTATE,
  TASKTYPE,
    TASKLEVEL
} from "@/utils/constant";
import {
  ElMessage
} from "element-plus";
import {getHistoryTasks} from "@/api/task";
import TaskDetails from "@/components/TaskDetails";
import TaskItem from "@/components/TaskItem";

export default {
  name: "historyTask",
  components: {TaskItem, TaskDetails},
  data() {
    return {
      icon: {
        detail: require('@/assets/icon/detail.png'),
        upload: require('@/assets/icon/upload.png'),
        ignore: require('@/assets/icon/ignore.png'),
        quit: require('@/assets/icon/x.png'),
      },
      taskInfo: {
        name: "",
        bref: "",
        deadlineTime: "",
        taskType: "",
        id: "",
        maxNumber: "",
        taskState: ""
      },
      total: "",
      taskList: [],
      pageSize: 10,
      currentPage: 1,
      taskDetailsVisible: false,
      uploadType: FILETYPE,
      taskTypes: TASKTYPE,
      taskStates: TASKSTATE,
      taskLevel: "",
      devices:[],
      categories: "",
      taskDetails: {}
    }
  },
  mounted() {
    this.initTaskList();
  },
  methods: {
    initTaskList() {
      this.getTaskList(0);
    },
    getTaskList(page) {
      let payload = {
        page: page,
        size: this.pageSize
      }
      getHistoryTasks(payload).then(res => {
        if (res.code === 1 && res.data !== null) {
          this.taskList = [];
          for (let i = 0; i < res.data.content.length; i++) {
            let temp = res.data.content[i];
            temp.createTime = dateParse(temp.createTime);
            temp.deadlineTime = dateParse(temp.deadlineTime);
            temp.taskType = TASKTYPE[temp.taskType].label;
            temp.taskLevelValue=TASKLEVEL[temp.taskLevel].label;
            switch (res.data.content[i].taskState) {
              case TASKSTATE.EXPIRED:
                temp.taskState = {
                  type: 'warning',
                  label: "已过期",
                  value: res.data.content[i].taskState
                }
                this.taskList.push(temp);
                break;
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
    hideTaskDetails(index) {
      this.taskDetailsVisible = false;
    },
  }
}
</script>

<style scoped>
.devices{
  margin: 2px;
}
.status {
  text-align: center;
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

.task-container {
  margin: 10px 10px;
  width: 99%;
  height: 186px;
  display: flex;
  justify-content: center;
}

.task-card {
  width: 100%;
  height: 180px;
  background-color: rgba(230, 227, 227, 0.658);
}

.task-card-body {
  width: 100%;
  height: 160px;
  display: flex;
  flex-direction: column;
}

.task-info {
  width: 100%;
  flex: 5;
  cursor: pointer;
}


</style>