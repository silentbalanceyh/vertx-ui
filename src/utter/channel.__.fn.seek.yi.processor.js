import Ux from 'ux';

const __isDynamic = ($router) => {
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
const seekPage = (reference, state = {}) => {
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
const seekRoute = (reference, state = {}) => {
    const {$router} = reference.props;
    if ($router) {
        /*
         * 动态静态分离
         */
        const extracted = __isDynamic($router);
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
export default {
    seekPage,
    seekRoute,
}