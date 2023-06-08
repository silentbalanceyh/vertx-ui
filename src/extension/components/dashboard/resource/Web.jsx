import React from "react";
import {G2Pie} from "ei";

export default {
    renderBar: (reference) => {
        const {config = {}, pie = []} = reference.state;
        config.scale = 0
        config.interaction = "element-active"
        // 内容呈现
        config.interval = {
            label: {
                content: (obj) => {
                    return obj.name + "(" + (obj.ratio * 100).toFixed(2) + '%)';
                },
                // offset:-30
            },
            adjust: 'stack',
            position: 'value',
            color: ['#FF6347', '#EEC900', '#1E90FF']
        }
        config.legend = false;
        // Ux.g2Chart("id",config)

        return (<G2Pie id={"x-log"}
                       config={config}
                       data={pie}
                       style={{
                           height: 380,
                       }}/>)
    }
}