import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import Op from './Op';
import {Table} from 'antd';
import './Cab.less';

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("ExHistory")
    .state({
        $row: {}
    })
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$data = [], $table = {}} = this.state;
            return (
                <Table {...$table} dataSource={$data}/>
            );
        }, Ex.parserOfColor("OxHistory").component())
    }
}

export default Component;