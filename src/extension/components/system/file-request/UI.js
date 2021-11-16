import React from 'react'
import Ux from "ux";
import Ex from "ex";
import {ExTab, TxQueue} from "ei";

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .ready(true)
    .to()
)
class Component extends React.PureComponent {
    render() {
        const tabs = Ux.fromHoc(this, "tabs");
        const workflow = Ux.fromHoc(this, "workflow");
        /*
         * Ex部分的状态处理
         */
        const inherit = Ex.yoAmbient(this);
        return Ex.ylCard(this, () => (
            <ExTab {...inherit} config={tabs}>
                <TxQueue {...inherit} config={workflow} rxAttachment={record => {
                    if (record.size) {
                        record.sizeUi = Ux.toFileSize(record.size)
                    }
                    record.file = [];
                    record.file.push({
                        key: record.key,
                        uid: record.key,
                        name: record.name,
                        status: "done"
                    });
                    return record;
                }}/>
                <span>2</span>
            </ExTab>
        ), Ex.parserOfColor("PxFileRequest").page())
    }
}

export default Component