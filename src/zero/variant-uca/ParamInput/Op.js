import __Zn from '../zero.uca.dependency';

export default {
    yiPage: (reference) => {
        const state = {};
        /* _op */
        state.$op = __Zn.fromHoc(reference, "op");
        /* 窗口配置 */
        const window = __Zn.fromHoc(reference, "window");
        state.$dialog = __Zn.configDialog(reference, window);
        /* 数据信息 */
        const {value} = reference.props;
        state.data = __Zn.xtExprFlat(value)
        /* onChange 专用 */
        __Zn.of(reference).in(state).ready().done();
        // reference.?etState(state);
        // state.$ready = true;
    },
    yuPage: (reference, virtualRef) => {
        const previous = virtualRef.props.value;
        const current = reference.props.value;

        if (__Zn.isDiff(previous, current)) {
            const {value} = reference.props;
            const data = __Zn.xtExprFlat(value);
            __Zn.of(reference).in({data}).done();
            // reference.?etState({data});
        }
    }
}