import Ux from 'ux';
import Ex from 'ex';
import UI from 'oi';
import U from 'underscore';

const yiPage = (reference) => {
    const state = {};
    state.$ready = true;
    /*
     * 配置处理
     * 1.主配置
     * 2.子配置
     */
    const {config = {}, $controls = {}} = reference.props;
    /*
     * 主界面处理
     */
    const normalized = Ux.configTab(reference, config);
    const {controls = {}, ...$tabs} = normalized;
    /*
     * 处理 fnRender 部分
     */
    if (U.isArray($tabs.items)) {
        $tabs.items.forEach(item => {
            const controlId = controls[item.key];
            if (controlId) {
                const controlData = $controls[controlId];
                if (controlData) {
                    item.fnRender = (props) =>
                        /* controlData, props, state */
                        Ex.xuiDecorator(controlData, UI, props, reference.state);
                }
            }
        })
    }
    $tabs.className = "ex-tab"; // 特殊 css
    $tabs.onTabClick = () => {
        /* $switcher 变更 */
        const $switcher = Ux.randomString(32);
        reference.setState({$switcher});
    };
    state.$tabs = $tabs;
    const {$inited = {}} = reference.props;
    if (!Ux.isEmpty($inited)) {
        state.$inited = $inited;
    }
    reference.setState(state);
};
export default {
    yiPage
}