// @ts-ignore
import Ux from 'ux';

const toReplace = (record = {}, input: any = {}) => {
    const {config = {}, field} = input;
    const {fromValue, toValue} = config;
    // 每一个
    if (fromValue && toValue) {
        const pendingValue = record[field];
        if (pendingValue && pendingValue === fromValue) {
            record[field] = toValue;
        }
    }
    return record;
}
const toArray = (record = {}, input: any = {}) => {
    const {field, config = {}} = input;
    let fields = [];
    if (!Ux.isArray(field)) {
        fields.push(field);
    } else {
        fields = fields.concat(field);
    }
    fields.forEach(field => {
        if (record[field]) {
            let normalized = [];
            if ("string" === typeof record[field]) {
                try {
                    normalized = JSON.parse(record[field])
                } catch (error) {
                }
            } else {
                normalized = record[field];
            }
            const {valueField = [], valueMap = {}} = config;
            // 过滤
            const filtered = [];
            normalized.forEach(each => {
                const filteredItem = {};
                valueField.forEach(field => {
                    const fieldUi = valueMap[field];
                    if (fieldUi) {
                        filteredItem[fieldUi] = each[field]
                    } else {
                        filteredItem[field] = each[field];
                    }
                });
                filtered.push(filteredItem);
            });
            record[field] = filtered;
        }
    })
    return record;
}

const EXECUTOR = {
    "REPLACE": toReplace,
    "ARRAY": toArray,
}

const toUniform = (record, done: any = {}) => {
    if (done.type && done.field) {
        const {config} = done;
        const executor = EXECUTOR[done.type];
        if (Ux.isFunction(executor)) {
            return executor(record, {
                config,
                field: done.field,
            });
        }
    }
}

class Rule {
    private _type;
    private _fnCond: Function;
    private _fnDone: Function;

    constructor(input: any) {
        if (input) {
            const {type, where} = input;
            if (type) {
                this._type = type;
            }
            if (!this._type) {
                throw new Error("请提供规则类型！");
            }
            // 过滤函数
            this._fnCond = (record = {}) => {
                if (where) {
                    const field = where.field;
                    const value = where.value;
                    return (record && value === record[field]);
                } else {
                    // 满足条件
                    return false;
                }
            }
            // 执行函数
            this._fnDone = (record = {}) => {
                if (record && input.done) {
                    // 第一种规则
                    return toUniform(record, input.done);
                } else {
                    // 什么都不做
                    return record;
                }
            }
        }
    }

    condition(record: any): any {
        return Ux.isFunction(this._fnCond) ? this._fnCond(record) : false;
    }

    done(record: any): any {
        return Ux.isFunction(this._fnDone) ? this._fnDone(record) : record;
    }
}

class Codex {
    private _reference: any;
    private _ruleConfig: any;
    private _rules: any;

    private constructor(reference: any) {
        this._reference = reference;
    }

    static from(reference) {
        if (!reference) {
            throw new Error("对不起，必须绑定 reference 变量读取环境数据！");
        }
        return new Codex(reference);
    }

    bind(input: any): Codex {
        if (undefined === input) {
            input = "codex";        // 默认
        }
        let rules = [];
        if ("string" === typeof input) {
            const config = Ux.fromHoc(this._reference, input);
            if (Ux.isArray(config)) {
                rules = Ux.clone(config);
            }
        } else if (Ux.isArray(input)) {
            rules = Ux.clone(input);
        }
        this._ruleConfig = rules;
        this._rules = [];
        rules.forEach(each => {
            const rule = new Rule(each);
            this._rules.push(rule);
        })
        return this;
    }

    done(input: any = []): any {
        const $input = Ux.clone(input);
        this._rules.forEach(eachRule => {
            $input.filter(record => eachRule.condition(record)).forEach(record => {
                eachRule.done(record);
            });
        });
        return $input;
    }
}

export default Codex