import { isDebug } from 'environment';

import DataLobar from '../DataLabor';
import ActionForm from './ActionForm';

const _formResumit: Function = (
    props: any = {},
    id: string,
    submitting: boolean = false
) => {
    const { fnFlush } = props;
    if (fnFlush) {
        const state: any = {};
        state[`hoc.form.${id}`] = {
            submitting
        };
        fnFlush(DataLobar.createIn(state, null));
    }
};
class ActionRedux extends ActionForm {
    private self: any = null;
    private id: string = null;
    constructor(reference: any, redux: any) {
        super(reference);
        this.self = reference;
        if (redux) {
            this.id = redux.id;
        } else {
            console.warn("[TS-VI] ActionRedux config must be valid.");
        }
    }

    rebind(reference: any) {
        this.self = reference;
    }
    // 外围需要使用该函数
    resubmit(id: string, submitting: boolean = false): void {
        const reference = this.self;
        _formResumit(reference.props, id, submitting);
    }

    $submit(fnCallback: Function): Function {
        if (!this.id) {
            console.warn(
                "[TS-VI] ActionRedux configuration is invalid. id = " + this.id
            );
            return () => {};
        }
        const opRef: ActionRedux = this;
        const reference = this.self;
        const props: any = reference.props;
        const id = this.id;
        const { form } = props;
        return (event: any) => {
            event.preventDefault();
            // 防重复提交
            _formResumit(props, id, true);
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
                    _formResumit(props, id);
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
                        "[TS-VI] ActionRedux, fnCallback parameter is not set."
                    );
                }
            });
        };
    }
}

export default ActionRedux;
