import Ux from 'ux';
import __Zn from './zero.module.dependency';
import {Dsl} from "entity";
import {_I} from "zet";
// 直接模式，静态 $identifier 提取
const __puWayDirect = async (identifier, vector = {}) => {
    const $control = vector[identifier];
    const controlData = {$identifier: identifier, $control};
    Ux.dgDebug(controlData, "「直接」选择的：$identifier 和 $control.");
    return controlData;
}

// 默认模式，计算默认模式得到
const __puWayDefault = async (identifier, vector = {}) => {
    const $control = vector.__DEFAULT__;
    const controlData = {$identifier: identifier, $control};
    Ux.dgDebug(controlData, "「默认」选择的：$identifier 和 $control.");
    return controlData;
}

const __puWayAlias = async (identifier, vector = {}, reference) => {
    const {
        $myView = {},            // 视图
        $myDefault = {},         // 默认视图
        $metadata = {},          // 读取类型和页面
        $inited = {},
    } = reference.props;
    /*
     * 远程读取构造 vector
     *
     *      "page": xxx,
     *      "identifier": xxx,
     *      "path": based on view/position,
     *      "type": calculate the parameter from params,
     *      "alias": The name that you can define here.
     */
    const request = {};
    request.identifier = identifier ? identifier : vector.__DEFAULT__;

    // page, componentType
    const {
        componentType,
        page
    } = $metadata;
    request.type = componentType;
    request.page = page;

    let view = $myView.name;
    if (!view) {
        view = $myDefault.name ? $myDefault.name : "DEFAULT";
    }
    request.view = view;
    request.position = $myView.position ? $myView.position : "DEFAULT";

    // 动态部分 只有动态检索才会使用 data 节点读取基础数据信息
    request.data = $inited;
    request.config = vector['__SEEK__'];
    request.alias = vector['__ALIAS__'];
    /**
     * {
     *     alias: "直接配置，通常是：EDIT, ADD, FILTER, LIST",
     *     data: {
     *         "用于选择处理时专用的插件参数专用配置。"
     *     },
     *     identifier: "原始标识规则选择符",
     *     language: "语言信息",
     *     page: "当前页面ID（UI_PAGE专用）",
     *     type: "当前查找专用类型，如：FORM / LIST",
     *     position: "当前页面位置，对应 position",
     *     view: "当前页面专用视图，对应 view"
     * }
     */
    const vectorData = await _I.visitor(request);
    const $control = vectorData['controlId'];
    const controlData = {$identifier: identifier, $control};
    Ux.dgDebug(controlData, "「远程」选择的：$identifier 和 $control.");
    return controlData;
}

const __puWayControl = async (reference, identifier) => {
    if (!identifier) {
        console.error("处理单元遇到了核心错误，无法查找模型所需 identifier ");
    }
    /*
     * vector 的两种格式
     * 1. 直接包含了 $identifier，直接提取
     * 2. 无法提取 $identifier 对应的配置等相关信息
     * -- 2.1. 直接看 __ALIAS__：远程读取
     * -- 2.2. 如果不存在 __ALIAS__，则配置直接执行 __DEFAULT__ 处理
     */
    const {config = {}} = reference.props;
    const {vector = {}} = config;
    if (vector.hasOwnProperty(identifier)) {
        // 直接
        return await __puWayDirect(identifier, vector);
    }
    if (vector['__ALIAS__']) {
        // 远程
        return await __puWayAlias(identifier, vector, reference);
    }
    // 本地
    return await __puWayDefault(identifier, vector);
}
/**
 * ## 「扩展」`Ux.puControl`
 *
 * @memberOf module:pu/unfold
 * @param reference
 * @return {*}
 */
const puControl = async (reference) => {
    const {
        config = {},
        $identifier,
    } = reference.props;
    /*
     * 根据配置选择是否执行 fabric 流程，执行 fabric 流程要开启事件流
     * 执行不同单元结构的处理，包括
     * - 串行指令集
     * - 并行指令集
     * - 回归指令集
     * - 递归指令集
     * 最终目的是提取对应的 $identifier 以确认模型标识符，然后执行处理
     */
    const {
        fabric,
        vector = {}
    } = config;
    let identifier;
    if (Ux.isArray(fabric)) {
        // 执行 fabric 流程（DataEvent事件流）
        const fabricFn = __Zn.etPure(reference, fabric);
        const dataEvent = Dsl.getEvent(null);
        const outEvent = await fabricFn(dataEvent);
        const $identifier = outEvent.getPrev();
        identifier = $identifier ? $identifier : vector.__DEFAULT__;
    } else {
        /*
         * 不执行 fabric 流程，不执行该流程时为了防止 $identifier丢失，
         * 此处需要计算 $identifier 确认下层函数。
         */
        identifier = $identifier ? $identifier : vector.__DEFAULT__;
    }
    const response = await __puWayControl(reference, identifier);
    Ux.dgDebug(response, "「Pu」Process Unit / 最终响应数据：", "#473C8B")
    return response;
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    /*
     * pu = Process Unit
     */
    puControl,
}