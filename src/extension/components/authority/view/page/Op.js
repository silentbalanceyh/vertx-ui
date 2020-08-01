import Ex from 'ex';

const yiPage = (reference) => {
    const state = {};
    const {config = {}, $owner = {}} = reference.props;
    const params = {};
    params.key = config.key;        // 规则 key，用于后端拉取数据
    params.code = config.code;      // 规则编码（键值）
    Object.assign(params, $owner);
    return Ex.authTpl(params).then(response => {
        const {items = [], views = []} = response;
        /*
         * 计算的 event 配置，从 extract.config 中提取
         *
         * resourceId1: x1,
         * resourceId2: x2,
         */
        const $config = {};
        if (config.ui) {
            /*
             * 针对 ui 节点的处理
             */
            const extract = Ex.authData(config.ui, items, views);
            /*
             * 拷贝 datum 节点
             */
            Object.assign($config, config.ui);
            $config.event = extract.config;
            state.$keySet = extract.selected;
            state.$data = extract.data;
        } else if (config.group) {
            /*
             * 针对 ui 节点的处理
             */
            const extract = Ex.authData(config.group, items, views);
            /*
             * 拷贝 datum 节点
             */
            Object.assign($config, config.group);
            const {uiConfig, groupConfig} = config;
            if (uiConfig) $config.ui = uiConfig;
            if (groupConfig) $config.group = groupConfig;
            $config.event = extract.config;
            /*
             * items 已经在 extract 的时候保存在 event 中了，所以这里不需要了
             */
            state.$views = views;
        }
        state.$config = $config;
        /*
         * 最终处理的数据节点，只有一个
         */
        state.$ready = true;
        reference.setState(state);
    })
}
export default {
    yiPage
}