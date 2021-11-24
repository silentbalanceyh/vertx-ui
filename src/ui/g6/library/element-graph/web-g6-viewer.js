import addOn from "../element-addon-plugin";

export default {
    // 基本配置（无函数干扰）
    highlighting: {
        magnetAvailable: {
            name: 'stroke',
            args: {
                padding: 2,
                attrs: {
                    strokeWidth: 3,
                    stroke: 'rgba(223,234,255)',
                },
            },
        }
    },
    snapline: true,
    history: true,
    clipboard: {
        enabled: true,
    },
    keyboard: {
        enabled: true,
    },
    // 非基本配置
    grid: addOn.GridDefault,

    connecting: addOn.ConnectingDefault,

    scroller: {
        enabled: true,
        pannable: true,
    },
    mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
        minScale: 0.5,
        maxScale: 2,
    }
}