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
        const extract = Ex.authData(config.ui, items, views);
        /*
         * 计算的 event 配置，从 extract.config 中提取
         *
         * resourceId1: x1,
         * resourceId2: x2,
         */
        const $config = {};
        if (config.ui) {
            /*
             * 拷贝 datum 节点
             */
            Object.assign($config, config.ui);
        }
        $config.event = extract.config
        state.$config = $config;
        /*
         * 最终处理的数据节点，只有一个
         */
        state.$data = extract.data;
        state.$ready = true;
        reference.setState(state);
    })
}
export default {
    yiPage
}