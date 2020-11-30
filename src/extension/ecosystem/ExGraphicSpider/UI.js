import React from 'react';
import Op from './op';
import Ex from 'ex';
import Ux from "ux";
import './Cab.less';
import {G6Editor} from 'web';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("ExGraphicSpider")
    .to()
)
class Component extends React.PureComponent {

    componentDidMount() {
        Ux.g6PageInit(this, Op.onInit);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Ux.g6PageUp(this,
            {props: prevProps, state: prevState}, Op.onInit);
    }

    render() {
        return Ex.yoRender(this, () => {
            /*
             * 构造图形相关事件对象
             */
            const {$gEvent, $data = {}} = this.state;
            /*
             * 构造分组信息
             */
            const inherit = Ex.yoAmbient(this);
            inherit.$gEvent = $gEvent;
            inherit.data = $data;
            return (
                <div className={"drawer-background"}>
                    <G6Editor {...inherit}/>
                </div>
            );
        }, Ex.parserOfColor("ExGraphicSpider").component());
    }
}

export default Component;