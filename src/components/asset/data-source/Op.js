import {Fn} from "app";
import Ux from 'ux';

const rxSelect = (reference) => ($sourceKey, item) => {
    if ($sourceKey) {
        // 区分点击的是数据源，还是物理表
        if (Fn.Cv.Types.DataSource === item.type) {
            // 选择的是数据源
            const {data} = item;
            const $selected = Fn.inDataSource(reference, data);
            reference.setState({$type: item.type, $selected})
        } else if (Fn.Cv.Types.DataTable === item.type) {
            // 选择物理表，多读取一层（读取物理表中的属性）
            const {data} = item;
            const $selected = Fn.inDataTable(reference, data);
            reference.setState({$type: item.type, $selected})
        }
    }
}
const rxRefresh = (reference) => (values) => {
    // 刷新相关信息
    const state = {};
    state.$selected = values;
    state.$refresh = Ux.randomString(8);
    reference.setState(state);
}
const yiPage = (reference) => {
    const assert = Ux.fromHoc(reference, "assist");
    Ux.asyncAssist(assert, reference, {})
        .then(Ux.ready).then(Ux.pipe(reference))
}
export default {
    rxSelect,
    rxRefresh,
    yiPage,
}