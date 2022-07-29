<template>
  <!--  任务筛选
  <el-card class="box-card">
      <div class="cards">

          <div slot="header" class="clearfix">
              <span>筛选条件</span>
              <hr>
          </div>
          <el-row>
              <el-col :span="2">
                  <el-tag>任务状态</el-tag>
              </el-col>
          </el-row>
          <el-radio v-model="radio" label="1">可参与</el-radio>
          <el-radio v-model="radio" label="2">进行中</el-radio>
          <el-row></el-row>
          <el-row>
              <el-col :span="2">
                  <el-tag>任务类型</el-tag>
              </el-col>
          </el-row>
          <el-row>
              <div>
                  <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
                      全选</el-checkbox>
                  <el-checkbox-group v-model="checkedOptions" @change="handleCheckedOptionsChange">
                      <el-checkbox v-for="option in options" :label="option" :key="option">{{option}}</el-checkbox>
                  </el-checkbox-group>
              </div>
          </el-row>

      </div>
  </el-card>

  <el-row></el-row>
-->
  <div>
    <el-card>
      <div v-if="taskList.length===0" class="empty">
        <el-empty description="你还没有已结束的任务" image-size="180"></el-empty>
      </div>
      <div v-else class="task-container" v-for="(item, index) in taskList">
        <el-card class="task-card" @click="handleTaskDetails(index)">
          <task-item :item="item"></task-item>
        </el-card>
      </div>

      <el-pagination background hide-on-single-page layout="prev, pager, next, ->, total"
                     @current-change="changePage" :page-size="pageSize" :total="total">
      </el-pagination>

    </el-card>
  </div>

  <el-dialog v-model="taskDetailsVisible" title="任务详情" width="55%" destroy-on-close :close-on-click-modal="false"
             center>
    <task-details :task-details="taskDetails" :show-file="false"></task-details>
  </el-dialog>
</template>


<script>
import {dateParse,} from "@/utils/util";
import {TASKSTATE, TASKTYPE} from "@/utils/constant";
import {ElMessage} from "element-plus";
import {getReleasedTasks} from "@/api/task"
import TaskItem from "@/components/TaskItem";
import TaskDetails from "@/components/TaskDetails";

const Options = ['Bug探索', '用例执行', '用例设计', '功能测试'];


export default {
  name: "AllTask",
  components: {TaskDetails, TaskItem},
  data() {
    return {
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
      pageSize: 10,
      currentPage: 1,
      taskDetailsVisible: false,
      taskInfo: {
        name: "",
        bref: "",
        deadlineTime: "",
        taskType: "",
        id: "",
        maxNumber: "",
        taskState: ""
      },
      taskDetails: {}
    };
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
      getReleasedTasks(payload).then(res => {
        if (res.code === 1 && res.data !== null) {
          this.taskList = [];
          console.log(res.data)
          for (let i = 0; i < res.data.content.length; i++) {
            let temp = res.data.content[i];
            temp.createTime = dateParse(temp.createTime);
            temp.deadlineTime = dateParse(temp.deadlineTime);
            temp.taskType = TASKTYPE[temp.taskType].label;
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
    },
    hideTaskDetails(index) {
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
    }
  }
}
</script>

<style scoped>
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
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.5);
}

.task-card-body {
  width: 100%;
  height: 100%;
  display: flex;
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
</style>