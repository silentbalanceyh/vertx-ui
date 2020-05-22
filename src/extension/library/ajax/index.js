import _application from './application';
import _oauth from './oauth';
import _form from './form';
import _employee from './employee';
import _datum from './datum';
import _ui from './ui';
import _todo from './todo';
import _job from './job';
import _relation from './relation';
import _model from './model';

/**
 * ## 接口专用类
 *
 * 调用方式：
 *
 * ```js
 * import Ex from 'ex';
 *
 * Ex.I.application().then(response => {
 *
 * })
 * ```
 *
 * 安全接口带Token，非安全接口不带Token，统一调用 Zero Extension中的特殊接口。
 *
 * @class I
 */
class I {
    /**
     * ## 接口函数
     *
     * 读取单个模型的属性信息
     *
     * * 接口：`/api/model/identifier/:identifier`（GET）
     * * 安全：是
     *
     * @async
     * @param {String} identifier 模型标识符
     * @returns {Promise<T>} 返回Promise。
     */
    static attributes(identifier) {
        return _model.attributes(identifier);
    }

    /**
     * ## 接口函数
     *
     * * 接口：`/app/name/:name`（GET）
     * * 安全：否
     *
     * @async
     * @param {Function} failure 容错专用函数。
     * @returns {Promise<T>} 返回Promise。
     */
    static app(failure) {
        return _application.app(failure);
    }

    /**
     * ## 接口函数
     *
     * * 接口：`/api/app`（GET）
     * * 安全：是
     *
     * 这个方法会执行校验：
     *
     * 1. 系统调用`Ux.isInit()`方法读取应用信息，如果应用信息不存在则直接抛出异常。
     * 2. 如果拥有应用信息，并且该应用包含了`appKey`数据，则直接从缓存中读取数据。
     * 3. 如果没有包含`appKey`，则只证明执行了第一次初始化，需要再次读取（敏感信息）。
     *
     * @async
     * @returns {Promise<T>} 返回Promise。
     */
    static application() {
        return _application.application();
    }

    /**
     * ## 接口函数
     *
     * * 接口：`/api/menus`（GET）
     * * 安全：是
     *
     * 登录过后根据`Ux.isInit()`的应用信息返回当前应用的所有菜单数据，应用数据存储在
     * `X_APP`表中，包含`X_SOURCE`的数据源信息，菜单数据存储在`X_MENU`表中。
     *
     * @async
     * @returns {Promise<T>} 返回Promise。
     */
    static menus() {
        return _application.menus();
    }

    /**
     * ## 接口函数
     *
     * * 接口：`/api/module?entry={entry}`（GET）
     * * 安全：是
     *
     * 根据当前路由路径读取`X_MODULE`中的模块配置信息，该模块的配置信息和`Cab.json`中绑定
     * 的资源文件合并生成当前模块的所有配置信息。
     *
     * @async
     * @param {String} uri 当前模块的入口信息。
     * @returns {Promise<T>} 返回Promise。
     */
    static module(uri = "") {
        return _application.module(uri);
    }

    /**
     * ## 接口函数
     *
     * * 接口
     *      * 应用接口：`/api/app`（GET）
     *      * 菜单数据：`/api/menus`（GET）
     * * 安全：是
     *
     * 该接口为登录过后的主页调用的专用初始化接口，主要执行两个操作：
     *
     * 1. 执行 `X_APP` 的全配置信息（包括敏感信息，appKey）。
     * 2. 执行 `X_MENU` 的全配置信息（只读取当前菜单）。
     *
     * @async
     * @returns {Promise<T>} 返回Promise。
     */
    static inited() {
        return _application.inited();
    }

    /**
     * ## 接口函数
     *
     * * 接口：`/oauth/login`（POST）
     * * 安全：否
     *
     * 登录入口专用，请求数据如：
     *
     * ```json
     * {
     *     "username": "登录账号",
     *     "password": "MD5加密过后的密码"
     * }
     * ```
     *
     * @async
     * @param {Object} request 登录专用请求。
     * @returns {Promise<T>} 返回Promise。
     */
    static login(request = {}) {
        return _oauth.login(request);
    }

    /**
     * ## 接口函数
     *
     * * 接口：`/oauth/authorize`（POST）
     * * 安全：否
     *
     * 申请临时码专用方法：
     *
     * ```json
     * {
     *     "client_id": "客户ID",
     *     "client_secret": "客户账号颁布的密钥",
     *     "response_type": "code",
     *     "scope": "应用的域"
     * }
     * ```
     *
     * @async
     * @param {Object} request 临时码申请请求。
     * @returns {Promise<T>} 返回Promise。
     */
    static authorize(request = {}) {
        return _oauth.authorize(request);
    }

