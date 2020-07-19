export default {
    /*
     * 关于 plugin 的说明
     * 1）tooltip：启用 <Tooltip/> 的外围功能
     * 2）confirm：点击按钮会有 弹出框提示 Modal.confirm
     * 3）「中间行为」window：直接使用弹出框 Modal，打开一个窗口
     * 4）「中间行为」popover：直接使用 <Popover/>，打开一个浮游面板
     * 5）「中间行为」drawer：直接使用 <Drawer/>，打开一个抽屉
     * 6）「中间行为」connect：直接调 Ux.connectId 连接点击
     * 7）submit：是否启用防重复提交
     */
    "op.open.filter": {
        icon: 'delete',
        type: 'default',
        key: 'opFilter',
        plugin: {
            tooltip: true,
            confirm: "confirm.clean.filter"
        }
    },
    "op.extra.column": {
        icon: 'caret-down',
        type: 'primary',
        key: 'opColumn',
        plugin: {
            tooltip: true,
            popover: 'window.extra.column',     // Popover 专用
            componentType: 'ExEditorColumn',        // 组件类型
            component: 'extra.column'
        }
    },
    'op.extra.export': {
        icon: 'export',
        key: 'opExport',
        plugin: {
            tooltip: true,
            window: 'window.extra.export',      // Window专用
            componentType: 'ExEditorExport',
            component: 'extra.export'
        }
    }
};