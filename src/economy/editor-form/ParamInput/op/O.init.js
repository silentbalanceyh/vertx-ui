import Ux from 'ux';

export default {
    yiPage: (reference) => {
        const state = {};
        state.$ready = true;
        /* _op */
        state.$op = Ux.fromHoc(reference, "op");
        /* 窗口配置 */
        const window = Ux.fromHoc(reference, "window");
        state.$dialog = Ux.configDialog(reference, window);
        /* 数据信息 */
        const {value} = reference.props;
        state.data = Ux.xtExprFlat(value)
        /* onChange 专用 */
        reference.setState(state);
    },
    yuPage: (reference, virtualRef) => {
        const previous = virtualRef.props.value;
        const current = reference.props.value;

        if (Ux.isDiff(previous, current)) {
            const {value} = reference.props;
            const data = Ux.xtExprFlat(value);
            reference.setState({data});
        }
    }
}