import U from 'underscore';
// 文件导入
import Value from '../../Ux.Value';
import Cv from '../../Ux.Constant';
import Ajax from '../../Ux.Ajax';
// 包导入
import Rdx from '../../fun';
import Prop from '../../prop';
import D from '../../monitor';

/**
 * 计算当前提交的模式
 * @param reference
 * @private
 */
const _getMode = (reference) => {
    const {
        $inited,      // 当前表单的初始化数据
        $parent,      // 主表单的初始值，如果不是Dialog提交则为undefined
        $key          // 当前记录的$key值
    } = reference.props;
    if (reference.props.hasOwnProperty("$parent")) {
        // 判断parent中是否有值
        const parent = Value.isEmpty($parent);
        if (parent) {
            // 弹出框子表单提交
            if ($key) {
                // 4.双编辑模式
                return "EDIT-EDIT";
            } else {
                // 3.编辑添加模式
                return "EDIT-ADD";
            }
        } else {
            // 主表单提交
            if ($key) {
                // 2.添加编辑模式
                return "ADD-EDIT";
            } else {
                // 1.双添加模式
                return "ADD-ADD";
            }
        }
    } else {
        if ($inited) {
            // 主表单编辑模式
            return "EDIT";
        } else {
            // 主表单添加模式
            return "ADD";
        }
    }
};
/**
 *
 * @param metadata 默认判断信息
 * @returns {*}
 * @private
 */
const _getValidate = (metadata = {}) => {
    if (U.isFunction(metadata['fnValidate'])) {
        return metadata['fnValidate'];
    } else {
        // 直接返回通过验证的函数；
        return () => true;
    }
};
const _getEvented = (fnPreValidate = () => true, form) =>
    new Promise((resolve, reject) => form.validateFieldsAndScroll((error, values) =>
        error ? reject(error) :
            (fnPreValidate(values) ? resolve(values) : reject(values))
    ));
const _getFormed = (fnPreValidate = () => true, values = {}) =>
    new Promise((resolve, reject) => fnPreValidate(values) ? resolve(values) : reject(values));
/**
 * Normalize规范化数据信息（包括基于子列表的数据处理）
 * @param data 原始表单提交数据信息
 * @param reference React组件引用
 * @param mode 计算的mode
 * @private
 */
const _normalizeValue = (data = {}, reference, mode) => {
    // 先拷贝一份新的数据
    const params = Value.clone(data);
    // 参数注入语言
    params.language = Cv["LANGUAGE"];
    // 应用数据处理
    const {$app} = reference.props;
    if ($app && $app.is()) {
        // 专用sigma处理
        const sigma = $app._("sigma");
        if (sigma) params.sigma = sigma;
    }
    // active专用：双引用
    params.active = !!params.active;
    // 专用mode处理
    if (0 <= mode.indexOf("EDIT")) {
        // 更新模式才会触发
        const {$inited} = reference.props;
        if ($inited && $inited.key) {
            params.key = $inited.key;
        }
    }
    return params;
};
/**
 * 特殊的二阶函数，用于生成标准的 (event) => {
 *     （函数逻辑）
 * }
 * @param reference React引用信息
 * @param fnSuccess 回调专用的成功过后的函数
 * @param fnFailure 失败的回调函数相关信息
 * @param metadata 配置相关信息
 * {
 *     fnValidate：验证专用的函数（后期验证验证）,
 *     promise：true / false
 *          true：「可切换值」表示当前所有的函数都必须返回promise；
 *          false：「默认值」则表示当前所有的函数都是直接函数，不会返回promise；
 * }
 * @returns {function(*): (*|*|void)}
 */
