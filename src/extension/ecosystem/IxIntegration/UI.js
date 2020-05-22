import React from 'react';
import {component} from "web";
import Ux from "ux";
import Ex from "ex";

/*
 * 自定义组件，编辑数据库Json
 */
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