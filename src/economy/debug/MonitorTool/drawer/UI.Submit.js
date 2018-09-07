import React from 'react'
import {_zero} from "../../../_internal";
import {DataLabor} from 'entity';
import Ux from 'ux';
import {Table} from "antd";
import EmptyContent from "../UI.Empty";

@_zero({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Pure",
    state: {},
    connect: {
        s2p: state => DataLabor.createOut(state)
            .rework({
                "debug.active": ["major"]
            })
            .rinit(["major"])
            .to(),
    }
})
class Component extends React.PureComponent {
    componentDidMount() {
        const {$major} = this.props;
        if ($major.is()) {
            const config = Ux.D.datumTree($major.to());
            Ux.G.drawTree("g6Major", config);
        }
        const table = Ux.fromHoc(this, "table");
        this.setState({table});
    }

    render() {
        const {$major} = this.props;
        if ($major.is()) {
            const {table = {}} = this.state;
            const data = Ux.D.datumPure($major.to());
            if (table.columns) {
                Ux.D.renderColumn(table.columns);
            }
            return (
                <div>
                    <div id={"g6Major"}/>
                    <Table {...table} dataSource={data}/>
                </div>
            )
        } else {
            return (<EmptyContent/>)
        }
    }
}

export default Component