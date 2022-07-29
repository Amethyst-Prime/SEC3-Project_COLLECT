import {REPORT_MODULE} from "@/api/_prefix";
import request from "@/utils/request";

/**
 * 获取当前任务报告的树结构
 * @param tid
 * @returns
 */
export const getReportTree = (tid) => {
    return request.post(`${REPORT_MODULE}/report_tree`, tid).then(res => {
        return res.data;
    })
}


/**
 * 评分
 * @param {{comment:stirng,rid:*,score:int}}
 * @returns
 */

export const scoreReport = payload => {
    return request.post(`${REPORT_MODULE}/score`, payload).then(res => {
        return res.data;
    })
}


/**
 * 获取当前任务的报告
 * @param {{page: number, size: number, tid: *}} payload 页数（从0开始）, size 页面大小
 * @returns
 */
export const getReports = payload => {
    return request.post(`${REPORT_MODULE}/get_task_reports`, payload).then(res => {
        return res.data;
    })
}
/**
 * 获取我提交的报告
 * @param {FormData}tid
 * @returns
 */
export const getMyReports = tid => {
    return request.post(`${REPORT_MODULE}/get_w_task_reports`, tid).then(res => {
        return res.data;
    })
}


export const getComments = rid => {
    return request.post(`${REPORT_MODULE}/getDO`, rid).then(res => {
        return res.data;
    })
}
export const getReportSimilarity = tid => {
    return request.post(`${REPORT_MODULE}/getReportSimilarity`, tid).then(res => {
        return res.data;
    })
}

export const getReportByID = rid => {
    return request.post(`${REPORT_MODULE}/get`, rid).then(res => {
        return res.data;
    })
}


export const submitReport = (payload, reportVO, tid) => {
    let {hasChanged, rid, uuid} = payload;
    return request.post(`${REPORT_MODULE}/create/${tid}?hasChanged=${hasChanged}&rid=${rid}&uuid=${uuid}`, reportVO).then(res => {
        return res.data;
    })
}

export const editReports = (payload) => {
    return request.post(`${REPORT_MODULE}/edit`, payload).then(res => {
        return res.data;
    })
}

export const getSimilarity = tid => {
    return request.post(`${REPORT_MODULE}/getReportSimilarity`, tid).then(res => {
        return res.data;
    })
}