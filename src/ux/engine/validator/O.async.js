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

                /*
                 * 关于 key 的计算
                 * 1）$inited 为初始 key
                 * 2）form 中还会包含最新的 key（如果这个过程中会出现变更）
                 */
                {
                    const {$inited} = refereuce.props;
                    const hitField = alias && alias.key ? alias.key : "key";

                    let hitValue = $inited ? $inited[hitField] : undefined;

                    /*
                     * 追加流程，如果 form 的某些操作更改了当前 form 中存在的 key，则需要
                     * 将 hitValue 重新设值成新的 key 而不是旧的
                     */
                    const {form} = refereuce.props;
                    if (form) {
                        const changed = form.getFieldsValue();
                        if (!!changed[hitField] && hitValue !== changed[hitField]) {
                            hitValue = changed[hitField];
                        }
                    }

                    if (hitValue) {
                        // 更新Mode
                        const updateKey = `key,<>`;
                        parameters[updateKey] = hitValue;
                    }
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
const uri = (refereuce = {}) => (rule = {}, value, callback) => {
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

                // existing 时，参数间关系默认为 AND（更新专用）
                if (Object.keys(parameters).length > 1) {
                    const andKey = "";
                    parameters[andKey] = true;
                }
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
    /*
     * 返回为 true 的时候，是提示验证信息
     * 返回为 false 的时候，是验证通过
     */
    existing,
    uri,
};