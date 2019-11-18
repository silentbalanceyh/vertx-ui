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
                    item.fnRender = (props) => Ex.xuiDecorator(controlData, UI, props);
                }
            }
        })
    }
    $tabs.className = "ex-tab"; // 特殊 css
    state.$tabs = $tabs;
    reference.setState(state);
};
export default {
    yiPage
}