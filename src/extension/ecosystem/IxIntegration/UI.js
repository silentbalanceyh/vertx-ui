import React from 'react';
import {component} from "web";
import Ux from "ux";
import Ex from "ex";

/**
 * ## 「组件」`IxIntegration`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |Ok|Ok|x|
 *
 * @memberOf module:web-component
 * @method *IxIntegration
 */
// =====================================================
// componentInit/componentUp
// =====================================================
@component({
    "i18n.cab": require("./Cab.json"),
    "i18n.name": "IxIntegration"
})
class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = Ux.xtInitObject(props);
    }

    componentDidMount() {
        Ex.yiPartForm(this, {}, false)
            .then(Ux.ready).then(Ux.pipe(this));
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$form} = this.state;
            const $inited = this.props.value;
            return Ux.aiFormInput(this, $inited, $form);
        }, Ex.parserOfColor("IxIntegration").form({off: true}))
    }
}

export default Component