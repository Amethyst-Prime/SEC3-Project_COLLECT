/**
 * 通用工具函数
 */

import CryptoJS from 'crypto-js'

const secretKey = "Y29kaW5ncm91cDI2NDI2NA=="; // codingroup264264的base64编码
let key = CryptoJS.enc.Base64.parse(secretKey)

function encrypt(msg, key, iv) {
    return CryptoJS.AES.encrypt(msg, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
}


function decrypt(cipherText, key, iv) {
    return CryptoJS.AES.decrypt({ciphertext: cipherText}, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
}

/**
 * 密码加密
 * @param password
 * @return string
 */
export const hashPassword = (password) => {
    // console.log(key)
    return encrypt(password, key, key).ciphertext.toString();
}

/**
 * 密码验证
 * @param password
 * @param hashedPassword
 * @return boolean
 */
export const checkPassword = (password, hashedPassword) => {
    let cipherTextHexStr = CryptoJS.enc.Hex.parse(hashedPassword);
    // let cipherTextBase64Str = CryptoJS.enc.Base64.stringify(cipherTextHexStr);
    let decrypted = decrypt(cipherTextHexStr, key, key);
    // console.log(decrypted.toString(CryptoJS.enc.Utf8));
    return password === decrypted.toString(CryptoJS.enc.Utf8)
}

/**
 * 字母头像
 * @param text
 * @return string
 */
export const letter_avatar = text => {
    const bg = `rgb(${rn(150, 200)},${rn(150, 200)},${rn(150, 200)})`;
    const w = 20;
    const h = 20;

    const can = document.createElement("canvas");
    can.width = w;
    can.height = h;
    const _ctxt = can.getContext("2d");
    _ctxt.fillStyle = bg;
    _ctxt.fillRect(0, 0, w, h);
    _ctxt.font = "bold 15px 苹方";
    _ctxt.fillStyle = `rgb(${rn(80, 150)},${rn(80, 150)},${rn(80, 150)})`;
    _ctxt.textAlign = "center";
    _ctxt.textBaseline = "middle";
    _ctxt.fillText(text.substring(0, 1).toUpperCase(), w / 2, h / 2 + 1);
    return can.toDataURL();
}

function rn(min, max) {
    return parseInt(Math.random() * (max - min) + min);
}

// 将时间字符串转为年月日格式
export const dateParse = dateStr => {
    let date = new Date(Date.parse(dateStr));
    return "" + date.getFullYear() + "年" + ("00" + (date.getMonth() + 1)).substr(-2) + "月" + ("00" + date.getDate()).substr(-2) + "日"
}

// 将年月日格式转为时间字符串
export const dateUnparse = dateStr => {
    let date = dateStr.replace("年", "/").replace("月", "/").replace("日", "/");
    return new Date(date);
}