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
 * ## 标准函数
 *
 * MD5加密函数，针对value进行MD5加密，加密过后的密文全部转换成大写。
 *
 * @memberOf module:_encrypt
 * @param {String} value 被加密字符串。
 * @return {String} 加密过后的密文。
 */
const encryptMD5 = (value) => {
    if (value) {
        return CryptoJS.MD5(String(value)).toString().toUpperCase();
    } else {
        return "";
    }
};
/**
 * ## 标准函数
 *
 * Base64编码函数，针对value进行Base64编码，生成Base64的密文。
 *
 * @memberOf module:_encrypt
 * @param {String} value 被编码字符串。
 * @return {String} 编码好的Base64的字符串。
 */
const encryptBase64 = (value) => {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(value));
};
/**
 * ## 标准函数
 *
 * Base64解码函数，针对value进行Base64解码。
 *
 * @memberOf module:_encrypt
 * @param {String} value 已经被编码过的Base64字符串。
 * @return {String} 解码过后的明文。
 */
const decryptBase64 = (value) => {
    return CryptoJS.enc.Base64.parse(value).toString(CryptoJS.enc.Utf8);
};
/**
 * ## 标准函数
 *
 * 数字签名专用Hmac512算法加密，针对value和secret一起进行Hmac512数字签名加密。
 *
 * @memberOf module:_encrypt
 * @param {String} value 待执行签名的字符串，一般是明文。
 * @param {String} secret 密钥信息，和当前被签名的客户端绑定。
 * @return {String} 签名的最终信息，生成的 sig 值。
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
const encryptAES = (value, secret) => {
    return CryptoJS.AES.encrypt(
        CryptoJS.enc.Utf8.parse(value),
        CryptoJS.enc.Utf8.parse(secret), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString();
};
export default {
    encryptAES,
    // MD5加密
    encryptMD5,
    // Base64加密
    encryptBase64,
    // Base64解密
    decryptBase64,
    // SHA512签名
    encryptHmac512
};
