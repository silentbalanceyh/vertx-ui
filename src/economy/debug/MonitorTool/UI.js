import React from 'react';
import {Button, Tooltip} from 'antd';
import {_zero} from "../../_internal";
import Op from './Op';
import Tool from './UI.Tool';

@_zero({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI"
})
class Component extends React.PureComponent {
    componentDidMount() {
        const buttons = Op.initTool(this);
        this.setState({buttons});
    }

    render() {
        const {buttons = [], show = false, ...rest} = this.state;
        const lefts = {};
        Object.keys(rest).filter(key => "$hoc" !== key && "error" !== key)
            .forEach(key => lefts[key] = rest[key]);
        buttons.forEach(item => item.disabled = show);
        return (
            <div>
                <Button.Group className={"zero-debug-button"}>
                    {buttons.map(button => {
                        const {key, tip, ...rest} = button;
                        return (
                            <Tooltip title={tip} key={key} trigger={"contextMenu"}>
                                <Button {...rest}/>
                            </Tooltip>
                        );
                    })}
                </Button.Group>
                <Tool {...this.props} reference={this} $drawer={lefts}/>
            </div>
        );
    }
}

export default Component;