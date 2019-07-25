export default {
    "op.open.add": {
        icon: 'plus',
        type: 'primary',
        key: 'opAdd'
    },
    "op.open.filter": {
        icon: 'remove',
        type: 'default',
        key: 'opFilter',
        config: {
            tooltip: true,
        }
    },
    "op.batch.edit": {
        icon: 'edit',
        type: 'default',
        key: 'opBatchEdit',
        config: {
            window: 'window.batch.edit',    // Window专用
            component: 'ExBatchEditor',     // 组件类型
            componentKey: `batch.editor`,   // 配置专用Key
        }
    },
    "op.batch.delete": {
        icon: 'remove',
        type: 'default',
        key: 'opBatchDelete',
        config: {
            confirm: 'confirm.batch.delete',    // 配置confirm
        }
    },
    "op.extra.column": {
        icon: 'caret-down',
        type: 'primary',
        key: 'opColumn',
        config: {
            popover: 'window.extra.column',     // Popover 专用
            component: 'ExColumnEditor',        // 组件类型
            componentKey: 'extra.column'
        }
    },
    'op.extra.export': {
        icon: 'export',
        key: 'opExport',
        config: {
            window: 'window.extra.export',      // Window专用
            component: 'ExExportEditor',
            componentKey: 'extra.export'
        }
    },
    'op.extra.import': {
        icon: 'import',
        key: 'opImport',
        config: {
            window: 'window.extra.import',      // Window专用
            component: 'ExImportEditor',
            componentKey: 'extra.import'
        }
    },
    'op.submit.add': {
        icon: 'plus',
        key: 'opFormAdd',
        type: 'primary',
        config: {
            connect: 'id.submit.add'
        }
    },
    'op.submit.save': {
        icon: 'save',
        key: 'opFormSave',
        type: 'primary',
        config: {
            connect: 'id.submit.save'
        }
    },
    'op.submit.delete': {
        icon: 'remove',
        key: 'opFormDelete',
        type: 'danger',
        config: {
            tooltip: true,
            connect: 'id.submit.delete'
        }
    },
    'op.submit.reset': {
        icon: 'redo',
        key: 'opFormReset',
        type: 'default',
        config: {
            tooltip: true,
            connect: 'id.submit.reset'
        }
    }
};