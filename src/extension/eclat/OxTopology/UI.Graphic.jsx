import React from 'react';
import Ex from "ex";
import {ExGraphicViewer} from "ei";

class Component extends React.PureComponent {

    render() {
        const {$data = {}, tpl} = this.props;
        const inherit = Ex.yoAmbient(this);
        const {$inited = {}} = this.props;
        return tpl ? (
            <ExGraphicViewer {...inherit} data={$data}
                             $current={$inited}
                             config={{
                                 category: {
                                     source: "graphic.nodes",
                                     field: "categoryThird"
                                 }
                             }}/>
        ) : false
    }
}

export default Component;