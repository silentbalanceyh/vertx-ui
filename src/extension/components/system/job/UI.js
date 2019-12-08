import React from 'react'
import Ux from 'ux';
import Ex from 'ex';
import {Table, Tabs} from 'antd';
import {LoadingAlert} from 'web';
import Op from './Op';
import Form from './UI.Form';
import Event from './event';
import renderExtra from './Web.Extra';

const renderChild = (reference, item, $inited = {}) => {
    if ("tabTask" === item.key) {
        const {
            $table = {}, $data = [], $loading = false
        } = reference.state;
        const alert = Ux.fromHoc(reference, "alert");
        return (
            <div>
                <LoadingAlert $alert={alert} $type={"success"}/>
                <Table {...$table} dataSource={$data} loading={$loading}/>
            </div>
        )
    } else {
        const inherit = Ex.yoAmbient(reference);
        inherit.$inited = $inited;
        inherit.doSubmitting = Ex.rxSubmitting(reference);
        inherit.rxClose = Event.rxTabClose(reference, item);
        return (
            <Form {...inherit}/>
        )
    }
};

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {

    componentDidMount() {
        Op.yiPage(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yuPage(this);
    }

    componentWillUnmount() {
        Op.yoPage(this);
    }

    render() {
        return Ex.ylCard(this, () => {
            const {$tabs = {}, $inited = {}} = this.state;
            /*
             * 列表
             */
            const {items = [], ...tabsAttrs} = $tabs;
            return (
                <Tabs {...tabsAttrs}
                      tabBarExtraContent={renderExtra(this)}>
                    {items.map(item => (
                        <Tabs.TabPane {...item}>
                            {renderChild(this, item, $inited)}
                        </Tabs.TabPane>
                    ))}
                </Tabs>
            )
        }, Ex.parserOfColor("PxJob").page());
    }
}

export default Component