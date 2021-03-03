import React from 'react';
import Ux from "ux";
import {Button} from 'antd';
import "./Cab.less";
import Op from './Op';

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {

    render() {
        const ops = Ux.fromHoc(this, "op");
        const {reference, $submitting = false} = this.props;
        return (
            <div className={"ops-source-op"}>
                {ops.map(item => {
                    const {text, ...rest} = item;
                    return (
                        <Button {...rest} type={"primary"}
                                loading={$submitting}
                                onClick={Op[item.key](reference)}>
                            {text}
                        </Button>
                    )
                })}
            </div>
        );
    }
}

export default Component