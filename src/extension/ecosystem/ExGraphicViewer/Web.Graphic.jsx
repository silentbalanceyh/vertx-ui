import Ex from "ex";
import {GraphicViewer} from 'web';
import React from 'react';
import './Cab.less';

export default (reference, data = {}) => {
    const {$event = {}} = reference.state;
    const inherit = Ex.yoAmbient(reference);
    return (
        <div className={"drawer-background"}>
            <GraphicViewer {...inherit} data={data} {...$event.attributes()}/>
        </div>
    );
}