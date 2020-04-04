import React from 'react';
import Op from './op';
import Ex from 'ex';
import Ux from "ux";
import './Cab.less';
import {GraphicEditor} from 'web';

import renderForm from './Web.Form';

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
            const {$event} = this.state;
            $event.onEvent(Op.event);
            return (
                <div className={"drawer-background"}>
                    <GraphicEditor {...$event.attributes()}/>
                    {renderForm(this, $event)}
                </div>
            );
        }, Ex.parserOfColor("ExGraphicSpider").component());
    }
}

export default Component;