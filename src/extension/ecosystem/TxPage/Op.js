import Ux from "ux";
import Ex from 'ex';

const yiPage = (reference, state = {}) => {
    // 从URI路径中读取工作流名称
    const workflow = Ux.toQuery("name");
    if (workflow) {
        // ?name 中有值
        return Ux.ajaxGet("/api/up/flow-definition/:code", {
            code: workflow
        }).then(response => {
            state.$workflow = response;
            // 走 assist 流程
            return Ux.asyncAssist(response['uiAssist'], reference, state)
                .then(Ux.ready).then(Ux.pipe(reference));
        }).catch(() => {
            state.$error = true;
            return Ux.promise(state)
                .then(Ux.ready).then(Ux.pipe(reference));
        })
    } else {
        state.$error = true;
        return Ux.promise(state)
            .then(Ux.ready).then(Ux.pipe(reference));
    }
};
export default {
    /*
     * yiPage：页面初始化
     * yuPage：页面更新
     * yoPage：页面继承属性专用
     */
    yiPage,
    yuPage: (reference, virtual = {}) => {
        const router = reference.props.$router;
        const prev = virtual.props.$router;
        if (router && prev) {
            const cFlow = router._("name");
            const pFlow = prev._("name");
            if (cFlow !== pFlow) {
                Ux.of(reference).readying().handle(() => {
                    yiPage(reference)
                });

                // reference.?etState({$ready: false});
                // yiPage(reference)
            }
        }
    },
    /*
     * 提取核心配置，关联后端 W_FLOW 表结构
     */
    yoPage: (reference, $workflow = {}, $inited = {}) => {
        const {
            startConfig = {},
            runConfig = {},
            generateConfig = {},
            uiConfig = {},
            uiLinkage = {},
        } = $workflow;
        const configuration = Ux.valueOk($workflow, [
            "task",         // 流程名称
            "taskName",     // 任务名称
            "name",
            "definitionId",
            "definitionKey",
            "bpmn",
            "code",
            "type"
        ]);
        const config = {};
        config.start = startConfig[$workflow.task];
        config.run = runConfig[$workflow.task];
        config.generate = generateConfig[$workflow.generate];
        config.ui = uiConfig;
        config.linkage = uiLinkage;
        configuration.config = Ux.valueValid(config);
        /*
         * 数据部分
         */
        if ($inited['flowInstanceId']) {
            configuration.instanceId = $inited['flowInstanceId'];
        }
        if ($inited.taskId) {
            configuration.taskId = $inited.taskId;
            configuration.taskKey = $inited.taskKey;
        }
        /*
         * 继承配置专用
         * configuration -> $workflow
         */
        const inherits = Ex.yoAmbient(reference);
        inherits.$workflow = configuration;
        inherits.$inited = $inited;

        return inherits;
    },
}