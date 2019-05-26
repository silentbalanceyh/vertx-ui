import React from 'react'
import Ux from "ux";
import Op from './Op';
import {Checkbox} from 'antd';
import './Cab.less';
import Fx from "../Fx";

class Component extends React.PureComponent {
    state = {
        $buttons: [],
        $notice: {},
        $selected: [],
    };

    componentDidMount() {
        Op.init(this);
    }

    render() {
        Ux.dgDebug({
            props: this.props,
            state: this.state,
        }, "[Ex] IxEditorColumn：", "#960");
        const {$selected = [], $options = [], $buttons} = this.state;
        const {$config = {}, $loading = false} = this.props;
        const style = Fx.cssGrid($config);
        $buttons.forEach(button => button.loading = $loading);
        return (
            <div className={"ex-column"}>
                <Checkbox.Group value={$selected} onChange={Op.onSelected(this)}
                                className={"group"}>
                    {$options.map(item => {
                        return (
                            <div style={style} key={item.key} className={"item"}>
                                <Checkbox key={item.key} value={item.key}>
                                    {item.label}
                                </Checkbox>
                            </div>
                        )
                    })}
                </Checkbox.Group>
                <div className={"button"}>
                    {Ux.rtGroup(this, $buttons)}
                </div>
            </div>
        )
    }
}

export default Component