import __KT from './g6.__.fn.in.toolkit.common';
import __Zn from './zero.uca.dependency';

export class GStore {
    private readonly _stored: any = {};
    private readonly _ui: any = {};

    constructor(reference: any) {
        this._stored = __KT.inStore(reference);
        const {addon} = this._stored;
        if (addon) {
            const {window, stencil, toolbar} = addon;
            const ui: any = {};
            if (stencil) {
                ui.stencil = stencil;
            }
            if (toolbar) {
                ui.toolbar = toolbar;
            }
            if (window) {
                const normalized = {};
                Object.keys(window).forEach(winKey => {
                    // Window解析
                    normalized[winKey] = __Zn.configDialog(reference, window[winKey]);
                });
                ui.window = normalized;
            } else {
                ui.window = {};
            }
            this._ui = ui;
        }
    }

    // 读取图配置
    inGraph = () => this._stored.graph ? this._stored.graph : {};
    inRegistry = () => this._stored.registry ? this._stored.registry : [];
    inNode = () => this._stored.node ? this._stored.node : {};
    // 读取 AddOn 配置
    inStencil = () => this._ui.stencil ? this._ui.stencil : {};
    inToolbar = () => this._ui.toolbar ? this._ui.toolbar : {};
    inWindow = () => this._ui.window ? this._ui.window : {};
}