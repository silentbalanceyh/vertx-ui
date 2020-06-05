import React from "react";
import Op from './Op';
import {Button, Icon, Input} from 'antd';
import Ux from 'ux';
import './Cab.less';

class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yuPage(this, {state: prevState, props: prevProps});
    }

    render() {
        return Ux.xtReady(this, () => {
            const {$holder = 0, data = []} = this.state;
            const {id = "", styleInput = {}, disabled = false} = this.props;
            /* 构造特殊数组 */
            const input = [];
            for (let idx = 0; idx < $holder; idx++) {
                input.push(idx);
            }
            return (
                <div className={"web-input-array"}>
                    {input.map(each => {
                        const key = `${id}-${each}`;
                        const value = data[each];
                        return (
                            <Input key={key} className={"input-segment"}
                                   addonAfter={
                                       <Icon type={"delete"}
                                             disabled={disabled}
                                             onClick={Op.onRemove(this, each)}/>
                                   } style={styleInput} onChange={Op.rxChange(this, each)}
                                   value={value} disabled={disabled}/>
                        )
                    })}
                    <Button icon={"plus"} size={"small"}
                            disabled={Op.isDisabled(this) || disabled}
                            onClick={Op.onAdd(this)}/>
                </div>
            )
        })
    }
}

export default Component