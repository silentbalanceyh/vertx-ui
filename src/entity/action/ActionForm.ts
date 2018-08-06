import { isDebug } from "environment";
import * as Immutable from "immutable";
const _formResubmit: Function = (
    reference: any = {},
    submitting: boolean = false
) => {
    let state = reference.state ? reference.state : {};
    state = Immutable.fromJS(state).toJS();
    state.submitting = submitting;
    reference.setState(state);
};

class ActionForm {
    private reference: any = null;

    constructor(reference: any) {
        this.reference = reference;
    }
    /**
     * 返回绑定的Component
     */
    ref() {
        return this.reference;
    }

    rebind(reference: any) {
        this.reference = reference;
    }

    // 外围需要使用该函数
    resubmit(id: string, submitting: boolean = false): void {
        _formResubmit(this.reference, submitting);
    }

    $reset(fnCallback: Function): Function {
        const props: any = this.reference.props;
        const formRef = props.form;
        const { $initial } = props;
        return (event: any) => {
            event.preventDefault();
            if (formRef && formRef.resetFields) {
                formRef.resetFields();
                // 初始化Form值
                if ($initial && $initial.is()) {
                    formRef.setFieldsValue($initial.to());
                }
                // Reset回调函数
                if (fnCallback) {
                    fnCallback(props);
                }
            }
        };
    }

    $submit(fnCallback: Function): Function {
        const opRef: ActionForm = this;
        const reference = this.reference;
        const props: any = reference.props;
        const { form } = props;
        return (event: any) => {
            event.preventDefault();
            // 防重复提交
            _formResubmit(reference, true);
            form.validateFields((errors: any, values: any) => {
                if (isDebug()) {
                    console.log(
                        "%c [TS-VI] Submitted values = ",
                        "color:crimson;font-weight:900",
                        values
                    );
                }
                // 是否包含验证信息
                if (errors) {
                    _formResubmit(reference);
                    return;
                }
                // 最终提交
                if (fnCallback) {
                    // 过滤values
                    for (const key in values) {
                        if (undefined === values[key]) {
                            delete values[key];
                        }
                    }
                    fnCallback(values, opRef);
                } else {
                    console.warn(
                        "[TS-VI] ActionForm, fnCallback parameter is not set."
                    );
                }
            });
        };
    }
}

export default ActionForm;
