import {ItemState} from "../../common/constants";

export default {
    style: {
        stroke: '#ccc1d8',
        lineWidth: 2,
        shadowColor: null,
        shadowBlur: 0,
        radius: 8,
        offset: 24,
        startArrow: {
            path: [['M', 3, 0], ['A', 3, 3, 0, 1, 1, -3, 0], ['A', 3, 3, 0, 1, 1, 3, 0], ['Z']],
            d: 7,
        },
        endArrow: {
            path: [['M', 3, 0], ['L', -3, -3], ['L', -3, 3], ['Z']],
            d: 5,
        },
    },
    labelCfg: {
        style: {
            fill: '#000000',
            fontSize: 13,
            padding: 3,
        },
    },
    stateStyles: {
        [ItemState.Selected]: {
            stroke: '#5aaaff',
            shadowColor: '#5aaaff',
            shadowBlur: 24,
        },
        [ItemState.HighLight]: {
            stroke: '#5aaaff',
            shadowColor: '#5aaaff',
            shadowBlur: 24,
        },
    },
}