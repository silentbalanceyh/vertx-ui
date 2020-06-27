import React from 'react'
import Ux from "ux";
import Ex from 'ex';
import {ExTab} from 'ei';
import Op from './Op';
import './Cab.less';

@Ux.zero(Ux.rxEtat(require("./Cab.json"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.ylCard(this, () => {
            const tabs = Ux.fromHoc(this, "tabs");
            const render = Op.renderJsx();
            return (
                <ExTab {...Ex.yoAmbient(this)} config={tabs}>
                    {render.tabResource(this)}
                    {render.tabPermission()}
                </ExTab>
            )
        }, Ex.parserOfColor("PxAuthority-Resource").page({
            extra: Ux.aiLinkBack(this)
        }))
    }
}

export default Component