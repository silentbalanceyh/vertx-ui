import {Graph} from "@antv/x6";
import V from '../element-style';

export default (name) => Graph.registerNode(name, {
    inherit: 'rect',
    width: 74,
    height: 72,
    attrs: {
        body: {
            stroke: V.CI_COLOR_MAIN,
            strokeWidth: 1,
            fill: 'rgba(255,255,255,0.7)'
        },
        image: {
            height: 48,
            width: 48,
            x: 13,
            y: 3,
            zIndex: 1000
        },
        text: {
            fontSize: 13,
            fill: 'rgba(0,0,0,0.85)',
            y: 25,                       // 保证字体偏下
        }
    },
    markup: [
        {
            tagName: 'rect',
            selector: 'body',
        },
        {
            tagName: 'image',
            selector: 'image',
        },
        {
            tagName: 'text',
            selector: 'text',
        },
    ],
    ports: {
        groups: {
            top: {
                position: 'top',
                attrs: V.CI_PORT,
            },
            right: {
                position: 'right',
                attrs: V.CI_PORT,
            },
            bottom: {
                position: 'bottom',
                attrs: V.CI_PORT,
            },
            left: {
                position: 'left',
                attrs: V.CI_PORT,
            },
        },
        items: [
            {
                group: 'top',
            },
            {
                group: 'top',
            },
            {
                group: 'top',
            },
            {
                group: 'right',
            },
            {
                group: 'right',
            },
            {
                group: 'right',
            },
            {
                group: 'bottom',
            },
            {
                group: 'bottom',
            },
            {
                group: 'bottom',
            },
            {
                group: 'left',
            },
            {
                group: 'left',
            },
            {
                group: 'left',
            },
        ],
    }
}, true)