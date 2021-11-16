import Ux from 'ux';

export default (reference) => {
    /*
     * 基础流程规范，属性中必须包含 $workflow
     * {
     *      "parameter":
     * }
     */
    const {config = {}} = reference.props;
    return ({
        // 读取流程详细信息
        processDefinition: (state) => {
            // 是否 multiple，如果 multiple 则直接返回
            if (config.multiple) {
                return Ux.promise(state);
            }
            const {parameter = {}} = config;
            if (!parameter['definitionKey']) {
                console.error("对不起，您的参数中缺乏 `definitionKey` 参数！", parameter);
                return Ux.promise(state);
            }
            // 读取流程并加载
            return Ux.ajaxGet("/api/up/flow-definition/:code", {
                code: parameter['definitionKey']
            }).then(response => {
                // 单参数 state
                if (state) {
                    return Ux.promise(state, "$workflow", response);
                } else {
                    // 无参数
                    return Ux.promise(response);
                }
            })
        },
        // 初始化
        inited: () => {
            const {$inited = {}, $workflow = {}} = reference.props;
            let initialized = Ux.clone($inited);
            if ($inited.record) {
                // 先执行 record 的 initial
                const {record} = $workflow;
                let normalized = Ux.clone($inited.record);
                if (record && record.initial) {
                    const executor = reference.props[record.initial];
                    if (Ux.isFunction(executor)) {
                        normalized = executor(normalized);
                    }
                }
                Ux.remove(initialized, "record");
                Object.keys(normalized).forEach(field => initialized[`record@${field}`] = normalized[field])
            }

            return initialized;
        },
        // 提交之前的流程开启
        startPre: (state) => {

        },
        // 行为提交专用，流程驱动
        Act: {
            /*
             {
                "roleName": "开发人员",
                "record": {
                    "sizeUi": "1.86MB",
                    "instance": {
                        "uid": "rc-upload-1636725967401-2",
                        "name": "4k0005.jpg",
                        "key": "91157696-661d-412b-8d83-e750f36acab3",
                        "type": "image/jpeg",
                        "size": 1948572,
                        "sizeUi": "1.86MB",
                        "extension": "jpg"
                    },
                    "type": "image/jpeg",
                    "category": "FILE.REQUEST",
                    "size": 1948572,
                    "extension": "jpg",
                    "name": "4k0005.jpg"
                },
                "toUser": "63b5383e-5a2e-44ec-87d4-add096aac548",
                "toGroupMode": "ROLE",
                "name": "Test",
                "toRole": "1f27530f-38db-4662-81d4-46ea15b04205",
                "status": "DRAFT",
                "userName": "开发者",
                "draft": true
            }
             */
            $opDraft: (ref) => (params) => {
                const request = Ux.valueRequest(params);
                request.draft = true;
                const {$workflow = {}} = ref.props;
                request.workflow = $workflow;
                return Ux.ajaxPost("/api/up/flow/start", request);
            },
            $opMove: (ref) => (params) => {

            }
        }
    })
}