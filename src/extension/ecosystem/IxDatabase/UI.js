import React from 'react';
import Ux from 'ux';
import {component} from 'web';
import Ex from 'ex';
import Op from './op';

/*
 * 自定义组件，编辑数据库Json
 */
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