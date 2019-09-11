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
    "op.open.add": {
        icon: 'plus',
        type: 'primary',
        key: 'opAdd'
    },
    "op.open.filter": {
        icon: 'delete',
        type: 'default',
        key: 'opFilter',
        plugin: {
            tooltip: true,
            confirm: "confirm.clean.filter"
        }
    },
    "op.batch.edit": {
        icon: 'edit',
        type: 'default',
        key: 'opBatchEdit',
        plugin: {
            window: 'window.batch.edit',    // Window专用
            componentType: 'ExEditorBatch',     // 组件类型
            component: `batch.editor`,   // 配置专用Key
        }
    },
    "op.batch.delete": {
        icon: 'remove',
        type: 'default',
        key: 'opBatchDelete',
        plugin: {
            prompt: 'confirm.batch.delete',    // 配置confirm
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
    },
    'op.extra.import': {
        icon: 'import',
        key: 'opImport',
        plugin: {
            tooltip: true,
            window: 'window.extra.import',      // Window专用
            componentType: 'ExEditorImport',
            component: 'extra.import'
        }
    },
    'op.submit.add': {
        icon: 'plus',
        key: 'opFormAdd',
        type: 'primary',
        plugin: {
            submit: true,
            connect: 'id.submit.add'
        }
    },
    'op.submit.save': {
        icon: 'save',
        key: 'opFormSave',
        type: 'primary',
        plugin: {
            submit: true,
            connect: 'id.submit.save'
        }
    },
    'op.submit.delete': {
        icon: 'delete',
        key: 'opFormDelete',
        type: 'danger',
        plugin: {
            submit: true,
            tooltip: true,
            prompt: 'confirm.delete',
            connect: 'id.submit.delete'
        }
    },
    'op.submit.reset': {
        icon: 'redo',
        key: 'opFormReset',
        type: 'default',
        plugin: {
            tooltip: true,
            connect: 'id.submit.reset'
        }
    }
};