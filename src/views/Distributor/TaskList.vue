<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>我的发布</span>
        </div>
      </template>
      <el-row :gutter="20" justify="start">
        <div class="task-container add-card-container">
          <el-card class="task-card" @click="handleAddTask">
            <div class="add-card">
              <el-icon>
                <Plus/>
              </el-icon>
            </div>
          </el-card>
        </div>

        <!--没有任务时显示空状态-->
        <div v-if="taskList.length===0" class="empty">
          <el-empty description="还没有创建任务，快去创建吧！" image-size="160"></el-empty>
        </div>

        <!--任务列表-->
        <div v-else class="task-container" v-for="(item, index) in taskList">
          <el-card class="task-card">
            <div class="task-card-body">
              <div class="task-info" @click="handleShowDetails(index)">
                <div class="task-name">{{ item.name }}</div>
                <div style="margin-bottom: -20px;">
                  <el-tag size="small" style="margin-right: 5px" effect="dark" type="">{{ item.taskType }}</el-tag>
                  <el-tag size="small" effect="dark" :type="item.taskState.type">{{ item.taskState.label }}</el-tag>
                </div>
                <el-divider border-style="dashed"></el-divider>
                <div class="task-brief">{{ item.brief }}</div>
                <div class="task-time">{{ item.createTime }} - {{ item.deadlineTime }}</div>
              </div>
              <div class="task-foot">
                <div class="icon-btn" @click="handleDeleteTask(index)">
                  <el-tooltip
                      class="box-item"
                      effect="dark"
                      content="删除任务"
                      placement="bottom">
                    <img class="icon" :src="icon.trash" alt="删除任务"/>
                  </el-tooltip>
                </div>
                <div class="icon-btn"
                     @click="handleShowReportsOrWorkers(index, {path: '/dTaskList/taskReports', query:{id: item.id}})">
                  <el-tooltip
                      class="box-item"
                      effect="dark"
                      content="报告列表"
                      placement="bottom">
                    <img class="icon" :src="icon.reports" alt="报告列表"/>
                  </el-tooltip>
                </div>
                <div class="icon-btn"
                     @click="handleShowReportsOrWorkers(index, {path: '/dTaskList/taskWorkers', query:{id: item.id}})">
                  <el-tooltip
                      class="box-item"
                      effect="dark"
                      content="参与人员"
                      placement="bottom">
                    <img class="icon" :src="icon.workers" alt="参与人员"/>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </el-row>
      <el-pagination
          background
          hide-on-single-page
          layout="prev, pager, next, ->, total"
          @current-change="changePage"
          :page-size="pageSize"
          :total="total">
      </el-pagination>
    </el-card>

    <!--    <div class="add-btn-container">-->
    <!--      <el-affix position="bottom" size="large" :offset="100">-->
    <!--        <button class="add-btn" @click="handleAddTask">-->
    <!--          <el-icon>-->
    <!--            <Plus/>-->
    <!--          </el-icon>-->
    <!--        </button>-->
    <!--      </el-affix>-->
    <!--    </div>-->


    <!--添加任务-->
    <el-dialog v-model="addTaskDialogVisible"
               title="创建测试任务"
               width="55%"
               destroy-on-close
               :close-on-click-modal="false"
               top="5vh"
               center>

      <el-form label-width="auto" :model="taskInfo" :rules="rules" ref="taskInfoRef">
        <el-form-item label="任务名称：" prop="name">
          <el-input v-model="taskInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="任务简介：" prop="brief">
          <el-input type="textarea" :rows="5" v-model="taskInfo.brief" show-word-limit maxlength="200"></el-input>
        </el-form-item>
        <el-form-item label="软件类型：" prop="categories">
          <el-select v-model="taskInfo.categories" class="m-2" multiple style="width: 100%">
            <el-option
                v-for="item in softwareCategory"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型：" prop="devices">
          <el-select v-model="taskInfo.devices" class="m-2" multiple style="width: 100%">
            <el-option
                v-for="item in device"
                :key="item"
                :label="item"
                :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="截止时间：" prop="deadlineTime">
          <el-date-picker
              v-model="taskInfo.deadlineTime"
              type="date"
              range-separator="To"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所需工人：" prop="maxNumber">
          <el-input-number v-model="taskInfo.maxNumber" :min="1" :max="100"/>
        </el-form-item>
        <el-form-item label="测试类型：" prop="taskType">
          <el-select v-model="taskInfo.taskType" class="m-2">
            <el-option
                v-for="item in taskTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务难度：" prop="taskLevel">
          <el-select v-model="taskInfo.taskLevel" class="m-2">
            <el-option
                v-for="item in level"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <el-form>
        <el-row>
          <el-form-item label="待测应用：">
            <el-upload
                ref="uploadExecutableFile"
                show-file-list="true"
                multiple="false"
                :file-list="executableFile"
                :auto-upload="false"
                :limit="limitNum"
                :on-change="changeExecutable"
                :on-remove="(file, fileList)=>{handleRemove(file, fileList, 0)}"
                :http-request="uploadExecutable"
                :action="uploadUrl">
              <el-button type="primary">上传文件</el-button>
              <template #tip>
                <div class="el-upload__tip" style="color: red;">
                  limit 1 file with a size less than 200MB
                </div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item label="描述文件：">
            <el-upload
                ref="uploadDescriptionFile"
                show-file-list="true"
                multiple="false"
                :file-list="descriptionFile"
                :auto-upload="false"
                :limit="limitNum"
                :on-change="changeDescription"
                :on-remove="(file, fileList)=>{handleRemove(file, fileList, 1)}"
                :http-request="uploadDescription"
                :action="uploadUrl">
              <el-button type="primary">上传文件</el-button>
              <template #tip>
                <div class="el-upload__tip" style="color: red;">
                  limit 1 file with a size less than 200MB
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-row>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="addTaskDialogVisible = false">取消</el-button>
        <el-button type="warning" @click="handleCommitTask(0)">暂存</el-button>
        <el-button type="primary" @click="handleCommitTask(1)">发布</el-button>
      </span>
      </template>
    </el-dialog>


    <!--修改任务-->
    <el-dialog v-model="updateTaskDialogVisible"
               title="编辑测试任务"
               width="55%"
               destroy-on-close
               :close-on-click-modal="false"
               top="5vh"
               center>

      <el-form label-width="auto" :model="updateTaskInfo" :rules="rules" ref="updateTaskInfoRef">
        <el-form-item label="任务名称：" prop="name">
          <el-input v-model="updateTaskInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="任务简介：" prop="brief">
          <el-input type="textarea" :rows="5" v-model="updateTaskInfo.brief" show-word-limit maxlength="200"></el-input>
        </el-form-item>
        <el-form-item label="软件类型：" prop="categories">
          <el-select v-model="updateTaskInfo.categories" class="m-2" multiple style="width: 100%">
            <el-option
                v-for="item in softwareCategory"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型：" prop="devices">
          <el-select v-model="updateTaskInfo.devices" class="m-2" multiple style="width: 100%">
            <el-option
                v-for="item in device"
                :key="item"
                :label="item"
                :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="截止时间：" prop="deadlineTime">
          <el-date-picker
              v-model="updateTaskInfo.deadlineTime"
              type="date"
              range-separator="To"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所需工人：" prop="maxNumber">
          <el-input-number v-model="updateTaskInfo.maxNumber" :min="1" :max="100"/>
        </el-form-item>
        <el-form-item label="测试类型：" prop="taskType">
          <el-select v-model="updateTaskInfo.taskType" class="m-2">
            <el-option
                v-for="item in taskTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务难度：" prop="taskLevel">
          <el-select v-model="updateTaskInfo.taskLevel" class="m-2">
            <el-option
                v-for="item in level"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <el-form>
        <el-row>
          <el-form-item label="待测应用：">
            <el-upload
                ref="uploadExecutableFile"
                show-file-list="true"
                multiple="false"
                :file-list="executableFile"
                :auto-upload="false"
                :limit="limitNum"
                :on-change="changeExecutable"
                :on-remove="(file, fileList)=>{handleRemove(file, fileList, 0)}"
                :http-request="uploadExecutable"
                :action="uploadUrl">
              <el-button type="primary">重新上传</el-button>
              <template #tip>
                <div class="el-upload__tip" style="color: red;">
                  limit 1 file with a size less than 200MB
                </div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item label="描述文件：">
            <el-upload
                ref="uploadDescriptionFile"
                show-file-list="true"
                multiple="false"
                :file-list="descriptionFile"
                :auto-upload="false"
                :limit="limitNum"
                :on-change="changeDescription"
                :on-remove="(file, fileList)=>{handleRemove(file, fileList, 1)}"
                :http-request="uploadDescription"
                :action="uploadUrl">
              <el-button type="primary">重新上传</el-button>
              <template #tip>
                <div class="el-upload__tip" style="color: red;">
                  limit 1 file with a size less than 200MB
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-row>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="updateTaskDialogVisible = false">取消</el-button>
        <el-button type="warning" @click="handleUpdateTask(0)">暂存</el-button>
        <el-button type="primary" @click="handleUpdateTask(1)">发布</el-button>
      </span>
      </template>
    </el-dialog>

    <!--任务详情-->
    <el-dialog
        v-model="taskDetailsVisible"
        :title="taskDetails.name"
        width="55%"
        top="5vh"
        destroy-on-close
        :close-on-click-modal="false"
        center>
      <TaskDetails :task-details="taskDetails" :show-file="true"></TaskDetails>
      <template #footer>
        <span class="dialog-footer">
              <el-button @click="taskDetailsVisible = false">取消</el-button>
              <el-button type="warning" @click="showUpdateDialog"
                         :disabled="taskDetails.taskState && !(taskDetails.taskState.value===taskStates.UNRELEASED)">编辑</el-button>
              <el-button type="primary" @click="handleUpdateTask(3)"
                         :disabled="taskDetails.taskState && !(taskDetails.taskState.value===taskStates.UNRELEASED)">发布</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {uploadUrl} from "@/api/file";
