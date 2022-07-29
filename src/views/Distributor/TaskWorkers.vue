<template>
  <div>
    <el-card>
      <div v-if="workerList.length===0" class="empty">
        <el-empty description="还没有用户参加哦！" image-size="180"></el-empty>
      </div>
      <div v-else class="container">
        <div v-for="(item, index) in workerList" :key="index">
          <el-card class="info-card">
            <div>
              <div style="height: 25px">
                <el-row style="height: 100%">
                  <el-col :span="5" class="worker-info-item">
                    <div>
                      <el-avatar shape="square" :size="40" :src="item.userInfo.picture"></el-avatar>
                    </div>
                    <span style="margin-left: 20px; font-size: 20px">{{ item.userInfo.uname }}</span>
                  </el-col>
                  <el-col :span="17" class="worker-info-item">
                  </el-col>
                  <el-col :span="2" class="worker-info-item">
                    <el-button type="text" @click="handleShowDetails(index)">查看</el-button>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </el-card>

    <el-dialog v-model="showDetails">
      <el-form style="width: 500px; margin: 0 auto">
        <el-row>
          <el-col :span="4">
            <el-avatar shape="square" :size="70" :src="workerDetails.userInfo.picture"></el-avatar>
          </el-col>
          <el-col :span="20">
            <el-form-item>
              <div style="font-size: 20px; font-weight: bold">{{ workerDetails.userInfo.uname }}</div>
            </el-form-item>
            <el-form-item>
              <el-tag size="large">{{ workerDetails.userInfo.userRole }}</el-tag>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form label-width="auto" style="width: 500px; margin: 0 auto">
        <el-form-item label="用户ID：">
          <span class="info-value">{{ workerDetails.userInfo.id }}</span>
        </el-form-item>
        <el-form-item label="电话号码：">
          <span class="info-value">{{ workerDetails.userInfo.phone }}</span>
        </el-form-item>
        <el-form-item label="注册时间：">
          <span class="info-value">{{ workerDetails.userInfo.createTime }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {getWorkers} from "@/api/task";
import {ElMessage} from "element-plus";
import {dateParse} from "@/utils/util";

export default {
  name: "TaskWorkers",
  data() {
    return {
      taskId: this.$route.query.id,
      workerList: [],
      showDetails: false,
      workerDetails: {}
    }
  },
  mounted() {
    this.initWorkers();
  },
  methods: {
    initWorkers() {
      getWorkers(this.taskId).then(res => {
        if (res.code === 1) {
          this.workerList = res.data.workers;
          console.log(this.workerList)
        } else {
          ElMessage.error("获取参与人员失败");
        }
      })
    },
    handleShowDetails(index) {
      this.showDetails = true;
      this.workerDetails = JSON.parse(JSON.stringify(this.workerList[index]));
      this.workerDetails.userInfo.createTime = dateParse(this.workerDetails.userInfo.createTime);
    }
  }
}
</script>

<style scoped>
.container {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.info-card {
  box-shadow: none !important;
}

.info-card:hover {
  background-color: #F2F6FC;
}

.worker-info-item {
  display: flex;
  align-items: center;
  height: 100%
}
</style>