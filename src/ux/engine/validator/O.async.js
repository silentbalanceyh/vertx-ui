import Parser from '../expression';

import E from '../../error';
import Abs from "../../abyss";
import Ajax from '../../ajax';

const existing = (refereuce = {}) => (rule = {}, value, callback) => {
    E.fxTerminal(!rule.config, 10022, rule.config);
    if (rule.config) {
        if (value) {
            // 有值才验证
            const parameters = Parser.parseAjax(refereuce, rule.config.params);
            // 基本条件
            const field = rule.field;
            parameters[field] = value;
            const {$inited} = refereuce.props;
            if ($inited) {
                const {key: $key} = $inited;
                if ($key) {
                    // 更新Mode
                    const updateKey = `key,<>`;
                    parameters[updateKey] = $key;
                }
            }
            // existing 时，参数间关系默认为 AND
            if (Object.keys(parameters).length > 1) {
                const andKey = "";
                parameters[andKey] = true;
            }
            // 北二 existing 走 搜索流程, 所有参数都放到criteria 中
            const params = {"": true};
            params["criteria"] = Abs.clone(parameters);
            // 远程调用
            Ajax.asyncTrue(rule.config, params, {
                // 存在即返回message
                success: () => callback(rule.message),
                failure: () => callback()
            });
        } else {
            callback();
        }
    }
};
export default {
    existing
};