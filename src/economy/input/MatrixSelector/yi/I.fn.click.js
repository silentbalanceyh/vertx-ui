import Ux from "ux";

export default (reference, config = {}) => event => {
    // 常用事件处理
    Ux.prevent(event);// 初始化数据
    reference.setState({
        $loading: true,             // 是否在加载
        $visible: true,             // 窗口是否显示
        $data: [],                  // 当前窗口的数据信息
        $tableKey: Ux.randomUUID(), // 专用的表格绑定的key信息
        $keySet: undefined,         // 在窗口中的选中项
    });
    /**
     * 解析Ajax参数信息
     */
    let params = Ux.xtLazyAjax(reference, config);
    const {$filters = {}} = reference.state;
    if (!Ux.isEmpty($filters)) {
        params = Ux.qrCombine(params, reference, $filters);
    }
    Ux.asyncData(config.ajax, params, ($data) => {
        const state = {$data, $loading: false};
        reference.setState(state);
    });
}