import Ux from 'ux';

const yiPage = (reference) => {
    const {config = {}, children} = reference.props;
    if (children) {
        reference.setState({error: "Not Allow `children` in current component."})
    } else {
        /*
         * 子表单渲染
         */
        const {pages = {}} = config;
        const raft = {};
        /*
         * 这里调用了 onReference 方法，完美处理了连接问题
         * 保证此处的子组件直接穿透带有 form 的 reference.props
         */
        const ref = Ux.onReference(reference, 1);   // 读取带有 Form 的引用
        const keys = Object.keys(pages);
        const promises = keys.map(activeKey => pages[activeKey])
            .map(form => Ux.capForm(ref, {form}));
        const {$renders = {}} = reference.props;
        Ux.parallel.apply(null, [promises].concat(keys)).then(response => {
            Object.freeze(response);
            /*
             * 多个Form的处理
             */
            Ux.itObject(response, (activeKey, raftConfig = {}) => {
                const {form, addOn = {}} = raftConfig;
                raft[activeKey] = Ux.configForm(form, {
                    ...addOn, renders: $renders,
                });
            });
            /*
             * pages 解析完成过后处理 $tabs
             */
            const state = {};
            const $tabs = Ux.configTab(reference, Ux.toLimit(config, [
                "pages"
            ]));
            if ($tabs.hasOwnProperty('activeKey')) {
                /*
                 * 有状态的 activeKey 优先
                 */
                state.$activeKey = $tabs.activeKey;
            } else {
                if ($tabs.hasOwnProperty("defaultActiveKey")) {
                    /*
                     * 无状态转换成有状态
                     * defaultActiveKey 转换成 $activeKey
                     */
                    state.$activeKey = $tabs.defaultActiveKey;
                }
            }
            $tabs.type = "card";
            {
                /*
                 * items 过滤，执行上层传入的 koTab 函数
                 */
                let $items = Ux.clone($tabs.items);
                const {koTab = () => true} = reference.props;
                $tabs.items = $items.filter(koTab);
            }
            $tabs.items.forEach(item => {
                const raftItem = raft[item.key];
                /*
                 * 延迟处理
                 */
                item.fnChild = (values = {}) => Ux.aiField(ref, values, raftItem);
            });
            /*
             * readOnly 删除 tabBarExtraContent
             */
            if ($tabs.className) {
                $tabs.className = `ux-field-container ${$tabs.className}`;
            } else {
                $tabs.className = `ux-field-container`;
            }
            state.$tabs = $tabs;
            reference.setState(state);
        });
    }
};
const yoExtra = ($tabs = {}, reference) => {
    const tabs = Ux.clone($tabs);
    const {$inited = {}} = reference.props;
    const calculated = Ux.pluginOp(reference, $inited);
    if (!calculated.edition && !calculated.deletion) {
        delete tabs.tabBarExtraContent;
    } else {
        const {fnExtra} = tabs;
        const {$activeKey} = reference.state;
        if (Ux.isFunction(fnExtra)) {
            tabs.tabBarExtraContent = fnExtra($activeKey);
        }
    }
    return tabs;
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    yiPage,
    yoExtra
}