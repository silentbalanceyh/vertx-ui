import Ux from 'ux';

export default (reference) => {
    const state = {};
    state.$ready = true;
    /* 构造 $layout 变量 */
    const layout = Ux.fromHoc(reference, "layout");
    const $layout = {};
    if (layout) {
        const {data = {}, ...rest} = layout;
        Object.assign($layout, rest);
        $layout.data = {};
        Object.keys(data).forEach(value => {
            const raw = data[value];

            /* Layout 数据 */
            $layout.data[value] = Ux.configForm(raw, {reference});
        })
    }
    state.$layout = $layout;
    reference.setState(state);
}