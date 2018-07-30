import {createAction} from 'redux-act';
import {Taper, zero} from "environment";
import {DataLabor, RxEtat, RxFlow, RxJet} from "entity";
import {Set} from 'immutable'
import routeData from '../route'
import Random from './Ux.Random'
import Dg from './Ux.Debug';
import Cv from './Ux.Constant';
import AiStream from './stream/Ai.Stream'

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
    // 和Zero绑定专用的配置方法，Stream模式
    rxEtat: (cab) => RxEtat.from(cab),
    // 和Zero绑定专用的操作方法，Stream模式
    rxJet: () => RxJet.from(),
    // 和Zero绑定专用的性能压缩器
    rxFlow: (action) => RxFlow.from(action),
    // 和Zero绑定专用的Ui方法，Stream模式
    auiTab: (reference) => new AiStream(reference).tabs().init(),
    auiTable: (reference) => new AiStream(reference).table().init()
}
