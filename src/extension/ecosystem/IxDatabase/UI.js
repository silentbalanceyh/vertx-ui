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
 * @memberOf module:web-component
 * @method *IxDatabase
 */
// =====================================================
// componentInit/componentUp
// =====================================================
@component({
    "i18n.cab": require("./Cab.json"),
    "i18n.name": "IxDatabase"
})
class Component extends React.PureComponent {
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
        }, Ex.parserOfColor("IxDatabase").form({off: true}))
    }
}

export default Component