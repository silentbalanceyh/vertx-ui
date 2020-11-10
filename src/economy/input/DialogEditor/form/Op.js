import Ux from 'ux';

const fnSaveRow = (reference) => (params, config = {}) => {
    const request = Ux.valueRequest(params);
    /*
     * 提取 doRow 函数（必须包含）
     */
    const {doRow, $mode} = reference.props;
    if (Ux.isFunction(doRow)) {
        if (Ux.Env.FORM_MODE.ADD === $mode && !config.close) {
            /*
             * 添加过后（重置当前表单）
             */
            Ux.formReset(reference);
            let {$inited = {}} = reference.props;
            $inited = Ux.clone($inited);
            $inited.key = Ux.randomUUID();      // 添加了新记录，需要变更 key
            doRow(request, {
                $submitting: false, // 关闭提交
                $inited,            // 继续添加，处于添加模式比较特殊
            });
        } else {
            doRow(request, {
                $visible: false,    // 关闭窗口
                $submitting: false, // 关闭提交
            })
        }
        reference.setState({$loading: false});
    } else {
        throw new Error("[ Ux ] DialogEditor 中缺失核心函数 doRow()");
    }
    return Ux.promise(request);
}

const yiFormPage = (reference) => {
    const state = {};
    /*
     * 表单配置
     */
    const {config = {}} = reference.props;
    return Ux.capForm(reference, {form: config}).then(response => {
        const {form = {}, addOn} = response;
        state.raft = Ux.configForm(form, addOn);
        /*
         * Op 配置
         */
        const ref = Ux.onReference(reference, 1);
        const {$dialog = {}} = ref.state;
        if ($dialog.__onOk) {
            const op = {};
            /*
             * 外围函数替换
             */
            let executor;
            {
                /*
                * 1. 查看 props 中是否传入了 $op 对象，如果有优先考虑
                * 2. executor 中计算的结果一定会是一个 Function
                * 3. 将 executor 赋值给 $dialog.__onOk 的值得，关联到 $dialog 中
                * */
                const {$op = {}} = reference.props;
                if (Ux.isFunction($op[$dialog.__onOk])) {
                    /* 抽象一阶 */
                    executor = $op[$dialog.__onOk];
                } else {
                    executor = fnSaveRow;
                }
                op[$dialog.__onOk] = executor;
            }
            state.$op = op;
        }
        return Ux.promise(state);
    }).then(Ux.ready).then(Ux.pipe(reference));
}
export default {
    yiFormPage,
}