import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import Jsx from './Web';

import Op from './Op';

import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "ExAuthority";
const componentInit = (reference) => {
    const {$inited = {}} = reference.props;
    // GET /api/authority/region/:type
    const {type} = $inited;
    const state = {};
    Ux.ajaxGet("/api/authority/region/:type", {type})
        .then(regions => {
            regions.forEach(region => {
                region.label = region.name;
                const {uiSurface = {}} = region;
                region.ui = uiSurface['webComponent'];
            })
            return Ux.promise(regions.filter(region => !!region.ui));
        })
        .then(regions => Ux.promise(state, "$regions", regions))
        .then(state => {
            // $activeKey captured by the initialized array ( regions )
            const {$regions = []} = state;
            if (0 < $regions.length) {
                // #AUTH：权限管理
                const $activeKey = $regions[0].key;
                return Op.rxActive(state, $activeKey);
            } else {
                console.error("系统未读取到 $regions.");
                return Ux.promise(state)
            }
        })
        .then(Ux.ready).then(Ux.pipe(reference))
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
            const attrPage = Sk.mixEx(UCA_NAME);
            return (
                <div {...attrPage}>
                    {Jsx.renderHeader(this)}
                    {/** Dynamic Regions: $regions **/}
                    {Jsx.renderPage(this)}
                </div>
            )
        }, Ex.parserOfColor(UCA_NAME).component());
    }
}

export default Component