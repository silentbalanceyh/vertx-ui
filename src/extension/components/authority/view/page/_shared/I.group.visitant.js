import Ux from "ux";
import Ex from "ex";
/*
 * 构造
 * $keySet
 * $keyView
 *
 * 主要分为以下几种情况：
 *
 * 1. aclVisible 的数据构造 $keySet
 * 2. aclView 的数据构造 $keyView
 * 3. 根据 group.config.ui.keySet 的配置执行计算
 *
 * 默认都是 item.key 作为 key 来使用，如果 group.config.keySet 配置了数据
 * 则标识 aclVisible 是 item[group.config.ui.keySet] 中的数据，如果数据是值
 * 则直接添加到 $keySet 中，如果数据是 Array 则依次追加每一项
 */
const authKeySet = (response = [], config = {}, state = {}) => {
    if (Ux.isEmpty(response)) {
        state.$keyView = new Set();
        /*
         * 为空，则不替换 $keySet 的值，为了保险执行初始化
         */
        if (!state.$keySet) state.$keySet = new Set();
        return Ux.promise(state);
    } else {
        const {aclView = [], aclVisible = []} = response;
        state.$keyView = new Set(aclView);
        if (0 < aclVisible.length) {
            const {group = {}} = config;
            const {key} = group.config ? group.config : {};
            if (key) {
                if (key.aclVisible && "key" !== key.aclVisible) {
                    const {$source = []} = state;
                    // 需执行计算
                    const checkSet = new Set(aclVisible);
                    // 最终计算的 $keySet
                    const $keySet = new Set();
                    $source.forEach(record => {
                        const value = record[key.aclVisible];
                        if (Ux.isArray(value)) {
                            const count = value.filter(item => checkSet.has(item)).length;
                            if (count === value.length) {
                                $keySet.add(record.key);
                            }
                        } else {
                            if (checkSet.has(value)) {
                                $keySet.add(record.key);
                            }
                        }
                    });
                    state.$keySet = $keySet;
                } else {
                    state.$keySet = new Set(aclVisible);
                }
            } else {
                // 未配置 key，直接执行 $keySet 的原始逻辑
                // aclVisible 中存储的就是 key 值
                state.$keySet = new Set(aclVisible);
            }
        }
        return Ux.promise(state);
    }
}
/*
 * 保证 state 中的 $resources 是有值的
 */
const authDataVisit = (state = {}, config = {}, selectedData = {}) => {
    const params = {};
    /*
     * 资源ID的提取
     */
    params.resourceId = state.$resources;
    const {group = {}} = config;
    const {visitant = {}, vector, vectorField} = group.config ? group.config : {};
    params.type = visitant.type;
    /*
     * 静态资源和业务资源分流
     * 静态资源的 type = resource.tree
     * 业务资源则 type != resource.tree
     */
    if ("resource.tree" === selectedData.type) {
        /*
         * identifier，静态处理专用
         */
        params.identifier = selectedData.identifier;
        params.configKey = "DEFAULT";
    } else {
        if (vector) {
            /*
             * 配置时候走 vector 流程
             * 一个 category 的 key 对应多个 control 的情况
             */
            let foundKey = vectorField ? selectedData[vectorField] : selectedData.key;
            params.configKey = vector[foundKey];
        } else {
            /*
             * 不配置时直接走 key 流程
             * 一个 category 直接对应一个 key
             */
            params.configKey = selectedData.key;
        }
    }
    return params;
}
export default {
    authDataVisit,
    authData: (state = {}, reference) => {
        const {config = {}} = reference.props;
        const {$views = []} = reference.state;
        const {$resources, $source = []} = state;
        if ("string" === typeof $resources) {
            const view = Ux.elementUnique($views, "resourceId", $resources);
            const {event = {}} = config;
            const viewConfig = event[$resources];
            if (view) {
                const original = Ux.clone(viewConfig);
                // 将 view 中的数据拷贝到对应的 original 中
                original.rows.datum = view.rows;
                original.criteria.datum = view.criteria;
                original.projection.datum = view.projection;
                const calculated = Ex.authKeySet($source, original);
                if (calculated.keys) {
                    state.$keySet = new Set(calculated.keys);
                } else {
                    state.$keySet = new Set($source.map(item => item.key));
                }
            } else {
                // 没有找到对应的视图，则直接处理
                state.$keySet = new Set($source.map(item => item.key));
            }
        } else {
            // 防止 undefined 的判断出现
            state.$keySet = new Set();
        }
    },
    authVisit: (state = {}, config, reference) => {
        // 是否选择了资源，如果选择了才执行 visit 流程
        if (state.$resources) {
            // 选择的资源集合
            const {event = {}} = config;
            const resource = event[state.$resources];
            if (resource && resource.visitant) {
                /*
                 * 参数处理
                 */
                const {$owner = {}} = reference.props;
                return Ux.ajaxPost("/api/visitant/:ownerType/:ownerId", {
                    ...$owner,
                    $body: authDataVisit(state, config, state.$selected),
                }).then(response => authKeySet(response, config, state))
            } else return Ux.promise(state);

        } else return Ux.promise(state);
    }
}