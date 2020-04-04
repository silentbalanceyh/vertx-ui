import React from "react";
import Ex from "ex";
import {ExGraphicViewer} from "ei";

export default (reference) => {
    const {$data = {}} = reference.state;
    const inherit = Ex.yoAmbient(reference);
    const {$inited = {}} = reference.props;
    return (
        <ExGraphicViewer {...inherit} data={$data}
                         $current={$inited}
                         config={{
                             category: {
                                 source: "graphic.nodes",
                                 field: "categoryThird"
                             }
                         }}/>
    )
}