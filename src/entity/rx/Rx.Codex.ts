// @ts-ignore
import Ux from 'ux';

class Rule {
    private _type;
    private _fnCond: Function;
    private _fnDone: Function;

    constructor(input: any) {
        if (input) {
            const {type, where, done} = input;
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
                if (done && record) {
                    let replaced = record;
                    const {field, fromValue, toValue} = done;
                    if (field) {
                        const pendingValue = record[field];
                        if (pendingValue && fromValue && toValue) {
                            if (pendingValue === fromValue) {
                                replaced[field] = toValue;
                            }
                        }
                    }
                    return replaced;
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