import React from 'react';
import Ux from 'ux';
import {component} from 'web';
import Ex from 'ex';
import Op from './Op';

/**
 * ## 「组件」`IxDatabase`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |Ok|Ok|x|
 *
 * @memberOf module:uca/extension
 * @method *IxDatabase
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const UCA_NAME = "IxDatabase";

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
        Ex.yiPartForm(this, {
            onChange: Op.onChange(this),
            renders: Op.renders
        }, false).then(Ux.ready).then(Ux.pipe(this))
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