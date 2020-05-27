import Ux from 'ux';
import Event from './O.event';
import uiColumn from '../Web.Column';

export default {
    yiPage: (reference) => {
        const state = {};
        state.$ready = true;
        /* _op */
        state.$op = Ux.fromHoc(reference, "op");
        /* 窗口配置 */
        const window = Ux.fromHoc(reference, "window");
        state.$dialog = Ux.configDialog(reference, window);
        const table = Ux.fromHoc(reference, "table");
        const $table = Ux.clone(table);
        $table.columns = [uiColumn(reference, state.$op)]
            .concat(Ux.configColumn(reference, $table.columns));
        state.$table = $table;
        /* 数据信息 */
        state.data = Event.toValue(reference);
        /* onChange 专用 */
        reference.setState(state);
    },
    yuPage: (reference, virtualRef) => {
        const previous = virtualRef.props.value;
        const current = reference.props.value;
        if (Ux.isDiff(previous, current)) {
            const $data = Event.toValue(reference);
            reference.setState({$data});
        }
    }
}