    /**
     * ## 接口函数
     *
     * * 接口：`/oauth/token`（POST）
     * * 安全：否
     *
     * 请求格式
     *
     * ```json
     * {
     *     "client_id": "客户ID",
     *     "code": "临时验证码"
     * }
     * ```
     *
     * @async
     * @param {Object} request 交换令牌专用请求。
     * @returns {Promise<T>} 返回Promise。
     */
    static token(request = {}) {
        return _oauth.token(request);
    }

    /**
     * ## 接口函数
     *
     * * 接口：`/api/user/logout`（POST）
     * * 安全：否
     *
     * 注销登出专用接口
     *
     * @async
     * @returns {Promise<T>} 返回Promise。
     */
    static logout() {
        return _oauth.logout();
    }

    /**
     * ## 接口函数
     *
     * * 接口：`/api/ui/form/:code`（GET）
     * * 安全：是
     *
     * 读取表单专用配置接口。
     *
     * @async
     * @param {Object} params 表单请求，包含表单的`code`。
     * @returns {Promise<T>} 返回Promise。
     */
    static form(params = {}) {
        return _form.form(params);
    }

    /**
     * ## 接口函数
     *
     * * 接口：`/api/ui/forms/:identifier`（GET）
     * * 安全：是
     *
     * 读取模型下的表单配置信息。
     *
     * @async
     * @param {String} identifier 模型统一标识符。
     * @returns {Promise<T>} 返回Promise
     */
    static forms(identifier) {
        return _form.forms(identifier)
    }

    /**
     * ## 接口函数
     *
     * * 接口：`/api/ui/lists/:identifier`（GET）
     * * 安全：是
     *
     * 读取模型下的所有列表配置信息
     *
     * @async
     * @param {String} identifier 模型统一标识符。
     * @returns {Promise<T>} 返回Promise
     */
    static lists(identifier) {
        return _form.lists(identifier)
    }

    /**
     * ## 接口函数
     *
     * * 接口：`/api/form/actions`（POST）
     * * 安全：是
     *
     * ```json
     * {
     *     "control": "控件ID，对应 UI_FORM 中的 CONTROL_ID",
     *     "name": "表单名称",
     *     "op": []
     * }
     * ```
     *
     * @async
     * @param {Object} params 读取表单中的action专用方法。
     * @returns {Promise<T>} 返回Promise。
     */
    static action(params = {}) {
        return _form.action(params);
    }

    /**
     * ## 接口函数
     *
     * * 接口：`/api/user`（GET）
     * * 安全：是
     *
     * 读取当前登录用户的基本信息。
     *
     * @async
     * @returns {Promise<T>} 返回Promise。
     */
    static user() {
        return _employee.user();
    }

    /**
     * ## 接口函数
     *
     * * 接口：`/api/company/employee/:eid`（GET）
     * * 安全：是
     *
     * 读取当前用户中关联的`employeeId`员工主键，然后根据员工主键读取员工信息。
     *
     * @async
     * @returns {Promise<T>} 返回Promise。
     */
    static company() {
        return _employee.company();
    }

    /**
     * ## 接口函数
     *
     * * 接口：`/api/user/password`（POST）
     * * 安全：是
     *
     * 更新用户登录密码。
     *
     * @async
     * @param {Object} params 更新密码所用的请求。
     * @returns {Promise<T>} 返回Promise。
     */
    static password(params = {}) {
        return _employee.password(params);
    }

    /**
     * ## 接口函数
     *
     * * 接口：`/api/user/profile`（POST）
     * * 安全：是
     *
     * 更新用户信息。
     *
     * @async
     * @param {Object} params 更新账号专用请求。
     * @returns {Promise<T>} 返回Promise。
     */
    static profile(params = {}) {
        return _employee.profile(params);
    }

    /**
     * ## 接口函数
     *
     * * 接口：
     *      * 读唯一：`/api/:type/tabular/:code`（GET）
     *      * 读某一类：`/api/type/tabulars/:type`（GET）
     *      * 读几类：`/api/type/tabulars`（POST）
     * * 安全：是
     *
     * 读取`X_TABULAR`专用接口（三义性接口）
     *
     * @async
     * @param {Object} params 当前字典专用请求。
     * @returns {Promise<T>} 返回Promise。
     */
    static tabular(params = {}) {
        return _datum.tabular(params);
    }

    /**
     * ## 接口函数
     *
     * * 接口：
     *      * 读唯一：`/api/:type/category/:code`（GET）
     *      * 读某一类：`/api/type/categories/:type`（GET）
     *      * 读几类：`/api/type/categories`（POST）
     * * 安全：是
     *
     * 读取`X_CATEGORY`专用接口（三义性接口）
     *
     * @async
     * @param {Object} params 当前字典专用请求。
     * @returns {Promise<T>} 返回Promise。
     */
    static category(params = {}) {
        return _datum.category(params);
    }

