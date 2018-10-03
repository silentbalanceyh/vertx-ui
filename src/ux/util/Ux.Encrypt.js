import CryptoJS from 'crypto-js';

const _toInt64Bytes = (x) => {
    const bytes = [];
    for (let i = 7; i >= 0; i--) {
        bytes[i] = x & 0xff;
        x = x >> 8;
    }
    return bytes;
};

const _toHexStr = (bytes) => {
    let hex = [];
    for (let i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
    }
    return hex.join("");
};
/**
 * MD5加密函数，针对value进行MD5加密（全大小）
 * @method encryptMD5
 * @param value 被加密字符串
 * @return {String}
 */
const encryptMD5 = (value) => {
    if (value) {
        return CryptoJS.MD5(String(value)).toString().toUpperCase();
    } else {
        return "";
    }
};
/**
 * Base64编码函数，针对value进行Base64编码
 * @method encryptBase64
 * @param value 被编码字符串
 * @return {String}
 */
const encryptBase64 = (value) => {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(value));
};
/**
 * Base64解码函数，针对value进行Base64解码
 * @method decryptBase64
 * @param value 被解码字符串
 * @return {String}
 */
const decryptBase64 = (value) => {
    return CryptoJS.enc.Base64.parse(value).toString(CryptoJS.enc.Utf8);
};
/**
 * 数字签名专用Hmac512算法加密，针对value和secret一起进行Hmac512数字签名加密
 * @method encryptHmac512
 * @param value 被签名字符串
 * @param secret 随机密钥
 * @return {String}
 */
const encryptHmac512 = (value, secret) => {
    const raw = CryptoJS.HmacSHA512(value, secret);
    const wordArr = raw.words;
    let retVal = "";
    for (let idx = 0; idx < wordArr.length; idx++) {
        const bytes = _toInt64Bytes(wordArr[idx]);
        const hexStr = _toHexStr(bytes);
        // 读取低8位
        retVal += hexStr.toUpperCase().substring(8, 16);
    }
    return retVal;
};
/**
 * @class Encrypt
 * @description 加密、编码、解码函数
 */
export default {
    // MD5加密
    encryptMD5,
    // Base64加密
    encryptBase64,
    // Base64解密
    decryptBase64,
    // SHA512签名
    encryptHmac512
};
