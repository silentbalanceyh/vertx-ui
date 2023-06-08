import React from 'react';
import {component} from "web";
import Ux from "ux";
import Ex from 'ex';
import renders from "./Renders";
import {Dsl} from 'entity';

/**
 * ## 「组件」`IxRule`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |Ok|Ok|x|
 *
 * @memberOf module:uca/extension
 * @method *IxRule
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const UCA_NAME = "IxRule";
const componentInit = (reference) => {
    const {$source} = reference.props;
    const state = {};
    if (Ux.isArray($source)) {
        state.$a_internal_models = Dsl.getArray($source);
        return Ex.yiPartForm(reference, {
            id: "formRule",
            renders,
            state,
        }, false).then(Ux.ready).then(Ux.pipe(reference));
    } else {
        return Ex.I.attributes($source).then((processed = []) => {
            state.$a_model_attributes = Dsl.getArray(processed);
            return Ex.yiPartForm(reference, {
                id: "formRule",
                renders,
                state,
            }, false).then(Ux.ready).then(Ux.pipe(reference));
        });
    }
}

@component({
    "i18n.cab": require("./Cab.json"),
    "i18n.name": UCA_NAME
})
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    constructor(props) {
        super(props);
        this.state = Ux.xtInitObject(props);
    }

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$form} = this.state;
            const $inited = this.props.value;
            return Ux.aiFormInput(this, $inited, $form);
        }, Ex.parserOfColor(UCA_NAME).form({off: true}))
    }
}

export default Component