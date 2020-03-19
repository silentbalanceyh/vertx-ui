import React from 'react';
import Yo from './yo';
import {EditorNexus} from 'web';
import Ux from "ux";
import './element';
import './Cab.less';

class Component extends React.PureComponent {

    render() {
        const items = Yo.yoItems(this);
        const graphConfig = Yo.yoGraphic(this);
        Ux.dgDebug({items, graphConfig}, "关系定义图配置");
        return (
            <div className={"ex-drawer-bg"}>
                <EditorNexus items={items} config={{
                    maxHeight: Ux.toHeight(136)
                }} graphConfig={graphConfig}/>
            </div>
        );
    }
}

export default Component;