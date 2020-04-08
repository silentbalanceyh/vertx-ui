import Ux from 'ux';
import Api from '../../ajax';
import yiModule from './yi.module';

const _isDynamic = ($router) => {
    let params = $router.params();
    if (!params) params = {};
    /*
     * 路径
     */
    const path = $router.path();
    const app = Ux.Env['ROUTE'];
    /*
     * 计算 prefix
     */
    const prefix = `/${app}/ui/`;
    if (path.startsWith(prefix)) {
        const {module, page} = params;
        if (module && page) {
            return {app, module, page}
        }
    }
};
/*
 * 处理
 * $container：容器配置
 * $component：内部组件配置
 */
const _seekPage = (reference, state = {}) => {
    const {$output = {}} = state;
    /*
     * $container 解析
     */
    if ($output.layout && !Ux.isEmpty($output.layout)) {
        const $layout = {};
        const {layout = {}} = $output;
        $layout.key = `layout-${layout.key}`;
        $layout.config = layout.config ? layout.config : {};
        /*
         * 解析基础
         */
        $layout.name = layout.name;
        state.$tpl = $layout;
    }
    /*
     * $container 解析
     */
    if ($output['containerName']) {
        const $container = {};
        $container.name = $output['containerName'];
        $container.config = $output['containerConfig'] ? $output['containerConfig'] : {};
        // 解决底层 $metadata 没有值的 BUG
        $container.key = `container-${$output.key}`;
        $container.pageId = $output.key;
        state.$container = $container;
    } else {
        state.$container = false;
    }
    /*
     * $component 解析
     * 1）页面是否安全
     * 2）assist专用配置
     * 3）grid专用配置
     * 4）controls配置
     */
    state.$secure = $output.secure;                         // 重写该属性，鉴别安全页面
    state.$grid = $output.grid ? $output.grid : [];         // 注意数据格式是 []
    state.$assist = $output.assist ? $output.assist : {};
    state.$controls = $output.controls ? $output.controls : {};
    return Ux.promise(state);
};
/*
 * 设置渲染信息
 * $dynamic：
 * = true：动态渲染，Ox Engine
 * = false：静态渲染，Zero UI
 */
const _seekRoute = (reference, state = {}) => {
    const {$router} = reference.props;
    if ($router) {
        /*
         * 动态静态分离
         */
        const extracted = _isDynamic($router);
        if (extracted) {
            Ux.dgDebug(extracted, "[ Ex ] 页面参数: ", "#CD3333");
            state.$input = extracted;
            state.$dynamic = true;
        } else {
            state.$dynamic = false;
            state.$secure = true;       // 静态默认必须是 $secure 的
        }
    } else {
        throw new Error("[ ExR ] $router 变量不存在，检查配置！");
    }
};
const startAsync = (state) => {
    /*
     * 两种情况下需要清空
     * 1）动态页面和动态页面切换时
     * 2）动态页面和静态页面切换时
     */
    state.$tpl = {};
    state.$container = {};
    state.$grid = {};
    state.$assist = {};
    // state.$hoc = null;      // Zero 控制
    state.$controls = {};
    return Ux.promise(state);
};
/**
 * ## 扩展函数
 *
 * ### 模板专用处理器
 *
 * 1. 静态模板
 * 2. 动态模板
 *
 * ### 动态模板判断
 *
 * 1. $router 中的 path 路径以：/ui/ 开头
 * 2. $router 中的参数同时包含：module / page
 *
 * 最终返回 `{ app, module, page }`
 *
 * * $container：容器配置
 * * $component：内部组件配置
 *
 * ### 渲染计算
 *
 * $dynamic：
 *
 * * = true：动态渲染，Ox Engine
 * * = false：静态渲染，Zero UI
 *
 * @memberOf module:_channel
 * @method yiLayout
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Promise<T>} 执行更新过后的状态
 */
export default (reference) => {
    /*
     * $router检查
     */
    const state = {};
    _seekRoute(reference, state);
    /*
     * 动态和静态
     */
    return (state.$dynamic ?
            startAsync(state)
                /* 先读取模块相关数据 */.then(data => yiModule(reference, data))
                /* 再读取页面 */.then(data => Api.page(data.$input)
                /* 将页面数据加入 */.then(page => Ux.promise(data, '$output', page)))
                /* 填充 Container / Component 专用配置 */.then(data => _seekPage(reference, data)) :
            startAsync(state)
    ).then(Ux.ready);
}