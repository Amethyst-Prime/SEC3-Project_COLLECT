import {LOG_MODULE} from "@/api/_prefix";
import request from "@/utils/request";

export const sendLog = (operation, taskTagVO, device = null) => {
    let log = {
        timestamp: new Date().getTime(),
        device,
        operation,
        taskTagVO
    }
    return request.post(`${LOG_MODULE}/worker`, log).then(res => {
        console.log(res.data);
    })
}