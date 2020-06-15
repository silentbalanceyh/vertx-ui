import Ux from 'ux';
/*
 * 构造表单编辑器专用的状态
 */
export default (reference) => {
    const state = {};
    const {$inited = {}} = reference.props;
    /*
     * 读取模型和表单
     */
    const {
        key,        // 表单主键
        identifier  // 模型标识
    } = $inited;
    const failure = Ux.fromHoc(reference, "failure");
    /*
     * 模型加载
     */
    const model = Ux.elementUniqueDatum(reference,
        "resource.models", "identifier", identifier);
    if (model) {
        const modelKey = model.key;
        /*
         * 并行读取两个数据
         */
        return Ux.parallel([
            Ux.ajaxGet("/api/model/:key",
                {key: modelKey}),                     // 读取模型数据
            Ux.ajaxPost("/api/ui/control",
                {control: key, type: "FORM"}),        // 读取表单
            Ux.ajaxPost("/api/ui/ops",
                {control: key}),                      // 读取操作
        ], "models", "raft", "op").then((response = {}) => {
            const {models, raft = {}, op = []} = response;
            state.$models = models;
            const $raft = raft.form;
            if (Ux.isArray(op) && 0 < op.length) {
                const $op = {};
                op.forEach(eachOp => $op[eachOp['clientKey']] = Ux.clone(eachOp));
                $raft.actions = $op;
            }
            state.raft = $raft;
            return Ux.promise(state);
        }).then(Ux.ready).then(Ux.pipe(reference));
    } else {
        const state = {};
        state.error = Ux.formatExpr(failure.model, {identifier});
        reference.setState(state);
    }
}