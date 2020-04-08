import React from 'react';
import Ux from 'ux';
import Ex from "ex";
import Op from './op';
import './Cab.less';
import {GraphicEditor} from "web";
import renderForm from "../ExGraphicSpider/Web.Form";

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("ExGraphicPlotter")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Ux.g6PageInit(this, Op.onInit)
    }

    render() {
        return Ex.yoRender(this, () => {
            /*
                 * 构造图形相关事件对象
                 */
            const {$event} = this.state;
            $event.onEvent(Op.event);
            return (
                <div className={"drawer-background"}>
                    <GraphicEditor {...$event.attributes()}/>
                    {renderForm(this, $event)}
                </div>
            );
        }, Ex.parserOfColor("ExGraphicPlotter").component())
    }
}

export default Component;