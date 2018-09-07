import Cv from '../Ux.Constant';
import Hoc from '../prop/Ux.Hoc';
import U from 'underscore';

const _colorful = (reference = {}, Name, color = {}, type, stateless) => {
    if (Cv.DEBUG) {
        const flag = type ? type : 'React Component';
        let message = `%c [Zero] [${(!stateless)
            ? flag
            : "Stateless Function Component"}] Control monitor: name = ${Name}`;
        console.groupCollapsed(message, `color:${color.group};font-weight:900`);
        // 打印函数属性
        const inited = reference.props['$inited'];
        if (inited) {
            console.log(`%c [Zero] Inited Values ( $inited ) -> `, `color:#09c;font-weight:900`, inited);
        }
        const uniform = Hoc.toUniform(reference.props);
        console.log(`%c [Zero] Uniform -> `, `color:#666;font-weight:900`, uniform);
        const tabular = {};
        Object.keys(reference.props).filter(key => key.startsWith("$t_")).forEach(key => tabular[key] = reference.props[key]);
        console.log(`%c [Zero] Tabular -> Ux.onDatum`, `color:#933;font-weight:900`, tabular);
        const assist = {};
        Object.keys(reference.props).filter(key => key.startsWith("$a_")).forEach(key => assist[key] = reference.props[key]);
        console.log(`%c [Zero] Assist -> Ux.onDatum`, `color:#693;font-weight:900`, assist);
        if (reference.props.reference) {
            console.log(`%c [Zero] Parent Ref -> Ux.onReference`, `color:#black;font-weight:900`, reference.props.reference);
        }
        const functions = {};
        Object.keys(reference.props).filter(key => U.isFunction(reference.props[key])).forEach(key => functions[key] = reference.props[key]);
        console.log(`%c [Zero] Function -> `, `color:#060;font-weight:900`, functions);
        console.log(`%c [Zero] Props -> `, `color:${color.props};font-weight:900`, reference.props);
        if (!stateless) {
            console.log(`%c [Zero] State -> `, `color:${color.state};font-weight:900`, reference.state);
        }
        console.groupEnd()
    }
};
/**
 * 【开发模式】可重用控件组件日志打印
 * @method control
 * @param {React.PureComponent} reference React对应组件引用
 * @param Name 当前控件名称
 */
const control = (reference = {}, Name) => {
    _colorful(reference, Name, {
        group: '#990000',
        props: '#660099',
        state: '#666666'
    }, 'Rx-Control');
};
/**
 * 【开发模式】页面组件日志打印
 * @method page
 * @param {React.PureComponent} reference React对应组件引用
 * @param Name 当前控件名称
 */
const page = (reference = {}, Name) => {
    _colorful(reference, Name, {
        group: '#99CC33',
        props: '#660099',
        state: '#666666'
    }, 'Rx-Page');
};
/**
 * 【开发模式】纯函数组件日志打印
 * @method stateless
 * @param {React.PureComponent} reference React对应组件引用
 * @param Name 当前控件名称
 */
const stateless = (props = {}, Name) => {
    _colorful({
        props,
        state: null
    }, Name, {
        group: '#99CC33',
        props: "#660099",
        state: "#666666"
    }, 'Rx-Stateless', true)
};
/**
 * 【开发模式】Layout组件日志打印
 * @method container
 * @param {React.PureComponent} reference React对应组件引用
 * @param Name 当前控件名称
 */
const container = (reference = {}, Name) => {
    _colorful(reference, Name, {
        group: '#009900',
        props: '#660099',
        state: '#666666'
    }, 'Rx-Container');
};
/**
 * 【开发模式】Page中的其他自定义组件日志打印
 * @method component
 * @param {React.PureComponent} reference React对应组件引用
 * @param Name 当前控件名称
 */
const component = (reference = {}, Name) => {
    _colorful(reference, Name, {
        group: '#CC9933',
        props: '#660099',
        state: '#666666'
    }, 'Rx-Component');
};
/**
 * 【开发模式】Form专用组件日志打印
 * @method form
 * @param {React.PureComponent} reference React对应组件引用
 * @param Name 当前控件名称
 */
const form = (reference = {}, Name) => {
    _colorful(reference, Name, {
        group: '#0099FF',
        props: '#660099',
        state: '#666666'
    }, 'Rx-Form');
};
/**
 * 【开发模式】过滤参数专用
 * @method filters
 * @param {React.PureComponent} reference React对应组件引用
 * @param input 输入的Query参数
 * @param query Prop属性中的Query参数
 * @param filters 最终搜索用的Query参数
 * @param cond 搜索条件
 */
