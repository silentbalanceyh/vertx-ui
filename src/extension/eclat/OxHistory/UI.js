import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import Op from './Op';
import './Cab.less';
import Rdr from './Web';

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
            return Ux.callTab(this, {
                // 按时间
                tabTime: Rdr.pageTime(this),
                // 按字段
                tabField: Rdr.pageField(this)
            })
        }, Ex.parserOfColor("OxHistory").component())
    }
}

export default Component;