<template>
  <div>
    <el-card>
      <div class="card-body">
        <el-tabs v-model="activeName">
          <el-tab-pane label="推荐规则" name="rec">
            <div class="select">
              <div>
                <div>请选择推荐规则：</div>
                <el-radio-group v-model="base">
                  <el-radio size="large" :label="item.value" v-for="item in options">{{ item.label }}</el-radio>
                </el-radio-group>
              </div>

              <div style="margin-top: 20px">请选择最大推荐个数：</div>
              <div style="margin-top: 20px">
                <el-input-number v-model="num" :min="1"/>
              </div>

              <div style="margin-top: 20px" v-if="base===options.USER.value">
                <div>请选择用户相似度计算方式：</div>
                <el-radio-group v-model="algorithm">
                  <el-radio size="large" :label="item" v-for="item in options.USER.options">{{ item }}</el-radio>
                </el-radio-group>
              </div>
              <div style="margin-top: 20px" v-else-if="base===options.LABEL.value">
                <div>请选择用户标签所占比重：</div>
                <div class="slider-demo-block">
                  <span class="demonstration">设备：</span>
                  <el-slider v-model="weight.devices" :step="5" :format-tooltip="formatTooltip"/>
                </div>
                <div class="slider-demo-block">
                  <span class="demonstration">领域：</span>
                  <el-slider v-model="weight.domain" :step="5" :format-tooltip="formatTooltip"/>
                </div>
                <div class="slider-demo-block">
                  <span class="demonstration">能力：</span>
                  <el-slider v-model="weight.level" :step="5" :format-tooltip="formatTooltip"/>
                </div>
                <div class="slider-demo-block">
                  <span class="demonstration">偏好：</span>
                  <el-slider v-model="weight.taskTypes" :step="5" :format-tooltip="formatTooltip"/>
                </div>
              </div>
            </div>
            <div class="footer">
              <el-button style="width: 45%" type="warning" @click="handleInitRecConf">恢复</el-button>
              <el-button style="width: 45%" type="primary" @click="handleCommitRecConf">确定</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="报告相似度算法" name="sim">
            <div class="select">
              <el-radio-group v-model="model">
                <el-radio size="large" :label="item" v-for="item in simModel">{{ item }}</el-radio>
              </el-radio-group>
            </div>
            <div class="footer">
              <el-button style="width: 45%" type="warning" @click="handleInitSimConf">恢复</el-button>
              <el-button style="width: 45%" type="primary" @click="handleCommitSimConf">确定</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
import {RECOMMENDBASE, SIMMODEL} from "@/utils/constant";
import {ElMessage} from "element-plus";
import {getRecConf, getSimConf, setRecConf, setSimConf} from "@/api/admin";

export default {
  name: "Setting",
  data() {
    return {
      activeName: "rec",
      options: RECOMMENDBASE,
      simModel: SIMMODEL,
      base: '',
      num: 0,
      algorithm: "",
      weight: {
        devices: 0,
        domain: 0,
        level: 0,
        taskTypes: 0
      },
      model: ''
    }
  },
  mounted() {
    this.handleInitRecConf();
    this.handleInitSimConf();
  },
  methods: {
    formatTooltip(val) {
      return val / 100
    },
    handleInitRecConf() {
      getRecConf().then(res => {
        if (res.code === 1) {
          this.base = Object.keys(res.data)[0]
          console.log(this.base)
          let conf = JSON.parse(res.data[this.base])
          console.log(conf);
          this.num = conf["-n"]
          console.log(this.num)
          switch (this.base) {
            case RECOMMENDBASE.USER.value:
              this.algorithm = conf["-a"];
              break;
            case RECOMMENDBASE.TASK.value:
              break;
            case RECOMMENDBASE.LABEL.value:
              this.weight = conf["-w"];
              break;
            default:
          }
        } else {
          ElMessage.error("获取推荐规则失败!");
        }
      })
    },
    handleCommitRecConf() {
      let payload = {}
      switch (this.base) {
        case RECOMMENDBASE.USER.value:
          payload = {
            user: {"-a": this.algorithm, "-n": this.num}
          }
          break;
        case RECOMMENDBASE.TASK.value:
          payload = {
            task: {"-n": this.num}
          }
          break;
        case RECOMMENDBASE.LABEL.value:
          payload = {
            label: {"-w": this.weight, "-n": this.num}
          }
          break;
        default:
          ElMessage.warning("请选择推荐规则");
      }
      let formData = new FormData();
      formData.append("config", JSON.stringify(payload));
      console.log(formData.get("config"));
      setRecConf(formData).then(res => {
        if (res.code === 1) {
          ElMessage.success("修改成功");
        } else {
          ElMessage.error("修改失败");
        }
      })
    },
    handleInitSimConf() {
      getSimConf().then(res => {
        if (res.code === 1) {
          this.model = JSON.parse(res.data["report-strategy"]).model;
          console.log(this.model)
          console.log(res.data["report-strategy"])
        } else {
          ElMessage.error("获取报告相似度算法失败");
        }
      })
    },
    handleCommitSimConf() {
      let formData = new FormData();
      let payload = {
        "model": this.model
      }
      formData.append("config", JSON.stringify(payload));
      setSimConf(formData).then(res => {
        if (res.code === 1) {
          ElMessage.success("修改成功");
        } else {
          ElMessage.error("修改失败");
        }
      })
    }
  }
}
</script>

<style scoped>
.card-body {
  height: calc(100vh - 135px);
}

.select {
  height: calc(100vh - 230px);
}

.footer {
  width: 500px;
}

.slider-demo-block {
  display: flex;
  align-items: center;
  max-width: 500px;
}

.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}

.slider-demo-block .demonstration {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 44px;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
}

.slider-demo-block .demonstration + .el-slider {
  flex: 0 0 89%;
}

</style>