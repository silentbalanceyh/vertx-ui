import U from 'underscore';
import Terminal from './terminal/Ux.Terminal.Fx';
import Cv from './cv/Ux.Constant';

const fnError = {
    10000: (type, current) => `[ ERR-10000 ] 传入参数类型不匹配，期望类型${type}，当前参数类型${current}`,
    10001: (name, key) => `[ ERR-10001 ] (Hoc) 高阶组件绑定资源文件：${name}.json 中缺失了该组件所需配置节点：${key}`,
    10002: (reference) => `[ ERR-10002 ] Ux.State.writeTree方法遇到错误，首参数必须是ReactComponent，当前参数：${reference}`,
    10003: (reference) => `[ ERR-10003 ] Ux.State.writeTree方法传入的ReactComponent需要"fnOut"写状态树方法，该方法不存在：fnOut=${reference.props.fnOut}`,
    10004: (reference) => `[ ERR-10004 ] 你将使用React-Router中的DataRouter功能，$router变量不存在${reference.props['$router']}`,
    10005: (steps) => `[ ERR-10005 ] 传入的数据结构只能是Array/String两种，用于核心迭代，当前值：${steps}，类型：${typeof steps}`,
    10006: (reference) => `[ ERR-10006 ] 只有Ant-Design的Form可操作该方法，丢失了"Form"引用：props = ${reference.props.form}`,
    10007: (Op, key) => `[ ERR-10007 ] 当前按钮没有相关函数绑定，请检查你的Op传入变量：Op=${Op}, key=${key}`,
    10008: (key, expr) => `[ ERR-10008 ] 表达式类型不对，必须是String字符串，key = ${key}, expr = ${expr}`,
    10009: (key, attr) => `[ ERR-10009 ] 配置节点" ${key} "中丢失了重要属性：${attr}`,
    10010: (key, type) => `[ ERR-10010 ] 属性" ${key} "的数据类型只能是：${type}`,
    10011: (columns) => `[ ERR-10011 ] 您使用了2列专用布局，window = 0.5，列参数只能为2，column=${columns}`,
    10012: (key) => `[ ERR-10012 ] 当前组件为一个form，它的"_${key}"属性在Hoc资源文件中缺失`,
    10013: (fnInit) => `[ ERR-10013 ] 当前操作要求 props 中包含名为 "fnInit" 的特殊函数，该函数缺失：${fnInit}`,
    10014: (topbar) => `[ ERR-10014 ] 启用了Connect连接机制，但"topbar.buttons"数据格式非法。${topbar}`,
    10015: (id) => `[ ERR-10015 ] (Connect) 连接点Html元素 id = ${id} 丢失，当前页面无该元素。`,
    10016: (onOk) => `[ ERR-10016 ] (Connect) 窗口连接"onOk"值非法，必须是一个字符串 或 函数。${onOk}`,
    10017: (event) => `[ ERR-10017 ] 当前事件"${event}"未实现，为空事件，触发后没有任何效果。`,
    10018: (promise) => `[ ERR-10018 ] (Ajax) 您的Promise非法，不会触发异步操作，promise = ${promise}`,
    10019: (zxInit) => `[ ERR-10019 ] 当前操作要求 props 中包含名为 "zxInit" 的特殊函数，该函数缺失：${zxInit}`,
    10020: (form) => `[ ERR-10020 ] 您触发了"Ant-Design"的提交动作，props中必须包含 "form" 引用，目前缺失：${form}`,
    10021: (event, id) => `[ ERR-10021 ] 当前事件"${event}"不是一个合法的JavaScript函数，id=${id}`,
    10022: (config) => `[ ERR-10022 ] Ant-Design的自定义验证器Validator需要配置节点"config"，该节点丢失 = ${config}`,
    10023: (validator, verifierKeys) => `[ ERR-10023 ] 通过 validator = ${validator} 在当前系统中查找不到验证器，支持的keys = ${verifierKeys}`,
    10024: (checked) => `[ ERR-10024 ] (Hoc) 高阶函数执行后的结果不是一个合法的JavaScript函数。function = ${checked}`,
    10025: (type, promise) => `[ ERR-10025 ] (Ajax) rxEpic - 【旧版】函数要求的 "type" 或 "promise" 不合法。${type}、${promise}`,
    10026: (type, promise, next) => `[ ERR-10026 ] (Ajax) rxEclat - 【流】函数要求的 "type" 或 "promise, next" 不合法。${type}、${promise}、${next}`,
    10027: (type, promise) => `[ ERR-10027 ] (Ajax) rxEdict - 【新版】函数要求的 "type" 或 "promise" 不合法。${type}、${promise}`,
    10028: (moment) => `[ ERR-10028 ] 非法时间对象，不可转、转换结果为一个非法 "moment" 格式。${moment}`,
    10029: (dividend, divisor) => `[ ERR-10029 ] 传入两数二者不可除，数学除法问题：${dividend} / ${divisor}`,
    10030: (from, to, duration) => `[ ERR-10030 ] 计算时间区间时候的 "from"=${from} 、 "to"=${to}、"duration"=${duration} 值非法。`,
    10031: (modal) => `[ ERR-10031 ] 模态框核心配置 "_modal" = ${modal} 丢失，请在资源文件中重新配置。`,
    10032: (fnShow) => `[ ERR-10032 ] 当前操作要求 props 中包含名为 "fnShow" 的特殊函数，该函数缺失：${fnShow}`,
    10033: (fnHide) => `[ ERR-10033 ] 当前操作要求 props 中包含名为 "fnHide" 的特殊函数，该函数缺失：${fnHide}`,
    10034: (config, params) => `[ ERR-10034 ] 异步验证错误，config = ${JSON.stringify(config)}，params = ${params}`,
    10035: (path) => `[ ERR-10035 ] 该操作要求属性中仅支持二级路径"path.xxx"模式，路径必须带"."符号，path = ${path}`,
    10036: (index) => `[ ERR-10036 ] 当前方法需要 "groupIndex" = ${index}，当前的分组索引不对。`,
    10037: (error) => `[ ERR-10037 ] "JSON.parse" 方法遇到了解析错，错误信息：${error}。`,
    10038: (info) => `[ ERR-10038 ]（Ai）当前方法必须要求资源文件中 "_info" 节点的配置，该信息缺失：${info}`,
    10039: (meta) => `[ ERR-10039 ] 该方法处理了Datum，"meta" 节点不合法，config.meta = ${meta}`,
    10040: (array) => `[ ERR-10040 ] 数据源 "value" 将会填充Ant-Design中的Table，必须是一个Array，type = ${typeof array}`,
    10041: (callback) => `[ ERR-10041 ] (Rx) 输入的回调 "callback" 必须是一个函数，type = ${typeof callback}`,
    10042: (item) => `[ ERR-10042 ] (Rx) 输入的配置项 "item" 必须是一个Object/Array类型, type = ${typeof item}`,
    10043: (source) => `[ ERR-10043 ] (Rx) 调用了 onDatum 的API，数据源必须是一个数组，source key="${source}"。`,
    10044: (source) => `[ ERR-10044 ] (Rx) 将调用 onDatum，配置中的 "source" 必须是一个合法字符串，source = ${source}`,
    10045: (dialog) => `[ ERR-10045 ] (Rx) 窗口配置 "config" 的类型非法，${dialog}`,
    10046: (buttons) => `[ ERR-10046 ] (Ai) Form的资源文件配置中缺乏键 "_form -> buttons"相关配置, buttons = ${buttons}`,
    10047: (key, fun) => `[ ERR-10047 ] (Ai) 配置程序中的 key = ${key}在"Op"对象中不是高阶函数，执行结果：${fun}`,
    10048: (pager) => `[ ERR-10048 ] (Web) 丢失了 "pager" 相关配置，${pager}，无法执行分页处理。`,
    10049: (reference) => `[ ERR-10049 ] (React) 丢失了 "reference" 组件引用，该引用值不合法：${reference}`,
    10050: (Cab) => `[ ERR-10050 ] (@zero) 绑定资源文件过程中的 "Cab" 不合法，Cab=${Cab}`,
    10051: (Name) => `[ ERR-10051 ] (@zero) 无法读取当前组件的组件名，该名称不可为空，"Name" = ${Name}`,
    10052: (data) => `[ ERR-10052 ] (Web) 自定义组件中的状态无法执行初始化，必须包含"data"的值，data = ${data}`,
    10053: (config) => `[ ERR-10053 ] (Web) 删除过程中的"config.ajax"的配置不合法，config = ${config}`,
    10054: (config) => `[ ERR-10054 ] (Web) Tab页签处理编辑事件时的"edit"配置丢失，config = ${config}`,
    10055: (hoc) => `[ ERR-10055 ] (@zero) 初始化 $hoc 时失败，无法初始化 $hoc = ${hoc}`,
    10056: (hoc) => `[ ERR-10056 ] (@zero) 初始化了Ant Design的Form配置，但"_form"在资源文件中丢失，$hoc = ${hoc}`,
    10057: (input) => `[ ERR-10057 ] "Uarr" 要求输入的值必须是一个Array数组类型，input = ${input}`,
    10058: (input) => `[ ERR-10058 ] "Uson" 要求输入的值必须是一个Object类型，input = ${input}`,
    10059: (render, options = {}) => `[ ERR-10059 ] "render" 非法（必须是一个渲染Jsx的函数），不能执行界面渲染，render = ${render}, options = ${options}`,
    10060: (view, field) => `[ ERR-10060 ] 视图中的字段配置要求包含"${field}"，该配置缺失：${view}`,
    10061: (object, field) => `[ ERR-10061 ] (Assert) 被检查的JavaScript对象${object}中缺少${field}字段。`,
    10062: (input) => `[ ERR-10062 ] (Assert) 输入的值为无法通过检查条件：!input，请输入合法值。input = ${input}`,
    10063: (reference) => `[ ERR-10063 ] (Storage) 当前运行时不支持该本地存储，reference = ${reference}`,
    10064: (funName, effectKey) => `[ ERR-10064 ] 被调用函数${funName}要求的第二参数"effectKey"非法，当前值：${effectKey}`,
    10065: (token) => `[ ERR-10065 ] (App) 无法读取安全认证用的'token'令牌, 请求非法，token = ${token}`,
    10066: (funName, key) => `[ ERR-10066 ] 被调用函数${funName}要求的第二参数"key"非法，当前值：${key}`,
    10067: (app) => `[ ERR-10067 ] (App) 无法读取当前应用程序配置信息'app'，配置非法，app = ${app}`,
    10068: (number) => `[ ERR-10068 ] 输入值必须是一个正整数，( n > 0 )，当前值：input = ${number}`,
    10069: (array, length) => `[ ERR-10069 ] 输入的数组长度上限为${length}, length <= limit 当前长度：${array.length}`,
    10070: (array, length) => `[ ERR-10070 ] 输入的数组长度下限为${length}, length >= limit 当前长度：${array.length}`,
    10071: (input, expected) => `[ ERR-10071 ] 参数类型检查失败，期望${expected}，当前数据：${input}`,
    10072: (uri) => `[ ERR-10072 ] (Rt) 您要重定向的页面地址不可为空，uri = ${uri}`,
    10073: ($op) => `[ ERR-10073 ] (Rt) 您正在提取绑定的 "$op"，当前React组件中 reference.state.$op非法。${$op}`,
    10074: (key) => `[ ERR-10074 ] (Rt) 您调用了"rtNorm"标准化按钮，但您的配置"optionJsx.buttons"中缺少${key}。`,
    10075: (bind) => `[ ERR-10075 ] (Rt) 您使用了"bind"中的source字段，该字段只能是"state"或"prop"两个值。${bind}`,
    10076: (mode) => `[ ERR-10076 ] (AI) 您目前使用的按钮渲染模式为：${mode}。`,
    10077: ($op, key) => `[ ERR-10077 ] (Rt) 正在从 "$op" 中提取 key=${key} 的函数，该函数不存在！`,
    10078: (flow) => `[ ERR-10078 ] (Rt) 您正在调用内置函数"_rtSubmit"，您在使用分支：-- ${flow}`,
    10079: (reference) => `[ ERR-10079 ] (Web) 父组件"reference"引用未传入。reference = ${reference}`,
    10080: (validation) => `[ ERR-10080 ] (Web) 当前配置中需要"validation"，当前配置丢失：validation = ${validation}`,
    10081: (config, linker) => `[ ERR-10081 ] (Web) 链接最终的数据成功。配置：${typeof config}，数据为：${typeof linker}`,
    10082: ($items) => `[ ERR-10082 ] (Rdx) 无法读取状态树上的"list.items"数据，该数据必须是一个DataObject。${$items}`,
    10083: (dataIndex, $render) => `[ ERR-10083 ] (Web) 列渲染器出了问题，缺失"$render"属性，请检查字段${dataIndex}的配置, $render = ${$render}`,
    10084: (state) => `[ ERR-10083 ] (Web) 当前组件的状态"state"不合法，请检查是否执行过状态初始化，state = ${state}`,
    10085: (fnClose) => `[ ERR-10085 ] 当前操作要求 props 中包含名为 "fnClose" 的特殊函数，该函数缺失：${fnClose}`,
    10086: (fnClear) => `[ ERR-10086 ] 当前操作要求 props 中包含名为 "fnClear" 的特殊函数，该函数缺失：${fnClear}`,
    10087: (fnListItem) => `[ ERR-10087 ] 当前操作要求 props 中包含名为 "fnListItem" 的特殊函数，该函数缺失：${fnListItem}`,
    10088: (fnPromise) => `[ ERR-10088 ] 当前操作执行过后的返回结果必须是一个 "Promise" 对象，当前对象：${fnPromise}`,
    10089: (branch) => `[ ERR-10089 ] (Web) 当前组件中的 tree 配置丢失了 "branch", ${branch}`,
    10090: (name) => `[ ERR-10090 ] (Web) 当前自定义组件中的 ${name} 属性丢失，请检查你的传入配置。`,
    10091: (modeButton) => `[ ERR-10091 ] (Web) 当前 DialogButton 组件的按钮模式不对，仅支持：BUTTON / DROPDOWN, current = ${modeButton}`,
    10092: (modeDialog) => `[ ERR-10092 ] (Web) 当前 DialogButton 组件的窗口模式不对，仅支持：DIALOG / DRAWER / POPOVER, current = ${modeDialog}`,
    10093: (mode) => `[ ERR-10093 ] (Web) 当前 DialogMenu 组件的窗口模式不对，仅支持：DIALOG / DRAWER, current = ${mode}`,
    10094: (length) => `[ ERR-10094 ] (Web) 当前 DialogMenu 组件的属性 '$items' 的长度必须大于1，current = ${length}`,
    10095: (onChange) => `[ ERR-10095 ] (Jct) 自定义组件中的 'onChange' 属性必须是一个合法的函数，当前类型：${typeof onChange}`,
    10096: ($key) => `[ ERR-10096 ] (Stream) 无法计算出在Stream中需要使用的 'key' 值，当前值：${$key}`,
    10097: (data = {}) => `[ ERR-10097 ] (Stream) Stream中对应取得的格式不对，当前值：${JSON.stringify(data)}`,
    10098: () => `[ ERR-10098 ] (Js) 捕捉到Js的异常信息：`,
    10099: () => `[ ERR-10099 ] (Dialog) 配置构造有问题：key, message, hoc = `,
    10100: (fnName) => `[ ERR-10100 ] (Web) 当前组件使用了 Reactive 模式，传入的函数非法，fnName = ${fnName}`,
    10101: (same, diff) => `[ ERR-10101 ] (Web) 当前组件设置 ReadOnly 依赖时 same和diff值不可相同，same=${same},diff=${diff}`,
    10102: (kv) => `[ ERR-10102 ] (Ir) valueSearch 解析的时候发现格式不对的键值对，${kv}`,
    10103: (key) => `[ ERR-10103 ] (Ir) 对不起，由于开启了 dynamic column 的功能，必须保证有 rxColumn 函数，检测不到该函数！key=${key}`
};
const _fxError = (_condition, code, message) => {
    if (_condition) {
        console.error(message);
    }
};
const _fxContinue = (cond, callback) => {
    if (U.isFunction(cond)) {
        cond = cond();
    }
    if (cond && U.isFunction(callback)) {
        return callback();
    }
};

