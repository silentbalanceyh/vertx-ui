import React from 'react';
import Ux from "ux";
import Ex from 'ex';
import Op from './Op';
import {Table} from 'antd';

const UCA_NAME = "ExTrackField";
const componentInit = (reference) => {
    const state = {};
    Ux.of(reference).in(state).ready().done();
    // reference.?etState(state);
    // state.$ready = true;
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
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
        }, Ex.parserOfColor(UCA_NAME).component());
    }
}

export default Component