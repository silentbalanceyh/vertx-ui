import Ux from 'ux';

const onSpin = (reference) => (event) => {
    Ux.prevent(event);
    reference.setState({
        $forbidden: false,     // 可执行主屏幕操作
        $popover: undefined,   // 将所有的 popover 全部关闭
    });
}
const onLayout = (reference) => (params = {}) => {
    /*
     * 布局表单更新数据信息
     */
    const {raft} = reference.state;
    if (raft) {
        /*
         * 直接变更 form 节点的数据（修改原始数据）
         */
        const {form} = raft;
        if (form) {
            form.columns = Ux.valueInt(params.columns, 4);
            form.window = Ux.valueInt(params.window, 1);
            const {className = ""} = form;
            const inputCls = params.className ? params.className : "";
            if ("APPEND" === params['cssMode']) {
                form.className = `${className} ${inputCls}`;
            } else {
                form.className = inputCls;
            }
        }
        /* 更新 */
        reference.setState({
            raft: Ux.clone(raft),
            $forbidden: false,     // 可执行主屏幕操作
            $popover: undefined,   // 将所有的 popover 全部关闭
        });
    } else {
        console.error("引用搜索失败！！", reference)
    }
}
export default {
    onSpin,
    raft: (reference) => ({
        onLayout: onLayout(reference)
    })
}