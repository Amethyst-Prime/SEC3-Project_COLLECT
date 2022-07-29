import {REPORT_MODULE, TASK_MODULE} from "./_prefix";
import request from "@/utils/request";

/**
 * 获取单个任务信息 GET /task/{tid}
 * @param {*} tid
 * @returns
 */
export const getTask = tid => {
    console.log(tid);
    return request.get(`${TASK_MODULE}/get_task/${tid}`).then(res => {
        return res.data;
    });
}

/**
 * 获取所有任务
 * @param {{page: number, size: number}} payload page: 页数（从0开始）, size 页面大小
 * @returns
 */
export const getAllTasks = (payload) => {
    let {page, size} = payload;
    return request.post(`${TASK_MODULE}/get_tasks?page=${page}&size=${size}`).then(res => {
        return res.data;
    })
}
/**
 * 获取已发布的任务
 * @param {{page: number, size: number}} payload page: 页数（从0开始）, size 页面大小
 * @returns
 */
export const getReleasedTasks = (payload) => {
    let {page, size} = payload;
    return request.post(`${TASK_MODULE}/get_released?page=${page}&size=${size}`).then(res => {
        return res.data;
    })
}
/**
 * 获取未参加的任务
 * @param {{page: number, size: number}} payload page: 页数（从0开始）, size 页面大小
 * @returns
 */
export const getUnjoinedTasks = (payload) => {
    let {page, size} = payload;
    return request.post(`${TASK_MODULE}/get_w_unjoined?page=${page}&size=${size}`).then(res => {
        return res.data;
    })
}
/**
 * 获取历史完成的任务
 * @param {{page: number, size: number}} payload page: 页数（从0开始）, size 页面大小
 * @returns
 */
export const getHistoryTasks = (payload) => {
    let {page, size} = payload;
    return request.post(`${TASK_MODULE}/get_history?page=${page}&size=${size}`).then(res => {
        return res.data;
    })
}

export const getRecommendTask=()=>{
    return request.get(`${TASK_MODULE}/recommend`).then(res=>{
        return res.data;
    })
}


export const getworkerAllTasks = (payload) => {
    let {page, size} = payload;
    return request.post(`${TASK_MODULE}/get_wtasks?page=${page}&size=${size}`).then(res => {
        return res.data;
    })
}

/**
 * 获取我（发包方）发布的任务
 * @param {{page: number, size: number}} payload 页数（从0开始）, size 页面大小
 * @returns
 */
export const getMyReleasedTasks = (payload) => {
    let {page, size} = payload;
    return request.post(`${TASK_MODULE}/get_dtasks?page=${page}&size=${size}`).then(res => {
        return res.data;
    })
}

/**
 * 创建任务
 * @param {*} payload
 * @returns
 */
export const createTask = payload => {
    return request.post(`${TASK_MODULE}/create_task`, payload).then(res => {
        return res.data;
    })
}
/**
 *接受任务
 */
export const acceptTask = payload => {
    return request.post(`${TASK_MODULE}/accept_task`, payload).then(res => {
        return res.data;
    });
}

export const getWorkers = tid => {
    return request.get(`${TASK_MODULE}/get_workers/${tid}`).then(res => {
        return res.data;
    })
}


export const deleteTask = payload => {
    return request.post(`${TASK_MODULE}/delete_task`, payload).then(res => {
        return res.data;
    })
}

export const updateTask = payload => {
    return request.post(`${TASK_MODULE}/edit_task`, payload).then(res => {
        return res.data;
    })
}

/**
 * 获取当前任务报告的融合报告
 * @param tid
 * @returns
 */
export const getMergedTasks=(tid)=>{
    return request.post(`${TASK_MODULE}/getMergedTasks`, tid).then(res=>{
        return res.data;
    })
}
/**
 * 融合当前任务的报告
 * @param tid
 * @returns
 */
export const mergeReport=(tid)=>{
    return request.post(`${TASK_MODULE}/mergeReport`, tid).then(res=>{
        return res.data;
    })
}