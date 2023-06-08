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
const encryptMD5 = (value) => {
    if (value) {
        return CryptoJS.MD5(String(value)).toString().toUpperCase();
    } else {
        return "";
    }
};
const encryptBase64 = (value) => {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(value));
};
const decryptBase64 = (value) => {
    return CryptoJS.enc.Base64.parse(value).toString(CryptoJS.enc.Utf8);
};
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
    // AES加密
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
