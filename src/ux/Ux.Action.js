import Immutable from 'immutable';
import Ux from "ux";

const runSubmit = (reference = {}, fnSuccess) => {
    const {form, $key} = reference.props;
    if (form) {
        form.validateFieldsAndScroll((error, values) => {
            if (error) {
                return;
            }
            const params = Immutable.fromJS(values).toJS();
            params.language = Ux.LANG;
            params.key = $key;
            // 去掉undefined
            for (const key in params) {
                if (params.hasOwnProperty(key)) {
                    const value = params[key];
                    if (undefined === value) {
                        delete params[key];
                    }
                }
            }
            // Post方法处理数据信息
            if (fnSuccess) {
                fnSuccess(params);
            }
        });
    } else {
        console.error("[VI] Form Submitting met errors, reference is null.", form);
    }
};
export default {
    runSubmit
}
