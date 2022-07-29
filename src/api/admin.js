import {ADMIN_MODULE} from "@/api/_prefix";
import request from "@/utils/request";

export const getRecConf = () => {
    return request.get(`${ADMIN_MODULE}/get_rec`).then(res => {
        return res.data;
    })
}
export const setRecConf = payload => {
    return request.post(`${ADMIN_MODULE}/set_rec`, payload).then(res => {
        return res.data;
    })
}
export const getSimConf = () => {
    return request.get(`${ADMIN_MODULE}/get_report`).then(res => {
        return res.data;
    })
}
export const setSimConf = payload => {
    return request.post(`${ADMIN_MODULE}/set_report`, payload).then(res => {
        return res.data;
    })
}