const filters = (reference = {}, {
    input = {}, query = {}, filters = {}, cond
}) => {
    if (Cv.DEBUG) {
        let message = `%c [Zero] [Filter] Filters Data Process`;
        console.groupCollapsed(message, "color:red;font-weight:900");
        console.log(`%c [Zero] Input Query -> `, 'color:#009900;font-weight:900', input);
        console.log(`%c [Zero] Prop Query -> `, 'color:#660099;font-weight:900', query);
        console.log(`%c [Zero] Search Filter -> `, 'color:#0099FF;font-weight:900', filters);
        console.log(`%c [Zero] Cond -> `, 'color:blue;font-weight:900', cond);
        console.groupEnd();
    }
};
/**
 * 【开发模式】签名专用函数
 * @method sign
 * @param uri 请求的Uri地址
 * @param method 请求的Http方法
 * @param parameters 请求的参数信息
 * @param seed 签名种子值
 * @param sig 签名最终结果
 * @param secret 签名的secret
 */
const sign = (uri, method, parameters, {
    seed, sig, secret
}) => {
    if (Cv.DEBUG) {
        let message = `%c [Zero] [Sign] Sign with method ${method}. ( uri = ${uri})`;
        console.groupCollapsed(message, "color:#CCCC33;font-weight:900");
        console.log(`%c [Zero] Parameters -> `, 'color:#9999CC;font-weight:900', parameters);
        console.log(`%c [Zero] Seed -> `, 'color:#669966;font-weight:900', seed);
        console.log(`%c [Zero] Secret -> `, 'color:blue;font-weight:900', secret);
        console.log(`%c [Zero] Sig -> `, 'color:red;font-weight:900', sig);
        console.groupEnd();
    }
};
/**
 * 【开发模式】打印请求数据
 * @method request
 * @param uri 请求的Uri地址
 * @param method 请求的Http方法
 * @param parameters 请求的参数信息
 * @param token 当前请求的token
 */
const request = (uri, method, parameters, token = '') => {
    if (Cv.DEBUG) {
        let message = `%c [Zero] [Ajax] Ajax request with method ${method}. ( uri = ${uri})`;
        const color = Cv.SIGN ? "#06C" : "#C03";
        console.groupCollapsed(message, `color:${color};font-weight:900`);
        console.log(`%c [Zero] Parameters -> `, 'color:#669966;font-weight:900', parameters);
        console.log(`%c [Zero] Uri -> `, 'color:#06C;font-weight:900', uri);
        console.log(`%c [Zero] Token -> `, 'color:#339966;font-weight:900', token);
        console.groupEnd();
    }
};
/**
 * 【开发模式】打印响应信息
 * @method response
 * @param data Ajax的错误对象
 * @param params Ajax的正确响应
 * @param method Http方法
 * @param url 访问基本信息
 * @return {*}
 */
const response = (data, params, request = {}) => {
    if (Cv.DEBUG) {
        const {
            method,
            url,
            headers,
        } = request;
        let message = `%c [Zero] [Ajax] Ajax response got from ${url} with method. ${method}`;
        console.groupCollapsed(message, "color:#096;font-weight:900");
        const it = headers.entries();
        const headerData = {};
        let item = {done: true};
        do {
            item = it.next();
            const entry = item.value;
            if (entry) {
                headerData[entry[0]] = entry[1];
            }
        } while (!item.done);
        console.log(`%c [Zero] Headers -> `, 'color:#c93;font-weight:900', headerData);
        console.log(`%c [Zero] Request -> `, 'color:#006699;font-weight:900', params);
        console.log(`%c [Zero] Response -> `, 'color:#039;font-weight:900', data);
        console.groupEnd();
    }
    // For fetch api 专用
    return Promise.resolve(data);
};
/**
 * 直接打印错误信息（红色文字打印）
 * @method error
 * @param error
 */
const error = (error) => {
    let message = `%c [Zero] [Error] Error occurs got. status = ${error.status}, code = ${error.code}, brief = ${error.statusText}`;
    console.groupCollapsed(message, "color:red;font-weight:900");
    console.log(`%c [Zero] Error message -> `, 'color:#ff0073;font-weight:900', error.message);
    console.log(`%c [Zero] Read message -> `, 'color:#ee0033;font-weight:900', error.info);
    console.groupEnd();
};
const layout = (layoutType = {}, window, dft = true) => {
    if (Cv.DEBUG) {
        let message = `%c [Zero] [Layout] Layout Selector： label = ${layoutType.label}, key=${layoutType.key}`;
        console.groupCollapsed(message, "color:#7c8577;font-weight:900");
        console.log(`%c [Zero] Window Parameter:`, "color:#006c54", window);
        console.log(`%c [Zero] Layout Object information:`, "color:#769149", layoutType);
        console.log(`%c [Zero] Layout Revert to default? default = `, dft ? "color:red" : "color:#d96c3", dft);
        console.groupEnd();
    }
};
/**
 * phase = 1，开始打印
 * phase = 2，字段打印
 * phase = 3，打印结束
 * @param item
 * @param phase
 */
