import React from 'react';
import Ex from 'ex';
import Op from './Op';
import Ux from 'ux';
import {Table} from 'antd';
import './Cab.less';

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("ExHistory")
    .to()
)
class Component extends React.PureComponent {

    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$multi = false} = this.state;
            if ($multi) {
                return false;
            } else {
                const {$table = {}} = this.state;
                /*
                 * 默认不用 $loading
                 */
                const dataSource = Op.yoAdjust(this);
                return (
                    <Table {...$table} dataSource={dataSource}/>
                )
            }
        }, Ex.parserOfColor("ExHistory").component())
    }
}

export default Component;