const ai2Event = (reference, fnSuccess, fnFailure, metadata = {}) =>
    /**
     * 双参数格局
     * 1.不论哪种都调用过 event.preventDefault 函数；
     * 2.模式1：已经经历过Ant Design的提交流程
     *      这种模式不可注入认证函数：fnValidate失效；
     *      —— ambiguity 表示提交过后的表单值
     * 3.模式2：未经历过Ant Design的提交流程
     *      这种模式可以注入认证函数：fnValidate失效；
     *      —— ambiguity 表示原始Button中的 event 参数「调用过event.preventDefault()」
     *      —— form 表单Ant Design中的form引用
     * @param ambiguity
     */
        (ambiguity) => {
        /**
         * 提取模式信息：
         * 1. 双添加模式：主记录Add、子列表Add
         * 2. 添加编辑模式：主记录Add、子列表Edit
         * 3. 编辑添加模式：主记录Edit、子列表Add
         * 4. 双编辑模式：主记录Edit、子列表Edit
         */
        const mode = _getMode(reference);
        /**
         * 验证函数处理
         * @type {*}
         */
        const fnVerify = _getValidate(metadata);
        /**
         * 如果包含第二参，则直接调用form相关信息
         */
        let promise;
        if (U.isFunction(ambiguity.preventDefault)) {
            // ==> ：验证之前防重复提交处理
            Rdx.rdxSubmitting(reference, true);
            // event模式
            const {form} = reference.props;
            promise = _getEvented(fnVerify, form);
        } else {
            // values模式
            promise = _getFormed(fnVerify, ambiguity);
        }
        return promise.then(data => {
            // 拷贝数据本身
            const params = _normalizeValue(data, reference, mode);
            // Mocker专用数据处理
            const {fnMock} = reference.props;
            let mockData = {};
            if (fnMock && U.isFunction(fnMock)) {
                /**
                 * 由于fnMock需要修改传入引用，为有副作用的函数
                 * 所以直接从params拷贝数据，返回Mock后的数据信息
                 */
                const inputMock = Value.clone(params);
                mockData = fnMock(inputMock);
            }
            // 执行最终处理
            return _executor(reference, {
                success: fnSuccess,
                failure: fnFailure,
                promise: !!metadata.promise,
                mock: mockData,
                mode,
                data: params
            })
        }).catch(error => {
            // <==：关闭防重复提交
            Rdx.rdxSubmitting(reference, false);
            if (U.isFunction(fnFailure)) {
                /**
                 * 第一参为验证之前的错误信息
                 * 没有第二参
                 */
                fnFailure(error);
            }
        })
    };
const _executor = (reference, config = {}) => {
    const {data, mode} = config;
    // 1.子表单模式专用
    if ("ADD" === mode || "EDIT" === mode) {
        const items = Prop.itemRead(reference);
        // 有items的主要记录提交
        if (items) data._items = items;
        D.connectSubmit(reference, data);
    } else {
        // 只有list.items的提交会触发该列表信息
        let majorKey;
        if ("ADD-EDIT" === mode || "ADD-ADD" === mode) {
            // 添加模式
            const {$addKey} = reference.props;
            Rdx.rdxListItem(reference, data, $addKey);
            majorKey = $addKey;
        } else {
            const {$parent = {}} = reference.props;
            // 主记录编辑模式（$inited中包含key）
            Rdx.rdxListItem(reference, data);
            majorKey = $parent.key;
        }
        /**
         * 连接相关数据信息，数据结构：
         * {
         *     majorKey：主记录key
         *     1. 添加模式来自$addKey
         *     2. 编辑模式来自$parent.key
         *     data：子记录数据
         * }
         */
        D.connectSubmit(reference, {
            majorKey,
            data,
        }, false);
    }
    return _executeCode(reference, config, data);
};
const _executeCode = (reference, config = {}, data) => {
    const {success, failure, mock} = config;
    // 1.只有包含了success过后才会触发回调
    const fnSuccess = () => U.isFunction(success) ? success(data, mock) : undefined;
    const fnFailure = (errors) => U.isFunction(failure) ? failure(errors, data) : undefined;
    const fnLoading = () => Rdx.rdxSubmitting(reference, false);
    return Ajax.ajaxUniform(fnSuccess, fnFailure, fnLoading);
};
export default {
    ai2Event
};