const fxFailure = (code, ...args) => {
    const message = fxMessage.apply(this, [console.error, code].concat(args));
    console.error(message);
    return Terminal.fxError(message);
};

const fxFatal = (cond, code, ...args) => {
    const fnCond = U.isFunction(cond) ? cond : () => cond;
    if (fnCond()) {
        const message = fxMessage.apply(this, [console.error, code].concat(args));
        throw new Error(message ? message : "");
    }
};

const fxJs = (code, error) => {
    const fn = fnError[code];
    const message = fn.apply(this, null);
    console.error(message, error);
};

const fxMessage = (executor, code, ...args) => {
    const fn = fnError[code];
    if (U.isFunction(fn)) {
        const message = fn.apply(this, args);
        if (Cv.DEBUG) {
            executor.apply(this, [message].concat(args.filter(item => !U.isFunction(item))));
        }
        return message;
    }
};
const _fxTerminal = (cond, callback, code, ...args) => {
    _fxError(!cond, code, fnError[code].apply(this, args));
    return _fxContinue(cond, callback);
};
export default {
    fxTerminal: (fnCond, code, ...args) => {
        const checked = U.isFunction(fnCond) ? fnCond() : fnCond;
        if (checked) {
            return fxMessage.apply(this, [console.error, code].concat(args));
        }
    },
    fxWarning: (fnCond, code, ...args) => {
        const checked = U.isFunction(fnCond) ? fnCond() : fnCond;
        if (checked) {
            return fxMessage.apply(this, [console.warn, code].concat(args));
        }
    },
    fxInfo: (fnCond, code, ...args) => {
        const checked = U.isFunction(fnCond) ? fnCond() : fnCond;
        if (checked) {
            return fxMessage.apply(this, [console.info, code].concat(args));
        }
    },
    fxMessageError: (code, ...args) => fxMessage.apply(this, [console.error, code].concat(args)),
    fxFailure,
    fxOut: (reference = {}, callback) => _fxTerminal(!!reference && reference.props, () => {
        const {fnOut} = reference.props;
        _fxTerminal(fnOut && U.isFunction(fnOut), () => {
            callback(fnOut);
        }, 10003, reference);
    }, 10002, reference),
    fxSubmit: (reference = {}, Op = {}, key) => _fxTerminal(!!reference && reference.props, () => {
        if (Op[key]) {
            return Op[key](reference);
        } else {
            fnError[10007](Op, key);
            return (event) => {
                event.preventDefault();
            };
        }
    }, 10002, reference),
    fxFatal,
    fxJs,
};
