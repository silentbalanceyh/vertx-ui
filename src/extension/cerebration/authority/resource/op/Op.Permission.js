import Ex from 'ex';
import Ux from 'ux';

const yiPermPage = (reference) => {
    const state = {};
    // 读取权限组信息
    const types = Ux.onDatum(reference, "zero.authority");
    /*
         * 构造翻译 permissions 的 DATUM
         * 二义性的 DATUM
         * 1）modelKey -> identifier
         * 2）直接的 identifier
         */
    Ex.authGroups(state, types).then(Ux.ready).then(Ux.pipe(reference));
}
const yoPermCriteria = (reference) => ($selectedKeys = [], item = {}) => {
    if (0 < $selectedKeys.length) {
        const state = {};
        state.$selectedKeys = $selectedKeys;
        const {node = {}} = item;
        if (node.props) {
            const {data} = node.props;
            if (data) {
                state.$selectedData = Ux.clone(data);
            }
        }
        Ux.of(reference).in(state).done();
        // reference.?etState(state);
    }
}
const rxClosePerm = (reference) => (event) => {
    Ux.prevent(event);
    Ux.of(reference).in({
        $selectedKeys: [],
        $selectedData: undefined
    }).done();
    // reference.?etState({$selectedKeys: [], $selectedData: undefined});
}
const rxDeletePerm = (reference) => (event) => {
    Ux.prevent(event);
    Ux.of(reference).in({
        $selectedKeys: [],
        $selectedData: undefined
    }).done();
    // reference.?etState({$selectedKeys: [], $selectedData: undefined});
}
const yuPermPage = (reference) => {
    const {$loading = false} = reference.state;
    if ($loading) {
        const state = {};
        // 读取权限组信息
        const types = Ux.onDatum(reference, "zero.authority");
        Ux.toLoading(() => Ex.authGroups(state, types)
            .then(processed => {
                // 更新成 false，加载成功的处理
                Ux.of(reference).in(processed).load(false).done();
                // processed.$loading = false;
                // reference.?etState(processed);
            }), 32.8)

    }
}
export default {
    yiPermPage,
    yuPermPage,
    yoPermCriteria,
    // Close 关闭按钮
    rxClosePerm,
    // 删除权限集
    rxDeletePerm
}