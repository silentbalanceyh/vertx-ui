import React from 'react'
import Ux from "ux";
import Ex from 'ex';
import {ExTab} from 'ei';
import Op from './op/Op';


import UIResource from './UI.Resource';
import UIPermission from './UI.Permission';
import UIReady from './UI.Free';
// UNLOCK for component
const renderJsx = () => ({
    tabResource: (reference) => {
        const {$tree = [], $treeData = []} = reference.state;
        return <UIResource {...Ex.yoAmbient(reference)}
                           $treeData={$treeData}
                           $tree={$tree}/>
    },
    tabPermission: (reference) => {
        const {$treeData = []} = reference.state;
        return <UIPermission {...Ex.yoAmbient(reference)}
                             $category={$treeData}/>
    },
    tabFree: (reference) => (<UIReady {...Ex.yoAmbient(reference)}/>)
})

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
            const render = renderJsx();
            return (
                <ExTab {...Ex.yoAmbient(this)} config={tabs}>
                    {render.tabResource(this)}
                    {render.tabPermission(this)}
                    {render.tabFree(this)}
                </ExTab>
            )
        }, Ex.parserOfColor("PxAuthority-Resource").page({
            extra: Ux.aiLinkBack(this)
        }))
    }
}

export default Component