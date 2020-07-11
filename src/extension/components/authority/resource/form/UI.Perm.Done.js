import React from 'react';
import Ux from "ux";
import {Button, Result} from 'antd';
import Op from './Op';

@Ux.zero(Ux.rxEtat(require("../Cab.json"))
    .cab("UI.Perm.Done")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const finished = Ux.fromHoc(this, "finished");
        /*
         * 处理 finished
         */
        const {data = {}} = this.props;
        const {extra = [], ...rest} = finished;
        // 必须 keep
        rest.title = Ux.formatExpr(rest.title, data, true);
        return (
            <Result {...rest} extra={extra.map(item => {
                const {text, onClick, ...rest} = item;
                let executor = Op.Perm.done[onClick];
                if (!executor) {
                    executor = (event) => {
                        Ux.prevent(event);
                        console.error("未绑定函数", onClick)
                    }
                } else {
                    executor = executor(this);
                }
                return (
                    <Button key={onClick} {...rest} onClick={executor}>
                        {text}
                    </Button>
                )
            })}/>
        )
    }
}

export default Component