import Ux from 'ux';

const fnClear = (reference = {}) => (event) => {
    event.preventDefault();
    reference.setState({selectedRowKeys: []});
};
const _fnDialog = (reference = {}, dialogKey = "") => {
    Ux.fadeIn(reference);
    reference.setState({dialogKey});
};
const fnAdd = (reference = {}, dialogKey = "") => (event) => {
    event.preventDefault();
    // 窗口显示
    _fnDialog(reference, dialogKey);
    // 设置处理专用的key
    reference.setState({selectedKey: undefined});
};
const fnEdit = (reference = {}, dialogKey = "") => (config, id) => (event) => {
    event.preventDefault();
    // 窗口显示
    _fnDialog(reference, dialogKey);
    // 设置处理专用的key
    reference.setState({selectedKey: id});
};
const fnRemove = (reference = {}) => (config, id) => (event) => {
    event.preventDefault();
    Ux.E.fxTerminal(!config.ajax, 10053, config);
    if (config.ajax) {
        // 加载数据处理
        const {$mockRemove} = reference.props;
        Ux.asyncTrue(config.ajax, {id}, {
            success: () => {
                const clean = config.ajax.clean ? config.ajax.clean : [];
                const state = {};
                clean.forEach(item => state[item] = undefined);
                Ux.writeTree(reference, state);
            }
        }, $mockRemove ? $mockRemove : {});
    }
};
export default {
    // 清空
    fnClear,
    // 添加按钮窗口
    fnAdd,
    // 编辑按钮窗口
    fnEdit,
    // 删除按钮
    fnRemove
};
