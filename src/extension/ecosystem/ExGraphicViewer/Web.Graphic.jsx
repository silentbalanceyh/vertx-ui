import Ex from "ex";
import {G6Viewer} from 'web';
import React from 'react';
import './Cab.less';
import Op from './op';

export default (reference, data = {}) => {
    const {$event = {}} = reference.state;
    const inherit = Ex.yoAmbient(reference);
    $event.onEvent(Op.event);
    return (
        <div className={"drawer-background"}>
            <G6Viewer {...inherit} data={data} {...$event.attributes()}/>
        </div>
    );
}