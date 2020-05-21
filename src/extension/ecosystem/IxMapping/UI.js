import React from 'react';
import {component} from "web";
import Ux from 'ux';

@component({
    "i18n.cab": require("./Cab.json"),
    "i18n.name": "IxMapping"
})
class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = Ux.xtInitObject(props);
    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                Tpl
            </div>
        )
    }
}

export default Component