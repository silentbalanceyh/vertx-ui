import Parser from '../expression';

import E from '../../error';
import Ajax from '../../ajax';

const existing = (refereuce = {}) => (rule = {}, value, callback) => {
    E.fxTerminal(!rule.config, 10022, rule.config);
    if (rule.config) {
        if (value) {
            try {
                // 有值才验证
                const parameters = Parser.parseAjax(rule.config.params, refereuce);
                // 基本条件
                const {alias} = rule.config;
                const field = alias && alias.field ? alias.field : rule.field;

                // 让级别条件支持别名，重新抽取字段
                parameters[field] = value;
                const {$inited} = refereuce.props;

                const key = alias && alias.key ? alias.key : "key";
                if ($inited && $inited[key]) {
                    // 更新Mode
                    const updateKey = `key,<>`;
                    parameters[updateKey] = $inited[key];
                }
                // existing 时，参数间关系默认为 AND（更新专用）
                if (Object.keys(parameters).length > 1) {
                    const andKey = "";
                    parameters[andKey] = true;
                }
                // 远程调用
                Ajax.asyncTrue(rule.config, parameters, {
                    // 存在即返回message
                    success: () => callback(rule.message),
                    failure: () => callback()
                });
            } catch (error) {
                console.error(error);
            }
        } else {
            callback();
        }
    }
};
export default {
    existing
};