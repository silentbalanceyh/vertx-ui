import React from 'react';
import './Cab.less'
import Op from './Op';
import {_zero} from "../../_internal";
import Rdr from './UI.Render';
import {Input} from 'antd';
import Ux from "ux";

@_zero({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
    state: {
        fileList: [],
        $counter: 0
    }
})
class Component extends React.PureComponent {

    componentDidMount() {
        const handler = Op.getHandler(this);
        this.setState({handler});
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        Ux.xtUnsafe(this, nextProps);
    }
    
    render() {
        return (
            <Input.Group className={"web-file-upload"}>
                {Rdr.renderFile(this)}
                {Rdr.renderPreview(this)}
            </Input.Group>
        );
    }
}

export default Component;