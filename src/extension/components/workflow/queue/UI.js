import React from 'react';
import Ex from "ex";
import {TxPage, TxQRun} from "ei";

class Component extends React.PureComponent {
    render() {
        const inherit = Ex.yoAmbient(this);
        return (
            <TxPage {...inherit}>
                <TxQRun/>
            </TxPage>
        )
    }
}

export default Component