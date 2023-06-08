import React from 'react';
import {TxOpen, TxPage} from "ei";
import Ex from 'ex';

class Component extends React.PureComponent {
    render() {
        const inherit = Ex.yoAmbient(this);
        inherit.$showTask = true;       // 显示任务名称
        return (
            <TxPage {...inherit}>
                <TxOpen/>
            </TxPage>
        )
    }
}

export default Component