import __Zn from 'zone';


/**
 * ## 「标准」`Ux.encryptMD5`
 *
 * MD5加密函数，针对value进行MD5加密，加密过后的密文全部转换成大写。
 *
 * @memberOf module:crypto/zone
 * @param {String} value 被加密字符串。
 * @return {String} 加密过后的密文。
 */
const encryptMD5 = (value) => __Zn.encryptMD5(value);


/**
 * ## 「标准」`Ux.encryptBase64`
 *
 * Base64编码函数，针对value进行Base64编码，生成Base64的密文。
 *
 * @memberOf module:crypto/zone
 * @param {String} value 被编码字符串。
 * @return {String} 编码好的Base64的字符串。
 */
const encryptBase64 = (value) => __Zn.encryptBase64(value);


/**
 * ## 「标准」`Ux.decryptBase64`
 *
 * Base64解码函数，针对value进行Base64解码。
 *
 * @memberOf module:crypto/zone
 * @param {String} value 已经被编码过的Base64字符串。
 * @return {String} 解码过后的明文。
 */
const decryptBase64 = (value) => __Zn.decryptBase64(value);


/**
 * ## 「标准」`Ux.encryptHmac512`
 *
 * 数字签名专用Hmac512算法加密，针对value和secret一起进行Hmac512数字签名加密。
 *
 * @memberOf module:crypto/zone
 * @param {String} value 待执行签名的字符串，一般是明文。
 * @param {String} secret 密钥信息，和当前被签名的客户端绑定。
 * @return {String} 签名的最终信息，生成的 sig 值。
 */
const encryptHmac512 = (value, secret) => __Zn.encryptHmac512(value, secret);


/**
 * ## 「标准」`Ux.encryptAES`
 *
 * 使用AES算法加密，对value和secret进行AES加密操作
 *
 * @memberOf module:crypto/zone
 * @param {String} value 执行签名的字符串，一般是明文
 * @param {String} secret 密钥信息，和当前被签名的客户端绑定。
 * @return {String} 执行加密过后的最终值。
 */
const encryptAES = (value, secret) => __Zn.encryptAES(value, secret);

// eslint-disable-next-line import/no-anonymous-default-export
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
