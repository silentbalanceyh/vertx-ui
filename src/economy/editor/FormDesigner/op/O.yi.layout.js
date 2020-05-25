import Ux from 'ux';

export default (reference) => {
    const state = {};
    state.$ready = true;
    /* 构造 $layout 变量 */
    const layout = Ux.fromHoc(reference, "layout");
    const $layout = {};
    if (layout) {
        const {data = {}, title = ""} = layout;
        state.$layoutTitle = title;
        Object.keys(data).forEach(value => {
            const raw = data[value];

            /* Layout 数据 */
            $layout[value] = Ux.configForm(raw, {reference});
        })
    }
    state.$layoutData = $layout;
    reference.setState(state);
}