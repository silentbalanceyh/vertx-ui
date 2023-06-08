import Ux from "ux";
import React from "react";
import {G2Bar} from "ei";

export default {
    renderBar1: (reference) => {
        const {$submit = {}} = reference.state;
        const {config = {}, data = []} = $submit;
        // 最大值计算
        config.scale = {
            value: {
                max: Ux.g2ScaleMax(data)
            }
        };
        // 内容呈现
        config.interval = {
            label: {
                content: (item) => item.value,
            }
        }
        config.legend = false;
        return (<G2Bar id={"user-count1"}
                       config={config}
                       data={data}
                       style={{
                           height: 180,
                       }}/>)
    },
    renderBar2: (reference) => {
        const {$hand = {}} = reference.state;
        const {config = {}, data = []} = $hand;
        // 最大值计算
        config.scale = {
            value: {
                max: Ux.g2ScaleMax(data)
            }
        };
        // 内容呈现
        config.interval = {
            label: {
                content: (item) => item.value,
            }
        }
        config.legend = false;
        return (<G2Bar id={"user-hand1"}
                       config={config}
                       data={data}
                       style={{
                           height: 180,
                       }}/>)
    },
    renderBar3: (reference) => {
        const {$ciUse = {}} = reference.state;
        const {config = {}, data = []} = $ciUse;
        // 最大值计算
        config.scale = {
            value: {
                max: Ux.g2ScaleMax(data)
            }
        };
        // 内容呈现
        config.interval = {
            label: {
                content: (item) => item.value,
            }
        }
        config.legend = false;
        return (<G2Bar id={"user-count"}
                       config={config}
                       data={data}
                       style={{
                           height: 180,
                       }}/>)
    },
    renderBar4: (reference) => {
        const {$ciAss = {}} = reference.state;
        const {config = {}, data = []} = $ciAss;
        // 最大值计算
        config.scale = {
            value: {
                max: Ux.g2ScaleMax(data)
            }
        };
        // 内容呈现
        config.interval = {
            label: {
                content: (item) => item.value,
            }
        }
        config.legend = false;
        return (<G2Bar id={"user-hand"}
                       config={config}
                       data={data}
                       style={{
                           height: 180,
                       }}/>)
    }
}