import __Zo, {_Cookie, _Session, _Storage} from "zo";

/**
 * ## 「引擎」`Ux.storeApp`
 *
 * 首页一般会读取相关的应用数据，然后将应用存储到 localStorage 中，存储的数值包括：
 *
 * * App本身数据的存储。
 * * `X-App-Id`的存储。
 * * `X-Sigma`的存储。
 * * 如果开启了 isKey = true，则存储`X-App-Key`。
 *
 * @memberOf module:store/zodiac
 * @param {Object} data 传入的应用数据。
 * @param {boolean} isKey 是否存储 appKey。
 * @return {any} 返回应用数据。
 */
const storeApp = (data, isKey = false) =>
    __Zo.storeApp(data, isKey);
/**
 * ## 「引擎」`Ux.storeModule`
 *
 * 模块化存储数据到 KEY_APP 中，存储位置为 `configKey`，如果是多个模块则
 * 直接存储多个模块中的配置数据信息，如
 *
 * mIso = {}
 * mHotel = {}
 * mIoT = {}
 *
 * @memberOf module:store/zodiac
 * @param {Object} data 传入的模块配置数据。
 * @param {String} configKey 模块专用 key 值，配置在 uiConfig 中的 `store` 字段中
 * @return {any} 返回存储的模块配置数据。
 */
const storeModule = (data, configKey) =>
    __Zo.storeModule(data, configKey);
/**
 * ## 「引擎」`Ux.storeUser`
 *
 * 登录过后存储用户的专用方法，存储当前用户数据到 sessionStorage 中。
 *
 * @memberOf module:store/zodiac
 * @param {Object} data 被存储的用户数据。
 * @return {any} 返回存储好的数据。
 */
const storeUser = (data) =>
    __Zo.storeUser(data);

export default {
    Cookie: _Cookie,
    Session: _Session,
    Storage: _Storage,
    storeApp,
    storeModule,
    storeUser
};
