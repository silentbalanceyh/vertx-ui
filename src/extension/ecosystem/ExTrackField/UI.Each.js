import React from 'react';
import Ux from "ux";
import Ex from 'ex';
import Op from './Op';
import {Table} from 'antd';
import './Cab.less';

const componentInit = (reference) => {
    const state = {};
    state.$ready = true;
    reference.setState(state);
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("ExTrackField")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$table = {}} = this.props;
            const {$loading = false} = this.state;
            const dataSource = Op.yoFieldAdjust(this);
            return (
                <Table {...$table} loading={$loading} dataSource={dataSource}/>
            );
        }, Ex.parserOfColor("ExTraceFieldHistory").component());
    }
}

export default Component