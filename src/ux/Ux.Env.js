import {createAction} from 'redux-act';
import {Taper, zero} from "environment";
import {DataLabor} from "entity";
import {Set} from 'immutable'
import routeData from '../route'
import Random from './Ux.Random'
import Dg from './Ux.Debug';
import Cv from './Ux.Constant';
import AiStream from './stream/Ai.Stream'
import U from 'underscore'

/**
 * 自动生成路由专用函数
 * @method route
 * @param container 生成路由的Layout组件
 * @param components 生成路由的Page组件
 * @return {Array}
 */
const route = (container = {}, components = {}) => {
    // 先处理定义路由
    const routes = [];
    let $keys = Set(Object.keys(components));
    if (routeData.special) {
        const fnItem = (layout) => componentKey => {
            if (components[componentKey]) {
                const route = {};
                route.container = layout;
                route.component = components[componentKey];
                route.uri = componentKey.replace(/_/g, '/');
                route.key = Random.randomString(16);
                routes.push(route);
                $keys = $keys.remove(componentKey);
            }
        };
        for (const key in routeData.special) {
            // Container
            let layout = undefined;
            if (container[key]) {
                layout = container[key];
            }
            // Components
            if (layout) {
                const componentKeys = routeData.special[key];
                componentKeys.forEach(fnItem(layout));
            }
        }
    }
    // 处理默认模板
    if (routeData.defined) {
        if (container[routeData.defined]) {
            const keyList = $keys.toJS();
            keyList.forEach(componentKey => {
                if (components[componentKey]) {
                    const route = {};
                    route.container = container[routeData.defined];
                    route.component = components[componentKey];
                    route.uri = componentKey.replace(/_/g, '/');
                    route.key = Random.randomString(16);
                    routes.push(route);
                }
            })
        }
    }
    return routes;
};
/**
 * @class Env
 * @description 环境变量专用类信息
 */
export default {
    // 用于处理Null引用
    Null: null,
    // 环境变量专用
    Env: Cv,
    fnOut: Taper.fnFlush,
    // 专用的模式设置，主要用于区分添加和更新
    Mode: {
        CREATE: "CREATE",
        UPDATE: "UPDATE"
    },
    /**
     * Redux专用状态树的写入方法
     * @method dataOut
     * @param data 被写入的数据
     */
    dataOut: (data) => Taper.fnFlush(DataLabor.createIn(data)),
    /**
     * Redux专用状态树的读取方法
     * @method dataIn
     * @param state Redux读取到的状态
     */
    dataIn: (state) => DataLabor.createOut(state),
    /**
     * 初始化专用方法
     * @param input
     */
    init: (input, isArray = false) => {
        let processed;
        if (U.isArray(input)) {
            processed = DataLabor.getArray(input);
        } else if ("object" === typeof input) {
            processed = DataLabor.getObject(input);
        } else {
            processed = (isArray) ? DataLabor.getArray(undefined)
                : DataLabor.getObject(undefined);
        }
        return processed;
    },
    /**
     * 初始化数据
     */
    dataArray: DataLabor.getArray([]),
    dataObject: DataLabor.getObject({}),
    /**
     * 增强版的拷贝方法，支持多种模式
     */
    dgRouter: Dg.dgRouter,
    dgFileJson: Dg.dgFileJson,
    dgForm: Dg.dgForm,
    dgMonitor: Dg.dgMonitor,
    dgScript: Dg.dgScript,
    dgDebug: Dg.dgDebug,
    /**
     * Redux中的Action专用创建函数
     * @method createAction
     * @param path 创建的Action对应的路径
     * */
    createAction: (path) => createAction(`${Cv.KEY_EVENT}${path}`),
    route,
    /**
     * 专用zero的注解
     * @method zero
     */
    zero,
    // 新配置处理，性能压缩器，提交流程化
    rxEtat: DataLabor.rxEtat,
    rxFlow: DataLabor.rxFlow,
    rxOp: DataLabor.rxOp,
    // 和Zero绑定专用的Ui方法，Stream模式
    auiTab: (reference) => new AiStream(reference).tabs().init(),
    auiTable: (reference) => new AiStream(reference).table().init(),
    // 专用CRUD的Mock
    mockCrud: (reference) => new AiStream(reference).mock().init(),
}
