import {FILE_MODULE} from "@/api/_prefix";
import config from '@/config'
import request from "@/utils/request";
import resolve from "resolve";


const baseUrl = config.mock ? config.mockApi : config.baseApi
export const uploadUrl = `${baseUrl}${FILE_MODULE}/upload`;
export const ImgBaseUrl = 'http://114.212.101.141:8092';
export const uploadImgUrl = `${ImgBaseUrl}/upload_img`;
export const deleteImgUrl = `${ImgBaseUrl}/delete_img`;

export const appDownload = payload => {
    return request.post(`${FILE_MODULE}/download`, payload, {responseType: 'blob'}).then(response => {
        let disposition = response.headers["content-disposition"];
        let fileName = disposition.substring(disposition.indexOf("=") + 1);
        console.log(fileName)
        resolve(response.data)
        let blob = new Blob([response.data])
        if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, fileName)
        } else {
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = fileName
            link.click()
            window.URL.revokeObjectURL(link.href)
        }
    })
}

export const deleteImg = filename => {
    return request.post(deleteImgUrl, filename).then(res => {
        return res.data;
    })
}

