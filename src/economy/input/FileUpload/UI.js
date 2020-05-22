import React from 'react';
import './Cab.less';
import Op from './Op';
import {component} from "../../_internal";
import Rdr from './UI.Render';
import {Input} from 'antd';
import Ux from "ux";

@component({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
    state: {
        fileList: [],
        $counter: 0
    }
})
class Component extends React.PureComponent {

    componentDidMount() {
        Op.initState(this);
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