const render = (phase = 1, item = {}, key = {}) => {
    if (Cv.DEBUG && Cv.RENDER) {
        if (5 === phase) {
            // 开始打印
            const message = `%c [Zero] [Render] Row Config --> ${key}`;
            console.log(message, "color:#39f;font-weight:900", item);
        } else if (4 === phase) {
            // 打印模板
            layout(item, key.window, key.dft);
        } else if (3 === phase) {
            // 关闭
            console.groupEnd();
        } else if (2 === phase) {
            // 打印字段
            if (item.optionItem) {
                const mode = key ? `"Jsx"` : `"Hoc"`;
                const message = `%c [Zero] [Render] (${mode}) name="${item.field}", label="${item.optionItem.label}"`;
                console.groupCollapsed(message, `color:#333;font-weight:900`);
                console.log(`%c [Zero] Render mode: `, "color:#0c0", mode);
                console.log(`%c [Zero] Field optionItem: `, "color:#06c", item.optionItem);
                console.log(`%c [Zero] Field optionJsx：`, "color:#660", item.optionJsx);
                console.groupEnd();
            }
        } else {
            // 开始打印
            const message = `%c [Zero] [Render] Form configuration --> ${key}`;
            console.groupCollapsed(message, "color:#0066CC;font-weight:900", item);
        }
    }
};
const mocker = (mockerRef, $query) => {
    if (Cv.DEBUG && Cv.MOCK) {
        const mocker = mockerRef.raw();
        let message = `%c ------> [Zero] [Mock] mocker has been ${$query ? "filtered" : "initialized"}.`;
        console.groupCollapsed(message, "color:red;font-weight:900");
        console.log(`%c [Zero] Mocker Keys -> `, 'color:#ff0073;font-weight:900', mocker.keys);
        console.log(`%c [Zero] Mocker Data -> `, 'color:#009900;font-weight:900', mocker.source);
        console.log(`%c [Zero] Mocker Filter -> `, 'color:#0099FF;font-weight:900', $query);
        console.groupEnd();
    }
};
/**
 * 【开发模式，并且开启Mock】打印Mock数据
 * @method mock
 * @param {Request} request 请求数据
 * @param {Response} response 响应数据
 * @param {String} url 请求的url
 * @return {*}
 */
const mock = (request, response, url) => {
    if (Cv.DEBUG && Cv.MOCK) {
        let message = `%c ------> [Zero] [Mock] Mock data for api ${url ? url : ""}`;
        console.groupCollapsed(message, "color:white;background-color:#c30;font-weight:900;");
        if (request) {
            console.log("%c [Zero] Mock request -> ", 'color:#99CC33', request);
        } else {
            console.log("%c [Zero] Mock request -> ( Promise Mode Directly )", 'color:#99CC33');
        }
        console.log("%c [Zero] Mock response -> ", 'color:#0099FF', response);
        console.groupEnd();
    }
    return response;
};
/**
 * 【开发模式】直接打印数据
 * @method debug
 * @param object
 */
const debug = (object, original) => {
    if (Cv.DEBUG) {
        let message = `%c [Zero] [Redux] Debug Object`;
        console.groupCollapsed(message, "color:#660099;font-weight:900");
        if ("string" === typeof object) {
            console.log("[Zero] Redux Key: ", object);
        } else {
            console.log("[Zero] Object Data: ", object);
        }
        console.log("[Zero] Original Data: ", original);
        console.groupEnd();
    }
};
const connect = (id) => {
    if (Cv.DEBUG) {
        let message = `%c -----> [Zero] Connect ..., id = ${id}`;
        console.log(message, "color:#033;font-weight:900");
    }
};
/**
 * @class Log
 * @description 日志专用类，支持不同组件的彩色日志
 */
export default {
    control,
    container,
    component,
    page,
    layout,
    form,
    stateless,
    sign,
    request,
    response,
    render,
    error,
    debug,
    filters,
    mock,
    mocker,
    connect,
}
