import React from 'react';
import {LoadingContent} from 'zi';
import __Zn from '../zero.uca.dependency.dialog.UNLOCK';

// =====================================================
// componentInit/componentUp
// =====================================================
const fnSaveRow = (reference) => (params, config = {}) => {
    const request = __Zn.dataRequest(params);
    /*
     * 提取 rxRow 函数（必须包含）
     */
    return __Zn.formRow(reference, request, config);
}

const componentInit = (reference) => {
    const state = {};
    /*
     * 表单配置
     */
    const {config = {}} = reference.props;
    return __Zn.capForm(reference, {form: config}).then(response => {
        const {form = {}, addOn} = response;
        state.raft = __Zn.configForm(form, addOn);
        /*
         * Op 配置
         */
        const ref = __Zn.onReference(reference, 1);
        const {$dialog = {}} = ref.state;
        if ($dialog.__onOk) {
            const op = {};
            /*
             * 外围函数替换
             */
            let executor;
            {
                /*
                * 1. 查看 props 中是否传入了 $op 对象，如果有优先考虑
                * 2. executor 中计算的结果一定会是一个 Function
                * 3. 将 executor 赋值给 $dialog.__onOk 的值得，关联到 $dialog 中
                * */
                const {$op = {}} = reference.props;
                if (__Zn.isFunction($op[$dialog.__onOk])) {
                    /* 抽象一阶 */
                    executor = $op[$dialog.__onOk];
                } else {
                    executor = fnSaveRow;
                }
                op[$dialog.__onOk] = executor;
            }
            state.$op = op;
        }
        return __Zn.promise(state);
    }).then(__Zn.ready).then(__Zn.pipe(reference));
}

class Component extends React.PureComponent {
    // this.formRef.current -> this.props.form
    formRef = React.createRef();

    componentDidMount() {
        componentInit(this);
    }

    render() {
        const {$inited = {}} = this.props;
        return __Zn.xtReady(this, () => __Zn.aiForm(this, $inited), {component: LoadingContent})
    }
}

export default Component