    /**
     * ## 接口函数
     *
     * * 接口：`/api/ui/page`（POST）
     * * 安全：是
     *
     * 读取页面配置`UI_PAGE`。
     *
     * @async
     * @param {Object} params 页面专用请求
     * @returns {Promise<T>} 返回Promise。
     */
    static page(params = {}) {
        return _ui.page(params);
    }

    /**
     * ## 接口函数
     *
     * * 接口：`/api/ui/control`（POST）
     * * 安全：是
     *
     * 读取控件配置`UI_CONTROL`。
     *
     * @async
     * @param {Object} params 控件专用请求
     * @returns {Promise<T>} 返回Promise。
     */
    static control(params = {}) {
        return _ui.control(params);
    }

    /**
     * ## 接口函数
     *
     * * 接口：`/api/ui/ops`（POST）
     * * 安全：是
     *
     * 读取操作专用配置`UI_OP`。
     *
     * @async
     * @param {Object} params 控件专用请求
     * @returns {Promise<T>} 返回Promise
     */
    static ops(params = {}) {
        return _ui.ops(params);
    }

    /**
     * ## 接口函数
     *
     * * 接口：
     *      * 确认：`/api/todo/confirm/:key`（PUT）
     *      * 拒绝：`/api/todo/reject/:key`（PUT）
     * * 安全：是
     *
     * Todo待办的确认和拒绝专用接口。
     *
     * @async
     * @param {Object} params 待办专用请求
     * @param {boolean} confirmed 确认待办还是拒绝待办
     * @returns {Promise<T>} 返回Promise
     */
    static todo(params = {}, confirmed = true) {
        return _todo.todo(params, confirmed);
    }

    /**
     * ## 接口函数
     *
     * * 接口：`/api/job/info/mission/:key`（GET）
     * * 安全：是
     *
     * 读取 Mission 相关的 Job任务配置。
     *
     * @async
     * @param {String} key 当前任务的`key`主键
     * @returns {Promise<T>} 返回Promise
     */
    static mission(key) {
        return _job.mission(key);
    }

    /**
     * ## 接口函数
     *
     * * 接口：`/api/job/info/by/sigma`（GET）
     * * 安全：是
     *
     * 读取当前系统中所有的任务信息。
     *
     * @async
     * @returns {Promise<T>} 返回Promise
     */
    static jobs(params) {
        return _job.jobs(params)
    }

    /**
     * ## 接口函数
     *
     * * 接口：`/api/job/start/:key`（PUT）
     * * 安全：是
     *
     * 启动任务专用接口
     *
     * @async
     * @param {String} key 启动任务的键。
     * @returns {Promise<T>} 返回Promise。
     */
    static jobStart(key) {
        return _job.jobStart(key);
    }

    /**
     * ## 接口函数
     *
     * * 接口：`/api/job/stop/:key`（PUT）
     * * 安全：是
     *
     * 停止任务专用接口
     *
     * @async
     * @param {String} key 停止任务的键。
     * @returns {Promise<T>} 返回Promise。
     */
    static jobStop(key) {
        return _job.jobStop(key);
    }

    /**
     * ## 接口函数
     *
     * * 接口：`/api/job/resume/:key`（PUT）
     * * 安全：是
     *
     * 恢复任务专用接口
     *
     * @async
     * @param {String} key 恢复任务的键。
     * @returns {Promise<T>} 返回Promise。
     */
    static jobResume(key) {
        return _job.jobResume(key);
    }

    /**
     * ## 接口函数
     *
     * * 接口：`/api/relation`（GET）
     * * 安全：是
     *
     * 读取关系定义专用
     *
     * @async
     * @returns {Promise<T>} 返回Promise。
     */
    static relation() {
        return _relation.relation();
    }

    /**
     * ## 接口函数
     *
     * * 接口：`/api/ox/relation/save`（POST）
     * * 安全：是
     *
     * 存储关系专用
     *
     * @async
     * @param {Array} relations 存储关系专用
     * @returns {Promise<T>} 返回Promise。
     */
    static relationSave(relations = []) {
        return _relation.relationSave(relations);
    }

    /**
     * ## 接口函数
     *
     * * 接口：`/api/ox/relation/remove`（POST）
     * * 安全：是
     *
     * 删除关系专用
     *
     * @async
     * @param {Array} keys 将要被删除的关系的 key 集合
     * @returns {Promise<T>} 返回Promise。
     */
    static relationDelete(keys = []) {
        return _relation.relationDelete(keys);
    }
}

export default I;