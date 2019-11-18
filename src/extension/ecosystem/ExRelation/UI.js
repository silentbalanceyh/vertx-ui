import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import Op from './Op';
import renderHeader from './Web.Header';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("ExRelation")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$config = {}} = this.state;
            const {header = {}} = $config;
            /*
             * 头部数据基础
             */
            const {current = {}} = this.props;
            const tabs = Op.yoTabs(this);
            return (
                <div>
                    {renderHeader(current, header)}
                </div>
            )
        }, Ex.parserOfColor("ExRelation").component())
    }
}

export default Component;