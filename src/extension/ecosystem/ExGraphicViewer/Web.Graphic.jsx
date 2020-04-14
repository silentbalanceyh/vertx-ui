import Ex from "ex";
import {GraphicViewer} from 'web';
import React from 'react';
import './Cab.less';
import Op from './op';

export default (reference, data = {}) => {
    const {$event = {}} = reference.state;
    const inherit = Ex.yoAmbient(reference);
    $event.onEvent(Op.event);
    return (
        <div className={"drawer-background"}>
            <GraphicViewer {...inherit} data={data} {...$event.attributes()}/>
        </div>
    );
}