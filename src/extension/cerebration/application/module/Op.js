const keyActive = (record) => {
    if (record.active) {
        return ["$opDisabled"];
    } else {
        return ["$opEnabled"];
    }
}
export default {
    yoPlugins: (reference, bag = {}) => ({
        koRow: (record, config) => {
            // 根据类型执行
            const bagType = bag.type;
            let keys = [];
            if ("Z-FOUNDATION" === bagType) {
                /*
                 * 基础模块
                 * 1. 启用/禁用
                 * 2. 配置验证
                 */
                keys = keyActive(record);
                keys.push("$opConfigure");
            } else if ("Z-KERNEL" === bagType) {
                /*
                 * 内核模块
                 * 1. 配置验证
                 */
                keys = ["$opValidate"]
            } else {
                keys = keyActive(record);
                keys.push("$opConfigure");
                keys.push("$opRenew");
            }
            return keys.includes(config.key);
        }
    }),
    yoExecutors: (reference) => ({
        // 更新许可证
        fnRenew: (data, config, metadata) => {

        },
        // 配置验证
        fnValidate: (data, config, metadata) => {

        },
        // 配置
        fnConfigure: (data, config, metadata) => {

        },
        // 启用模块
        fnEnabled: (data, config, metadata) => {

        },
        // 禁用模块
        fnDisabled: (data, config, metadata) => {

        }
    })
}