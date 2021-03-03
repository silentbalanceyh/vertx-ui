import React from 'react';
import Ux from 'ux';
import UITenant from './UI.Tenant';
import Ex from 'ex';
import Op from './Op';

@Ux.zero(Ux.rxEtat(require('../Cab.json'))
    .cab("UI.Nav")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const {data = {}, $router} = this.props;
        const $navs = [];
        const {top, left} = data;
        if (top) {
            top.__uri = (event) => {
                Ux.prevent(event);
                const ref = Ux.onReference(this, 1);
                ref.setState({$navLeft: undefined});
                Ux.toRoute(this, top.uri, {pid: null});
            }
            $navs.push(top);

        }
        if (left) {
            const {$source = []} = this.props;
            const parent = Ux.elementUnique($source, "key", left.parentId);
            if (parent) {
                $navs.push(parent);
            }
            $navs.push(left);
        }
        const $navigation = Op.yoNavs(this, $navs);
        $navigation.forEach(item => {
            item.className = "ops-invert";
            const {$router} = this.props;
            const current = $router.path();
            if (current.endsWith(item.uri)) {
                item.className = `${item.className} ops-invert-active`
            }
        })
        return (
            <div className={"ux-navigation"}>
                {Ux.aiGridLR(this,
                    () => Ux.aiBreadcrumb($navigation, {
                        className: "breadcrumb"
                    }, {$router}),
                    () => (<UITenant {...Ex.yoAmbient(this)}
                                     rxTenant={Op.rxTenant(this)}/>), {
                        left: 20,
                        right: 4,
                        leftCls: "nav-left-row",
                        rightCls: "nav-right-row"
                    })}
            </div>
        )
    }
}

export default Component