import {createRouter, createWebHistory} from 'vue-router'
import storage from "@/utils/storage";
import {diffTokenTime} from "@/utils/auth";
import {ElMessage} from "element-plus";
import {USERROLE} from "@/utils/constant";


import Login from "../views/Login";
import Register from "../views/Register";
import Frame from "@/components/Frame";
import Home from "../views/Home";

import DInfo from "@/views/Distributor/Info";
import DTaskList from "@/views/Distributor/TaskList";
import TaskReports from "@/views/Distributor/TaskReports";
import TaskWorkers from "@/views/Distributor/TaskWorkers";
import ReportDetails from "@/views/Distributor/ReportDetails";
import DAllTask from "@/views/Distributor/AllTask";

import WInfo from "@/views/Worker/Info";
import WTaskList from "@/views/Worker/TaskList";
import CurrentTask from "@/views/Worker/CurrentTask";
import HistoryTask from "@/views/Worker/HistoryTask";
import WReportDetails from '@/views/Worker/ReportDetails'
import MyReports from "@/views/Worker/MyReports";

import AInfo from "@/views/Admin/Info";
import ATaskList from "@/views/Admin/TaskList";
import Setting from "@/views/Admin/Setting";



const routes = [
    {
        path: '/',
        name: 'frame',
        component: Frame,
        redirect: "/index",
        children: [
            {
                path: '/index',
                name: 'Home',
                component: Home,
                meta: {
                    label: "首页"
                }
            },
            {
                path: '/wInfo',
                name: 'winfo',
                component: WInfo,
                meta: {
                    label: "个人信息"
                }
            },
            {
                path: '/dInfo',
                name: 'dinfo',
                component: DInfo,
                meta: {
                    label: "个人信息"
                }
            },
            {
                path: '/aInfo',
                name: 'ainfo',
                component: AInfo,
                meta: {
                    label: "个人信息"
                }
            },
            {
                path: '/dTaskList',
                name: 'dtaskList',
                component: DTaskList,
                meta: {
                    label: "我的发布"
                }
            },
            {
                path: '/dAllTask',
                name: 'dAllTask',
                component: DAllTask,
                meta: {
                    label: "任务广场"
                }
            },
            {
                path: '/dTaskList/taskReports',
                name: 'taskReports',
                component: TaskReports,
                meta: {
                    label: "我的发布/报告列表",
                    needQuery: true
                }
            },
            {
                path: '/dTaskList/taskReports/reportDetails',
                name: 'dreportDetails',
                component: ReportDetails,
                meta: {
                    label: "我的发布/报告列表/报告详情",
                    needQuery: true
                }
            },
            {
                path: '/dTaskList/taskWorkers',
                name: 'taskWorkers',
                component: TaskWorkers,
                meta: {
                    label: "我的发布/参与人员"
                }
            },
            {
                path: '/wTaskList',
                name: 'wtaskList',
                component: WTaskList,
                meta: {
                    label: "任务广场"
                }
            },
            {
                path: '/aTaskList',
                name: 'aTaskList',
                component: ATaskList,
                meta: {
                    label: "所有任务"
                }
            },
            {
                path: '/setting',
                name: 'setting',
                component: Setting,
                meta: {
                    label: "推荐规则"
                }
            },
            {
                path: '/currentTask',
                name: 'currentTask',
                component: CurrentTask,
                meta: {
                    label: "正在执行"
                }
            },
            {
                path: '/currentTask/myReports',
                name: 'myReports',
                component: MyReports,
                meta: {
                    label: "正在执行/查看报告"
                }
            },
            {
                path: '/currentTask/myReports/reportDetails',
                name: 'reportDetails',
                component: WReportDetails,
                meta: {
                    label: "正在执行/查看报告/报告详情"
                }
            },
            {
                path: '/historyTask',
                name: 'historyTask',
                component: HistoryTask,
                meta: {
                    label: "历史任务"
                }
            },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            label: "首页"
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {
            label: "首页"
        }
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes
})

const whiteList = ['login', 'register', 'index']
const workerList = ['wInfo', 'wTaskList', 'currentTask', 'historyTask']
const distributorList = ['dInfo', 'dTaskList', 'dAllTask']
router.beforeEach((to, from, next) => {
    if (storage.getItem("token")) {
        if (diffTokenTime()) {
            storage.clearAll();
            ElMessage.error("Token已过期，请重新登录！");
            next('/login');
        } else {
            // 判断角色，若该路径不允许当前角色访问，则跳转到首页
            if ((whiteList.includes(to.path.split('/')[1])) ||
                ((storage.getItem('userInfo') ? storage.getItem('userInfo').userRole : "") === USERROLE.ADMIN) ||
                (workerList.includes(to.path.split('/')[1]) && (storage.getItem('userInfo') ? storage.getItem('userInfo').userRole : "") === USERROLE.WORKER) ||
                (distributorList.includes(to.path.split('/')[1]) && (storage.getItem('userInfo') ? storage.getItem('userInfo').userRole : "") === USERROLE.DISTRIBUTOR)) {
                next()
            } else {
                ElMessage.error("请确认您的角色！");
                next('/');
            }

        }
    } else {
        // 白名单页面不进行验证
        if (whiteList.includes(to.path.split("/")[1])) {
            next();
        } else {
            ElMessage.error("请登录！")
            setTimeout(() => {
                next('/login')
            }, 500)

        }
    }
})

export default router