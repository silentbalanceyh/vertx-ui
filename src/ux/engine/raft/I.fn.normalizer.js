import Normalizer from './O.raft.normalizer';

export default (reference, item = {}) => {
    if (item.optionConfig && item.optionConfig.normalize) {
        const expr = item.optionConfig.normalize;
        if (expr) {
            const segments = expr.toString().split(",");
            if (1 < segments.length) {
                // 读取类型
                const type = segments[0];
                const executor = Normalizer[type];
                if (executor) {
                    // 参数准备
                    const args = [];
                    for (let idx = 1; idx < segments.length; idx++) {
                        args.push(segments[idx]);
                    }
                    // 函数调用
                    const jFun = executor.apply(null, args);
                    if (jFun) {
                        item.optionConfig.normalize = jFun;
                    }
                }
            }
        }
    }
}