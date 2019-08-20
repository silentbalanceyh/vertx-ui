import Ux from 'ux';
import Ex from 'ex';

const yiForm = (reference) => {
    /*
     * 先设置不准备好的状态
     */
    reference.setState({$ready: false}); // 未准备好
    /*
     * 提取配置信息
     * id 为form本身的客户端ID
     */
    const {config = {}, id = ""} = reference.props;
    const {addon = {}} = config;
    addon.reference = reference;    // 反向引用穿透
    let supplier;
    if (config.form) {
        /*
         * 静态
         */
        supplier = () => Ex.promise(config.form);
    } else if (config.control && !config.form) {
        /*
         * 动态
         */
        const {magic = {}, control = ""} = config;
        /*
         * props + state 构造查询参数
         */
        const params = Ux.valueSearch(magic, reference.props, reference.state);
        params.control = control;
        supplier = () => Ex.I.form(params);
    } else {
        /*
         * 混合
         */
        // TODO: 合并表格用
    }
    Ux.toLoading(() => supplier()
        /*
         * Ex / Ox / 原始三种模式合并
         * 1）静态模式（原始）
         * 2）动态模式（Ox）
         * 3）混合（Ex）模式
         */
            .then($ui => Ex.promise(Ex.configForm($ui, addon, id)))
            .then(state => {
                state = Ux.clone(state);
                // Action 专用处理
                yiAction(reference, state);
            })
    );
};
/*
 * 扩展 Op 专用 render 处理
 */
const yiAction = (reference, state) => {
    /*
     * 提取核心配置
     */
    const {config = {}} = reference.props;
    const {form = {}, control} = config;
    const {actions = {}} = form;
    if (actions) {
        /* 检查配置核心信息 */
        Ex.configAction(actions, control).then(result => {
            state.$action = Ux.clone(result);
            state.$ready = true;
            reference.setState(state);
        })
    } else {
        state.$ready = true;
        state.$action = {};
        reference.setState(state);
    }
};
export default {
    yiForm
}