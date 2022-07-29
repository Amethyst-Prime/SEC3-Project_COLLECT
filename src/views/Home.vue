<template>
  <div>
    <el-card>
      <div class="welcome">
        <div class="welcome-font">
          工人群体智能汇聚
        </div>
        <div class="welcome-font">
          测试过程评价机制
        </div>
        <div class="welcome-font">
          测试结果聚合优化
        </div>
      </div>
      <el-carousel :interval="4000" type="card" height="200px">
        <el-carousel-item>
          <div class="task-info" @click="handleTaskClick">
            <div style="align-items: center; display: flex; justify-content: center"><span>Welcome</span></div>
          </div>
        </el-carousel-item>
        <el-carousel-item v-for="(item, index) in taskListExample" :key="index">
          <div class="task-info" @click="handleTaskClick">
            <div class="task-name">{{ item.name }}</div>
            <div style="margin-bottom: -20px;">
              <el-tag size="small" style="margin-right: 5px" effect="dark" type="">{{ item.taskType }}</el-tag>
              <el-tag size="small" effect="dark" :type="item.taskState.type">{{ item.taskState.label }}</el-tag>
            </div>
            <el-divider border-style="dashed"></el-divider>
            <div class="task-brief">{{ item.brief }}</div>
            <div class="task-time">{{ item.createTime }} - {{ item.deadlineTime }}</div>
          </div>
        </el-carousel-item>
      </el-carousel>


    </el-card>

  </div>
</template>

<script>

import {getAllTasks} from "@/api/task";
import {dateParse} from "@/utils/util";
import {TASKSTATE, TASKTYPE, USERROLE} from "@/utils/constant";
import Similarity from "@/components/Similarity";

export default {
  name: "Home",
  components: {Similarity},
  data() {
    return {
      taskListExample: [],
      pageSize: 10,
      showNum: 6,
      backgroundImg: require('@/assets/backgroung.jpg'),

      // treeData: {
      //   rid: "0",
      //   title: "所有报告",
      //   children: [
      //     {
      //       rid: "4",
      //       title: '一级 1 发送到发送到发送到发',
      //       score: 2.1,
      //       children: [{
      //         rid: "7",
      //         title: '二级 1-1',
      //         score: 3.1,
      //       }]
      //     },
      //     {
      //       rid: "5",
      //       title: '一级 2',
      //       score: 4.5,
      //       children: [{
      //         rid: "8",
      //         title: '二级 2-1',
      //         score: 5.0,
      //         children: [{
      //           rid: "9",
      //           title: '三级 2-1-1',
      //           score: 1.3,
      //         }, {
      //           rid: "10",
      //           title: '三级 2-1-2',
      //           score: 3.5,
      //         }]
      //       }]
      //     },
      //     {
      //       rid: "6",
      //       title: '一级 3',
      //       score: 4.2,
      //       children: [{
      //         rid: "11",
      //         title: '二级 3-1',
      //         score: 3.8,
      //         children: [{
      //           rid: "12",
      //           title: '三级 3-1-1',
      //           score: 2.5,
      //         }, {
      //           rid: "13",
      //           title: '三级 3-1-2',
      //           score: 4.5,
      //         }, {
      //           rid: "14",
      //           title: '三级 3-1-3',
      //           score: 3.8,
      //         }, {
      //           rid: "15",
      //           title: '三级 3-1-4',
      //           score: 3.1,
      //         }]
      //       }]
      //     }
      //   ]
      // }
    }
  },
  mounted() {
    this.initTaskList();
  },
  methods: {
    initTaskList() {
      let payload = {
        page: 0,
        size: this.pageSize
      }
      getAllTasks(payload).then(res => {
        if (res.code === 1) {
          for (let i = 0; i < Math.min(res.data.content.length) && this.taskListExample.length < this.showNum; i++) {
            let temp = res.data.content[i];
            temp.createTime = dateParse(temp.createTime);
            temp.deadlineTime = dateParse(temp.deadlineTime);
            temp.taskType = TASKTYPE[temp.taskType].label;
            let add = true;
            switch (res.data.content[i].taskState) {
              case TASKSTATE.UNRELEASED:
                temp.taskState = {
                  type: 'info',
                  label: "未发布",
                  value: res.data.content[i].taskState
                }
                add = false;
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
                break;
            }
            if (add)
              this.taskListExample.push(res.data.content[i]);
          }
        }
      })
    },
    handleTaskClick() {
      let userInfo = this.$storage.getItem("userInfo");
      console.log(userInfo);
      if (userInfo) {
        if (userInfo.userRole === USERROLE.DISTRIBUTOR) {
          this.$router.push("/dTaskList");
        } else if (userInfo.userRole === USERROLE.WORKER) {
          this.$router.push("/wTaskList");
        }
      } else {
        this.$router.push("/login");
      }
    }
  }
}
</script>

<style scoped>
.welcome {
  width: 100%;
  height: 300px;
  background-size: cover;
  background: url("../assets/backgroung.jpg") no-repeat 100% 0;
  margin-bottom: 20px;
}

.welcome-font {
  padding-top: 10px;
  margin-left: 80px;
  margin-bottom: 10px;
  font-weight: 300;
  font-size: 40px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item {
  background-color: #F2F6FC;
  border-radius: 10px;
}

.task-info {
  width: calc(100% - 40px);
  flex: 5;
  cursor: pointer;
  padding: 20px;
}

.task-name {
  font-size: 20px;
  font-weight: bold;
  margin-top: -10px;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-brief {
  font-size: 15px;
  margin-top: -20px;
  margin-bottom: 20px;
  color: #909399;
  height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  word-wrap: break-word;
  word-break: break-all;
}

.task-time {
  font-size: 10px;
  color: #909399;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>