import React from 'react';
import Ex from 'ex';
import ExForm from '../ExForm/UI';
import Ux from "ux";

/**
 * ## 「组件」`ExRecord`
 *
 * ```js
 * import { ExRecord } from 'ei';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|Ok|
 *
 *
 *
 * @memberOf module:uca/extension
 * @method ExRecord
 * */
// =====================================================
// componentInit/componentUp
// =====================================================
const UCA_NAME = "ExRecord";
const mountOp = (reference, form = {}) => {
    const {$forbidden = {}} = reference.props;
    const $opHidden = $forbidden['op.hidden'];
    if ($opHidden && Ux.isArray(form.ui)) {
        form.ui.forEach(row => row.forEach(cell => {
            if (cell.field && "$button" === cell.field) {
                cell.hidden = true;
            }
            if (cell.metadata && 0 <= cell.metadata.indexOf('$button')) {
                cell.hidden = true;
            }
        }))
    }
    return form;
};

const componentInit = (reference) => {
    const {$name, data = {}} = reference.props;
    const state = {};
    if ($name) {
        Ex.I.form({code: $name}).then(form => {
            state.$config = mountOp(reference, form);
            state.$inited = data;
            Ux.of(reference).in(state).ready().done();
            // reference.?etState(state);
            // state.$ready = true;
        })
    } else {
        console.error("[ Ex ] `ExRecord` 缺少重要变量 $name ");
    }
};
const componentUp = (reference, virtualRef) => {
    const $checked = Ex.upValue(reference.props, virtualRef.props, "$name");
    if ($checked) {
        /*
         * 重刷界面
         */
        Ux.of(reference).readying().handle(() => {
            componentInit(reference);
        }, 0)
        // reference.?etState({$ready: false});
        // Ux.toLoading(() => componentInit(reference));
    }
};

class Component extends React.PureComponent {
    displayName = UCA_NAME;
    state = {
        $ready: false
    };

    componentDidMount() {
        componentInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        componentUp(this, {props: prevProps, state: prevState});
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$config = {}, $inited = {}} = this.state;
            const {$op = {}, rxClose, $edition = {}} = this.props;
            const form = Ex.yoForm(this,
                {form: $config},
                $inited);
            /*
             * 多一阶函数
             */
            return (
                <ExForm {...form} $height={"300px"}
                        rxClose={rxClose}
                        $edition={$edition}
                        $op={$op}/>
            )
        }, Ex.parserOfColor(UCA_NAME).component())
    }
}

export default Component;