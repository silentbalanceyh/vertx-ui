import React from 'react'
import {_zero} from "../../../_internal";
import {DataLabor} from 'entity';
import EmptyContent from "../UI.Empty";
import Ux from "ux";
import {Table} from 'antd';

@_zero({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Pure",
    state: {},
    connect: {
        s2p: state => DataLabor.createOut(state)
            .rework({
                "list": ["items"],
                "debug.active": ["form"]
            })
            .rinit(["form", "items"])
            .to(),
    }
})
class Component extends React.PureComponent {
    componentDidMount() {
        const {$form} = this.props;
        if ($form.is()) {
            const record = Ux.clone($form.to());
            if (record.hasOwnProperty("record")) {
                // 不绘制主记录信息
                delete record.record;
            }
            const config = Ux.D.datumTree(record);
            Ux.G.drawTree("g6Item", config);
        }
    }

    render() {
        const {$form, $items} = this.props;
        if ($form.is() && $items.is()) {
            const selected = $items.$($form._("key"));
            const {data = [], table = {}} = Ux.D.datumMatrix(selected.to());
            return (
                <div>
                    <div id={"g6Item"}/>
                    <Table {...table} dataSource={data}/>
                </div>
            )
        } else {
            return (<EmptyContent/>)
        }
    }
}

export default Component