import React from 'react';
import Ux from 'ux';
import Ex from "ex";
import Op from './Op';
import {Fn} from "app";
import {Empty} from 'antd';
import './Cab.less';
import Img from './image/empty.png';

import UIGraph from './UI.Graph';

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        const {rxExtra} = this.props;
        return Ex.yoRender(this, () => Fn.jsxCard(this,
            () => {
                const {$inited} = this.props;
                const desc = Ux.fromHoc(this, "info");
                /*
                 * 高度计算
                 */
                let $height = 400;
                if (Ux.isArray($inited)) {
                    const children = $inited.flatMap(item => item.children).flatMap(item => item.children);
                    if (8 < children.length) {
                        $height = children.length * 50;
                    }
                }
                return $inited ? (
                    <div className={"ops-graph-container"} style={{
                        height: Ux.toHeight(260)
                    }}>
                        {$inited.map(tree => (<UIGraph key={tree.id} data={tree} $height={$height}/>))}
                    </div>
                ) : (
                    <Empty className={"ops-graph-empty"}
                           image={Img}
                           description={
                               <span>
                                   {desc.tips}
                                   <a href={""}>
                                       {desc.link}
                                   </a>
                               </span>
                           }/>
                );
            },
            () => Fn.jsxCardExtra(this, rxExtra)
        ), Ex.parserOfColor("OpsGraphModel").define())
    }
}

export default Component