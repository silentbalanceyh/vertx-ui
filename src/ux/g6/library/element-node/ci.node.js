import {Graph} from "@antv/x6";

const colorMain = "#1A91FF";
export default (name) => Graph.registerNode(name, {
    inherit: 'image',
    width: 74,
    height: 72,
    attrs: {
        body: {
            stroke: colorMain,
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
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: colorMain,
                        strokeWidth: 1,
                        fill: '#fff',
                        style: {
                            visibility: 'hidden',
                        },
                    },
                },
            },
            right: {
                position: 'right',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: colorMain,
                        strokeWidth: 1,
                        fill: '#fff',
                        style: {
                            visibility: 'hidden',
                        },
                    },
                },
            },
            bottom: {
                position: 'bottom',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: colorMain,
                        strokeWidth: 1,
                        fill: '#fff',
                        style: {
                            visibility: 'hidden',
                        },
                    },
                },
            },
            left: {
                position: 'left',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: colorMain,
                        strokeWidth: 1,
                        fill: '#fff',
                        style: {
                            visibility: 'hidden',
                        },
                    },
                },
            },
        },
        items: [
            {
                group: 'top',
            },
            {
                group: 'right',
            },
            {
                group: 'bottom',
            },
            {
                group: 'left',
            },
        ],
    },
})