import {Langue} from "environment";
import * as Immutable from "immutable";

import HocContainer from "../hoc/HocContainer";

const fnTriggerEvent: Function = (
    config: any,
    extension: any = {},
    field: string
) => {
    // 异步字段必须关闭onChange触发条件
    if (extension["_asyncFields"]) {
        const fields = Immutable.fromJS(extension["_asyncFields"]);
        if (fields.contains(field)) {
            config.validateTrigger = ["onBlur"];
        } else {
            config.validateTrigger = ["onBlur", "onChange"];
        }
    } else {
        config.validateTrigger = ["onBlur", "onChange"];
    }
};

const fnValueProps: Function = (
    config: any,
    extension: any = {},
    field: string
) => {
    if (extension["_valueProps"]) {
        const options = extension["_valueProps"];
        // 属性协变专用处理
        if (options && options.hasOwnProperty(field)) {
            config.valuePropName = options[field];
        }
    }
};

const fnNormalize: Function = (
    config: any,
    extension: any = {},
    field: string,
    normalizer: any
) => {
    if (normalizer && extension["_normalize"]) {
        const normalize: any = extension["_normalize"];
        if (normalize && normalize[field]) {
            const expr = normalize[field];
            // 解析表达式
            if (expr) {
                const segments = expr.split(",");
                if (1 < segments.length) {
                    // 读取类型
                    const type = segments[0];
                    const executor = normalizer[type];
                    if (executor) {
                        // 参数准备
                        const args = [];
                        for (let idx = 1; idx < segments.length; idx++) {
                            args.push(segments[idx]);
                        }
                        // 函数调用
                        const jFun = executor.apply(this, args);
                        if (jFun) {
                            config.normalize = jFun;
                        }
                    }
                }
            }
        }
    }
};

const fnField = (fields: Array<String> = []) => {
    let result = [];
    fields.forEach((field: string) => {
        if (Array.isArray(field)) {
            result = result.concat(fnField(field));
        } else {
            result.push(field);
        }
    });
    return result;
};

/**
 * 表单专用数据模型，用于配置表单各种关联项
 * @class HocForm
 */
class HocForm implements HocContainer {
    private hoc: any = {};
    private validators: any = null;
    private normalizer: any = null;
    private readonly ready: boolean = false;
    private form: any = {};
    // Form专用配置
    private readonly _rules: any = {};
    private readonly _fields: Array<String> = [];
    private readonly _placeholders = {};
    private readonly _button: any = {};
    private readonly _logicals: any = {};
    private readonly _dialog: any = {};
    private readonly _extension: any = {};

    constructor(name: string, hoc: Object) {
        const lg = Langue(name);
        this._button = lg["_button"];
        this._logicals = lg["_logicals"];
        // 逻辑节点数据
        this._dialog = lg["_dialog"];
        this.ready = lg && 0 < Object.keys(lg).length;
        this.hoc = hoc;
        // 1.扫描基本配置
        this._rules = lg["_rules"];
        this._fields = lg["_fields"];
        this._placeholders = lg["_placeholders"];
        this._extension = lg["_extension"];
    }

    emptyValues(): any {
        let fields = this._fields;
        let result = [];
        if (this._extension) {
            const _hiddens = this._extension["_hiddens"];
            // 隐藏操作
            result = result.concat(_hiddens);
            // Field处理
            result = result.concat(fnField(fields));
        }
        const values = {};
        result.forEach((field: string) => {
            values[field] = undefined;
        });
        return values;
    }

    $(field: string, jsx: any, initial: any = {}): any {
        if (field && jsx) {
            if (this.form) {
                const {getFieldDecorator} = this.form;
                const config: any = {};
                // Option选项配置
                if (this._extension) {
                    // 属性协变
                    fnValueProps(config, this._extension, field);
                    // 触发条件
                    fnTriggerEvent(config, this._extension, field);
                    // Normalize
                    fnNormalize(
                        config,
                        this._extension,
                        field,
                        this.normalizer
                    );
                }
                // 验证规则
                if (this._rules) {
                    // 验证规则
                    const rules: Function = this._rules[field];
                    if (rules) {
                        config.rules = rules;
                    }
                }
                // 初始值，初始值包含undefined，用于Ant Design Form设计
                config.initialValue = initial[field];
                return getFieldDecorator(field, config)(jsx);
            } else {
                console.warn(
                    "[TS-VI] Please bind 'props' first to extract 'form'."
                );
            }
        } else {
            console.warn(
                "[TS-VI] Please input required parameters (field, jsx) for form."
            );
        }
    }

    /**
     * 转换成JavaScript，专用Hoc变量合集
     * @returns {Object}
     */
    to(): any {
        const _rules = this._rules;
        const _fields = this._fields;
        const _placeholders = this._placeholders;
        const _button = this._button;
        const _dialog = this._dialog;
        const _logicals = this._logicals;
        const _extension = this._extension;
        return {
            _rules,
            _fields,
            _placeholders,
            _button,
            _dialog,
            _logicals,
            ..._extension
        };
    }

    /**
     * 绑定的时候指定Promise以及默认参数
     */
    bind(props: any, promise: any): HocForm {
        const {form, Verifier, Sateur} = props;
        this.normalizer = Sateur;
        this.validators = Verifier;
        // 2.连接rules中的validators
        for (const key in this._rules) {
            const value = this._rules[key];
            if (Array.isArray(value)) {
                value.forEach(item => {
                    if (item.validator) {
                        // 这里的Verfier全部开发的是Function生成接口
                        item.validator = Verifier[item.validator](
                            form,
                            promise
                        );
                    }
                });
            }
        }
        this.form = form;
        return this;
    }

    // 单独返回初始化配置
    is(): boolean {
        return this.ready;
    }
}

export default HocForm;
