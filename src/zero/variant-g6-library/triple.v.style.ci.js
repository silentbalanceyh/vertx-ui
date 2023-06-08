const CI_COLOR_MAIN = "#1A91FF";
export default {
    CI_COLOR_MAIN,
    CI_EDGE: {
        attrs: {
            line: {
                stroke: CI_COLOR_MAIN,
                strokeWidth: 1,
                targetMarker: {
                    name: 'classic',
                    size: 8,
                    offset: -3
                },
            }
        }
    },
    CI_PORT: {
        circle: {
            r: 4,
            magnet: true,
            stroke: CI_COLOR_MAIN,
            strokeWidth: 1,
            fill: '#fff',
            style: {
                visibility: 'hidden',
            },
        },
    },
    CI_ARROW_SOURCE: {
        tagName: 'circle',
        attrs: {
            r: 4,
            fill: 'white',
            stroke: CI_COLOR_MAIN,
            strokeWidth: 1
        },
    },
    CI_ARROW_TARGET: {
        attrs: {
            d: 'M -8 -6 6 0 -8 6 Z',
            fill: CI_COLOR_MAIN,
            strokeWidth: 0
        },
    },
    CI_BUTTON_NODE: {
        x: 0,
        y: 0,
        offset: {
            x: 4, y: 4
        }
    },
    CI_BUTTON_EDGE: {
        distance: -40,
        offset: 30
    }
}