import Opts from '../options';
import Ux from 'ux';

const {Option, Op} = Opts;
export default (reference, config = {}) => {
    const {options = {}} = config;
    return new Promise((resolve) => {
        if (options[Option.DYNAMIC_OP]) {
            /* 动态 Op */
        } else {
            /* 静态 Op */
            const opts = Ux.clone(options);
            /* 过滤 `op.` 打头的 */
            const result = {};
            Object.keys(opts).filter(opKey => opKey.startsWith('op.'))
                .forEach(opKey => result[opKey] = opts[opKey]);
            resolve(result);
        }
    }).then((ops = {}) => {
        /* 转换按钮处理 */
        const buttons = {};
        Object.keys(ops)
            .filter(opKey => !!opKey).filter(opKey => "string" === typeof opKey)
            .forEach(opKey => {
                let button = Ux.clone(Op[opKey]);
                if (button) {
                    button.id = button.key;         // 同步前端和后端专用
                    button.text = ops[opKey];
                    if (!button.config) button.config = {};
                    button.category = opKey;
                    buttons[opKey] = button;
                }
            });
        return new Promise((resolve) => resolve(buttons))
    });
}