import {DEVICE, FILETYPE, SOFTWARECATEGORY, TASKLEVEL, TASKSTATE, TASKTYPE} from "@/utils/constant";
import {ElMessage, ElMessageBox} from "element-plus";
import {createTask, deleteTask, getMyReleasedTasks, updateTask} from "@/api/task";
import {dateParse, dateUnparse} from "@/utils/util";
import TaskDetails from "@/components/TaskDetails";

export default {
  name: "TaskList",
  components: {TaskDetails},
  data() {
    let validateDate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error('请选择截止时间'))
      } else {
        if (value < this.taskInfo.createTime) {
          callback(new Error('截止时间不能早于当前时间'))
        } else {
          callback()
        }
      }
    }

    return {
      icon: {
        trash: require('@/assets/icon/trash.png'),
        reports: require('@/assets/icon/template.png'),
        workers: require('@/assets/icon/users.png'),
        quit: require('@/assets/icon/x.png'),
      },
      total: 0,
      taskList: [],
      pageSize: 10,
      currentPage: 1,

      addTaskDialogVisible: false,
      uploadUrl: uploadUrl,
      uploadType: FILETYPE,
      taskTypes: TASKTYPE,
      softwareCategory: SOFTWARECATEGORY,
      level: TASKLEVEL,
      device: DEVICE,
      taskStates: TASKSTATE,

      taskInfo: {
        name: "",
        brief: "",
        createTime: new Date(),
        deadlineTime: "",
        maxNumber: 1,
        taskType: "",
        taskState: TASKSTATE.UNRELEASED,
        taskLevel: "",
        devices: [],
        categories: [],
      },
      limitNum: 1,
      executableFile: [],
      descriptionFile: [],
      rules: {
        name: [{required: true, message: '请输入任务名称', trigger: 'blur'}],
        brief: [{required: true, message: '请输入任务简介', trigger: 'blur'}],
        deadlineTime: [{required: true, message: '请选择截止时间', trigger: 'blur'}, {
          validator: validateDate,
          trigger: 'blur'
        }],
        maxNumber: [{required: true, message: '请选择所需工人', trigger: 'blur'}],
        taskType: [{required: true, message: '请选择测试类型', trigger: 'change'}],
        taskLevel: [{required: true, message: '请选择任务难度', trigger: 'change'}],
        devices: [{required: true, message: '请选择设备类型', trigger: 'change'}],
        categories: [{required: true, message: '请选择软件类型', trigger: 'change'}],
      },

      deleteConfirmVisible: false,
      taskDetailsVisible: false,
      taskDetails: {},
      updateTaskDialogVisible: false,
      updateTaskInfo: {
        name: "",
        brief: "",
        createTime: new Date(),
        deadlineTime: "",
        maxNumber: 1,
        taskType: "",
        taskState: TASKSTATE.UNRELEASED,
        taskLevel: "",
        devices: [],
        categories: [],
      },
    }
  },
  mounted() {
    this.initTaskList();
  },
  methods: {
    initTaskList() {
      this.getTaskList(1);
      // console.log(this.taskList);
    },
    getTaskList(page) {
      let payload = {
        page: page - 1,
        size: this.pageSize
      }
      getMyReleasedTasks(payload).then(res => {
            if (res.code === 1 && res.data !== null) {
              this.taskList = [];
              for (let i = 0; i < res.data.content.length; i++) {
                let temp = res.data.content[i];
                temp.createTime = dateParse(temp.createTime);
                temp.deadlineTime = dateParse(temp.deadlineTime);
                temp.taskType = TASKTYPE[temp.taskType].label;
                switch (res.data.content[i].taskState) {
                  case TASKSTATE.UNRELEASED:
                    temp.taskState = {
                      type: 'info',
                      label: "未发布",
                      value: res.data.content[i].taskState
                    }
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
                this.taskList.push(temp);
              }
              this.total = res.data.totalElements;
            } else {
              ElMessage.error("获取任务列表失败");
            }
          }
      )
    },
    changePage(val) {
      this.currentPage = val;
      this.getTaskList(val)
    },


    handleAddTask() {
      this.taskInfo = {
        name: "",
        brief: "",
        createTime: new Date(),
        deadlineTime: "",
        maxNumber: 1,
        taskType: "",
        taskState: TASKSTATE.UNRELEASED
      }
      this.descriptionFile = [];
      this.executableFile = [];
      this.addTaskDialogVisible = true;
    },
    handleCommitTask(state) {
      switch (state) {
        case 0:
          this.taskInfo.taskState = TASKSTATE.UNRELEASED;
          break;
        case 1:
          this.taskInfo.taskState = TASKSTATE.RELEASED;
          break;
        default:
          ElMessage.error("参数错误");
      }

      this.$refs.taskInfoRef.validate((valid, obj) => {
        if (valid) {
          let payload = new FormData();
          payload.append('taskVO', JSON.stringify(this.taskInfo));
          if (this.executableFile.length === 1) {
            this.$refs.uploadExecutableFile.submit();
            payload.append('exec', this.executableFile[0], this.executableFile[0].name);
          } else {
            ElMessage.error("请上传待测应用");
            return;
          }
          if (this.descriptionFile.length === 1) {
            this.$refs.uploadDescriptionFile.submit();
            payload.append('desc', this.descriptionFile[0], this.descriptionFile[0].name);
          } else {
            ElMessage.error("请上传描述文件");
            return;
          }
          console.log(payload);
          createTask(payload).then(res => {
            if (res.code === 1) {
              this.changePage(1);
              ElMessage.success("创建成功");
            } else {
              ElMessage.error("创建失败");
            }
            this.taskInfo = {
              name: "",
              brief: "",
              createTime: new Date(),
              deadlineTime: "",
              maxNumber: 1,
              taskType: "",
              taskState: TASKSTATE.UNRELEASED,
              taskLevel: "",
              devices: [],
              categories: [],
            }
            this.descriptionFile = [];
            this.executableFile = [];
          })
          this.addTaskDialogVisible = false;
        }
      })
    },
    showUpdateDialog() {
      this.updateTaskInfo = JSON.parse(JSON.stringify(this.taskDetails));
      this.updateTaskInfo.createTime = dateUnparse(this.updateTaskInfo.createTime);
      this.updateTaskInfo.deadlineTime = dateUnparse(this.updateTaskInfo.deadlineTime);
      switch (this.updateTaskInfo.taskType) {
        case TASKTYPE.BUG_EXPLORATION.label:
          this.updateTaskInfo.taskType = TASKTYPE.BUG_EXPLORATION.value
          break;
        case TASKTYPE.FUNCTION_TEST.label:
          this.updateTaskInfo.taskType = TASKTYPE.FUNCTION_TEST.value
          break;
        case TASKTYPE.PERFORMANCE_TEST.label:
          this.updateTaskInfo.taskType = TASKTYPE.PERFORMANCE_TEST.value
          break;
        case TASKTYPE.USE_CASE_DESIGN.label:
          this.updateTaskInfo.taskType = TASKTYPE.USE_CASE_DESIGN.value
          break;
        case TASKTYPE.USE_CASE_EXECUTION.label:
          this.updateTaskInfo.taskType = TASKTYPE.USE_CASE_EXECUTION.value
          break;
      }
      this.executableFile.shift();
      this.executableFile.push({name: this.updateTaskInfo.fileList[0].filename, oldFile: true});
      this.descriptionFile.shift();
      this.descriptionFile.push({name: this.updateTaskInfo.fileList[1].filename, oldFile: true});
      console.log(this.updateTaskInfo);
      this.taskDetailsVisible = false;
      this.updateTaskDialogVisible = true;
    }
    ,
    handleUpdateTask(state) {
      let canUpdate = false;
      switch (state) {
        case 0:
          // 暂存
          this.updateTaskInfo.taskState = TASKSTATE.UNRELEASED;
          this.$refs.updateTaskInfoRef.validate((valid, obj) => {
            canUpdate = valid;
          })
          break;
        case 1:
          // 修改后发布
          this.updateTaskInfo.taskState = TASKSTATE.RELEASED;
          this.$refs.updateTaskInfoRef.validate((valid, obj) => {
            canUpdate = valid;
          })
          break;
        case 3:
          // 不修改直接发布
          this.updateTaskInfo = JSON.parse(JSON.stringify(this.taskDetails));
          this.updateTaskInfo.createTime = dateUnparse(this.updateTaskInfo.createTime);
          this.updateTaskInfo.deadlineTime = dateUnparse(this.updateTaskInfo.deadlineTime);
          switch (this.updateTaskInfo.taskType) {
            case TASKTYPE.BUG_EXPLORATION.label:
              this.updateTaskInfo.taskType = TASKTYPE.BUG_EXPLORATION.value
              break;
            case TASKTYPE.FUNCTION_TEST.label:
              this.updateTaskInfo.taskType = TASKTYPE.FUNCTION_TEST.value
              break;
            case TASKTYPE.PERFORMANCE_TEST.label:
              this.updateTaskInfo.taskType = TASKTYPE.PERFORMANCE_TEST.value
              break;
            case TASKTYPE.USE_CASE_DESIGN.label:
              this.updateTaskInfo.taskType = TASKTYPE.USE_CASE_DESIGN.value
              break;
            case TASKTYPE.USE_CASE_EXECUTION.label:
              this.updateTaskInfo.taskType = TASKTYPE.USE_CASE_EXECUTION.value
              break;
          }
          this.executableFile.shift();
          this.executableFile.push({name: this.updateTaskInfo.fileList[0].filename, oldFile: true});
          this.descriptionFile.shift();
          this.descriptionFile.push({name: this.updateTaskInfo.fileList[1].filename, oldFile: true});
          this.updateTaskInfo.taskState = TASKSTATE.RELEASED;
          canUpdate = true;
          break;
        default:
          ElMessage.error("参数错误");
      }

      if (canUpdate) {
        let payload = new FormData();
        payload.append('taskVO', JSON.stringify(this.updateTaskInfo));
        console.log(this.executableFile.length)
        if (this.executableFile.length === 1) {
          console.log(this.executableFile[0].oldFile)
          if (this.executableFile[0].oldFile) {
            console.log("使用旧文件")
            payload.append('exec', "");
          } else {
            this.$refs.uploadExecutableFile.submit();
            payload.append('exec', this.executableFile[0], this.executableFile[0].name);
          }
        } else {
          if (state !== 3) {
            ElMessage.error("请上传待测应用");
            return;
          }
        }
        if (this.descriptionFile.length === 1) {
          if (this.descriptionFile[0].oldFile) {
            console.log("使用旧文件")
            payload.append('desc', "");
          } else {
            this.$refs.uploadDescriptionFile.submit();
            payload.append('desc', this.descriptionFile[0], this.descriptionFile[0].name);
          }
        } else {
          if (state !== 3) {
            ElMessage.error("请上传描述文件");
            return;
          }
        }
        // console.log(payload);
        // console.log(payload.get("exec"))
        // console.log(payload.get("desc"))
        // console.log(payload.get("taskVO"))
        updateTask(payload).then(res => {
          if (res.code === 1) {
            this.getTaskList(this.currentPage);
            ElMessage.success("修改成功");
          } else {
            ElMessage.error("修改失败");
          }
          this.taskInfo = {
            name: "",
            brief: "",
            createTime: new Date(),
            deadlineTime: "",
            maxNumber: 1,
            taskType: "",
            taskState: TASKSTATE.UNRELEASED,
            taskLevel: "",
            devices: [],
            categories: [],
          }
          this.descriptionFile = [];
          this.executableFile = [];
        })
        this.updateTaskDialogVisible = false;
        this.taskDetailsVisible = false;
      }
    },
    uploadExecutable(param) {
      this.executableFile.shift();
      this.executableFile.push(param.file);
      console.log(this.executableFile);
    },
    uploadDescription(param) {
      this.descriptionFile.shift();
      this.descriptionFile.push(param.file);
      console.log(this.descriptionFile);
    },
    changeExecutable(file, fileList) {
      this.executableFile = fileList;
      console.log(this.executableFile);
    },
    changeDescription(file, fileList) {
      this.descriptionFile = fileList;
      console.log(this.descriptionFile);
    },
    handleRemove(file, fileList, type) {
      if (type === 0) {
        this.executableFile = []
      } else if (type === 1) {
        this.descriptionFile = []
      }
    },

    handleShowDetails(index) {
      console.log(this.taskList[index]);
      this.taskDetails = this.taskList[index];
      this.taskDetailsVisible = true;
    },
    handleDeleteTask(index) {
      if (this.taskList[index].taskState.value === TASKSTATE.UNRELEASED) {
        ElMessageBox.confirm(
            '确认要删除该任务吗？',
            {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning',
            }
        ).then(() => {
          console.log(this.taskList[index]);
          let payload = new FormData();
          payload.append('tid', this.taskList[index].id);
          console.log(payload)
          deleteTask(payload).then(res => {
            if (res.code === 1) {
              ElMessage.success("删除成功！")
              this.getTaskList(this.currentPage);
            } else {
              ElMessage.error("删除失败！")
            }
          })
        }).catch(() => {

        })
      } else {
        ElMessage.warning("不可以删除已发布的任务！")
      }
    }
    ,
    handleShowReportsOrWorkers(index, path) {
      if (this.taskList[index].taskState.value === TASKSTATE.UNRELEASED) {
        ElMessage.warning("任务还未发布！")
      } else {
        this.$router.push(path);
      }
    }
  }
}
</script>

<style scoped>

.task-container {
  margin: 10px 10px;
  width: 279px;
  height: 186px;
  display: flex;
  justify-content: center;
}

.empty {
  width: 100%;
}

.task-card {
  width: 270px;
  height: 180px;
}

.task-card:hover {
  width: 279px;
  height: 186px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.5);
}

.task-card-body {
  height: 160px;
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

.add-card {
  width: 100%;
  height: 143px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.add-btn {
  width: 3vw;
  height: 3vw;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background-color: #409EFF;
  border-radius: 50%;
  cursor: pointer;
}

.add-btn:active {
  background-color: #3d96f1;
}

.add-btn-container {
  float: right;
}


/* task-card内部样式 */
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
  margin-bottom: 7px;
  color: #909399;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
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

<style>

.el-dialog__title {
  font-weight: bold;
}

.el-descriptions__body .el-descriptions__table .el-descriptions__cell {
  white-space: pre-wrap;
}
</style>