import I from './levy.c.api.interface';
import Ux from 'ux';
import __SK from './channel.__.fn.seek.yi.processor';
import __MOD from './channel.macrocosm.fn.yi.modulat';
import __YO from './channel.cm.fn.yo.container.norm';
import __HBT from './habit.fn.parser.action';

const __startAsync = (state) => {
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

const __yiContainer = (reference) => {
    /*
     * $router检查
     */
    const state = {};
    __SK.seekRoute(reference, state);
    /*
     * 动态和静态
     */
    return (state.$dynamic ?
            __startAsync(state)
                /* 先读取模块相关数据 */.then(data => __MOD.yiModule(reference, data))
                /* 再读取页面 */.then(data => I.page(data.$input)
                /* 将页面数据加入 */.then(page => Ux.promise(data, '$output', page)))
                /* 填充 Container / Component 专用配置 */.then(data => __SK.seekPage(reference, data)) :
            __startAsync(state)
    ).then(Ux.ready);
}

const yiContainer = (reference) => __yiContainer(reference).then(state => {
    const {$secure = true, $menus} = reference.props;
    state.$componentKey = Ux.randomUUID();
    if ($secure) {
        // 登陆控制（框架专用）
        Ux.isAuthorized(reference);
        // 在登录控制时，只有菜单不存在的时候才执行 fnApp 初始化菜单
        if (!$menus || !$menus.is()) {
            // 在登录控制的时候执行 $router 的跳转
            reference.props.fnApp();
        }
        Ux.of(reference).in(state).done();
        // reference.?etState(state);
    } else {
        Ux.of(reference).in(state).done();
        // reference.?etState(state);
    }
    return Ux.promise(state);
});

function yiControl() {

    if (1 === arguments.length) {
        const control = arguments[0];
        const config = __YO.yoControl(control);
        return Ux.promise(config);
    } else {
        const control = arguments[0];
        const type = arguments[1];
        /*
         * 合并处理，得到最终的 control 级别的配置
         */
        const ajaxControl = I.control({type, control});
        const ajaxOp = I.ops({control, type: Ux.Env.TYPE_OP.ATOM});
        const parser = __HBT.parserOfButton(null);     // 这个操作可以 null 的引用
        return Ux.parallel([ajaxControl, ajaxOp], "config", "ops").then(response => {
            const {config = {}, ops = []} = response;
            /*
             * 操作专用 __acl 处理
             */
            if ("LIST" === type) {
                Ux.aclOp(config.options, ops);
            }
            return parser.parseControl(config, {type, ops}, true);
        }).catch(console.error);
    }
}

export default {
    yiContainer,
    yiControl,
}
