import React from 'react';
import Yo from './yi';
import Ex from 'ex';
import {EditorNexus} from 'web';
import Ux from "ux";
import './Cab.less';
import Ev from './event';

import renderJsx from './Web.Form';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {

    componentDidMount() {
        Yo.yiPage(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Yo.yuPage(this, {props: prevProps, state: prevState});
    }

    render() {
        return Ex.yoRender(this, () => {
            const items = Yo.yoItems(this);
            const {$graphic = {}} = this.state;
            const {$current = {}} = this.props;

            Ux.dgDebug({items, $graphic, $current}, "关系定义图配置");
            const {$data = {}} = this.state;
            const config = Yo.yoDesigner(this);
            /* 处于提交状态 */
            const {$submitting = false} = this.state;
            return (
                <div className={"ex-drawer-bg"}>
                    <EditorNexus items={items} data={$data}
                                 current={$current}
                                 config={config}
                                 submitting={$submitting}
                                 graphConfig={$graphic}
                                 executor={Yo.yoExecutor(this)}
                                 context={Ev.onContext(this)}/>
                    {renderJsx(this)}
                </div>
            )
        }, Ex.parserOfColor("ExDrawerRelation").component());
    }
}

export default Component;