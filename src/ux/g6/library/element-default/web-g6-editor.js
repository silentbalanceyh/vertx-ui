import addOn from "../plugin-addon";

export default {
    // 基本配置（无函数干扰）
    highlighting: {
        magnetAvailable: {
            name: 'stroke',
            args: {
                padding: 4,
                attrs: {
                    strokeWidth: 4,
                    stroke: 'rgba(223,234,255)',
                },
            },
        },
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

    selecting: addOn.SelectingDefault,

    connecting: addOn.ConnectingDefault,
}