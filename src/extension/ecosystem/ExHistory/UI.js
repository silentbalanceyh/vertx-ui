import React from 'react';
import Ex from 'ex';
import Op from './Op';
import Ux from 'ux';
import U from 'underscore';
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
                const {$loading = false, data = {}} = this.props;
                const changes = U.isArray(data.items) ? data.items : [];
                /*
                 * 默认不用 $loading
                 */
                return (
                    <Table {...$table} dataSource={changes}
                           $loading={$loading}/>
                )
            }
        }, Ex.parserOfColor("ExHistory").component())
    }
}

export default Component;