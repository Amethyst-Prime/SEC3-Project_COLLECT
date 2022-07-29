/**
 * axios 封装
 */
import axios from "axios";
import config from './../config'
import {ElMessage} from "element-plus";
import storage from "@/utils/storage";
import {diffTokenTime} from "@/utils/auth";

// 全局配置
const service = axios.create({
    baseURL: config.baseApi,
    timeout: 8000,
})

// // 请求拦截
// service.interceptors.request.use(req => {
//     return req;
// })


// // 响应拦截
// service.interceptors.response.use(res => {
//     const {code, data, msg} = res.data;
//     if (code === 0) {
//         return data;
//     } else {
//         // TODO 未登录等其他处理
//         ElMessage.error(msg);
//         return msg;
//     }
// })

/**
 * 请求函数
 * @param {*} options 请求配置
 */
function request(options) {
    const whiteList = ['/api/user/login', '/api/user/register', '/api/task/get_tasks']
    options.method = options.method || 'get';
    if (options.method.toLowerCase() === 'get') {
        options.params = options.data;
    }

    // 添加token
    console.log(options.url)
    if (!whiteList.includes(options.url.split("?")[0])) {
        if (storage.getItem("token")) {
            if (diffTokenTime()) {
                storage.clearAll();
                ElMessage.error("Token已过期，请重新登录！");
                setTimeout(() => {
                    this.$router.replace("/login").then(r => r);
                }, 2000);
            }
            options["headers"] = {
                token: storage.getItem("token").toString()
            }
        } else {
            ElMessage.error("账号异常，请重新登录!");
            return Promise.reject(new Error("账号异常"));
        }
    }

    // 判断使用mock接口还是真实后端接口
    if (config.env === 'prod') {
        service.defaults.baseURL = config.baseApi;
    } else {
        service.defaults.baseURL = config.mock ? config.mockApi : config.baseApi;
    }
    // console.log(options)
    // debugger
    return service(options).catch(err => {
        ElMessage.error(err.toString());
    });
}

// 为request函数添加get/post等调用方法
['get', 'post', 'put', 'delete', 'patch'].forEach(item => {
    request[item] = (url, data, options) => {
        return request({
            url,
            data,
            method: item,
            ...options
        })
    }
})

export default request;