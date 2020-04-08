import {ItemState} from "../../common/constants";

export default {
    size: [80, 80],
    wrapperStyle: {
        /* 根据环境变量更改主题颜色 */
        fill: process.env.CSS_COLOR,
        radius: 8,
    },
    contentStyle: {
        fill: '#F5F5F5',
        radius: 6,
    },
    labelStyle: {
        fill: '#000000',
        textAlign: 'center',
        textBaseline: 'middle',
    },
    stateStyles: {
        [ItemState.Active]: {
            wrapperStyle: {},
            contentStyle: {},
            labelStyle: {},
        },
        [ItemState.Selected]: {
            wrapperStyle: {},
            contentStyle: {},
            labelStyle: {},
        },
    },
}//@-ts-ignore