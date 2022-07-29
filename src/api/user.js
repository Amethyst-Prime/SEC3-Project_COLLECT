import {USER_MODULE} from "./_prefix";
import request from "@/utils/request";


/**
 *  用户注册 POST /user/register
 * @param {*} payload
 * @returns
 */
export const register = payload => {
    return request.post(`${USER_MODULE}/register`, payload).then(res => {
        return res.data;
    });
}

/**
 *  用户登录 POST /user/login
 * @param {*} payload
 * @returns
 */
export const login = payload => {
    return request.post(`${USER_MODULE}/login`, payload).then(res => {
        return res.data;
    });
};

/**
 *  获取用户 GET /user/{uid}
 * @param {*} uid
 * @returns
 */
export const getUser = uid => {
    // console.log(uid);
    return request.get(`${USER_MODULE}/${uid}`).then(res => {
        return res.data;
    });
};