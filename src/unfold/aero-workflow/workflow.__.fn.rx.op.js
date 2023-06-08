import Ux from "ux";
import __DATA from './workflow.__.fn.data.norm';

const rxQueryFn = (reference) => (criteria) => {
    Ux.dgDebug(criteria, "构造的查询条件", "#58c623");
    let {$queryDefault = {}} = reference.state;
    const $query = Ux.clone($queryDefault);
    $query.criteria = Ux.assign($query.criteria, criteria, 1);
    Ux.of(reference).in({$query: Ux.clone($query)}).done();
    // reference.?etState({$query: Ux.clone($query)});
}
const rxCloseFn = (reference) => (data = {}) => {
    // DRAFT 草稿继续编辑并提交
    const name = Ux.toQuery("name");
    if ("DRAFT" === data.status && "DRAFT" === data.phase) {
        /*
         * 暂存白屏处理，如果无法检索 target，则 target 为当前页面
         * 由于系统计算路由会根据 target 执行深度计算，所以此处需在
         * 点击暂存提交之后直接跳转一个没有出现在 menuData 中的页面
         * 该页面会返回 null 值导致菜单不正常，所以此处执行target的
         * 深度计算。
         */
        let target = Ux.toQuery("target");
        if (!target) {
            const {$router} = reference.props;
            target = $router.path();
        }
        Ux.toRoute(reference, `/workflow/run`, {
            name, _tid: data.key,
            target,
        });
    } else {
        Ux.toRoute(reference, `/workflow/queue`, {
            name
        });
    }
}
const rxRowFn = (reference) => (record = {}, config = {}) => Ux.ajaxPost("/api/up/flow-form/false", {
    instanceId: record['flowInstanceId']
}).then(response => {
    // 这一步很重要，提取 node 参数专用
    const {action, dialog} = config;
    const {workflow = {}} = response;
    const $workflow = Ux.clone(reference.props.$workflow);
    Object.assign($workflow, workflow);

    if (record['flowInstanceId']) {
        $workflow.instanceId = record['flowInstanceId'];
    }
    if (record.taskId) {
        $workflow.taskId = record.taskId;
        $workflow.taskKey = record.taskKey;
    }

    const request = __DATA.dataRequest(record,
        {workflow: $workflow});
    // Record Key injection
    request.record = {};
    request.record.key = request.modelKey;
    const executor = Ux.isFunction(action) ? action : () => {
        console.warn("`action`参数丢失", config);
        return Ux.promise(request);
    };
    return executor(request)
        .then(() => Ux.sexDialog(reference, dialog,
                () => Ux.of(reference).in({$forceUpdate: Ux.randomString(8)}).done())
            // () => reference.?etState({$forceUpdate: Ux.randomString(8)}))
        )
        .catch(error => Ux.ajaxError(reference, error));
})
export default {
    rxQueryFn,
    rxCloseFn,
    rxRowFn,
}