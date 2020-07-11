import Ex from 'ex';
import Ux from 'ux';

const yiPermPage = (reference) => {
    const state = {};
    // 读取权限组信息
    const {$category = {}} = reference.props;
    Ex.authGroups(state, $category)
        .then(processed => {
            /*
             * 构造翻译 permissions 的 DATUM
             * 二义性的 DATUM
             * 1）modelKey -> identifier
             * 2）直接的 identifier
             */
            return Ux.promise(processed);
        })
        .then(Ux.ready).then(Ux.pipe(reference));
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
        reference.setState(state);
    }
}
const yoPermClose = (reference) => (event) => {
    Ux.prevent(event);
    reference.setState({$selectedKeys: [], $selectedData: undefined});
}
const yuPermPage = (reference) => {
    const {$loading = false} = reference.state;
    if ($loading) {
        const state = {};
        // 读取权限组信息
        const {$category = {}} = reference.props;
        Ux.toLoading(() => Ex.authGroups(state, $category)
            .then(processed => {
                // 更新成 false，加载成功的处理
                processed.$loading = false;
                reference.setState(processed);
            }), 32.8)

    }
}
export default {
    yiPermPage,
    yuPermPage,
    yoPermCriteria,
    yoPermClose
}