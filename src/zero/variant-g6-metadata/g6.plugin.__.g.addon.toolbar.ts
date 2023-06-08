import {GLife, GView} from "./g6.__.c.interface.contract";
import {GStore} from "./g6.__.c.pojo.g.store";
import {GCommand} from "./g6.__.c.event.g.command";
import __Zn from './zero.uca.dependency';
import __KPT from './g6.__.fn.pos.locate.element';

const Ld = __Zn.G6_LIBRARY;

export class GToolbar implements GLife, GView {

    private readonly _gGraph: any = null;

    private _id: string = null;
    private _css: any = {};
    private _config: any = {};
    private _toolbar: any = null;

    private _commands: any = {};
    private _commandKo: Set<any> = new Set();

    constructor(gGraph: any) {
        this._gGraph = gGraph;
    }

    configure(store: GStore): GToolbar {
        // 读取配置信息
        const config = store.inToolbar();
        const {container, css, commands, ...toolbarConfig} = config;
        // CSS计算
        if (css) Object.assign(this._css, css);

        // Command 绑定
        if (commands) {
            const {view = [], disabled = []} = commands;
            this._commands = view;
            this._commandKo = new Set(disabled);
        } else {
            this._commands = [];    // 防止 this._commands.forEach is not a function
        }

        // ID计算
        this._id = container ? container : null;
        this._config = Ld.g6DefaultAddOn(this._id, toolbarConfig);

        return this;
    }

    initialize(gCommand: GCommand): GToolbar {
        // 更新 GPos
        {
            const posRef = this._gGraph.pos();
            const config: any = {};
            config.css = this._css;
            __KPT.posCompressH(posRef, config);
        }
        {
            const graph = this._gGraph.graph();
            // UI 组件处理
            const matrix: any = [];
            const DEFAULT_TOOL = Ld.C[this._id] ? Ld.C[this._id] : [];
            this._commands.forEach((grouped, rIndex) => {
                const matrixG: any = [];
                grouped.forEach((item, cIndex) => {
                    let original: any = {};
                    if ("string" === typeof item) {
                        original = DEFAULT_TOOL[rIndex][cIndex];        // 默认命令工具
                        if (!original) original = {};
                        original = __Zn.clone(original);
                        original.tooltip = item;
                        // 是否禁用处理
                        original.disabled = this._commandKo.has(original.name);
                    } else {
                        Object.assign(original, item);
                    }
                    // 构造工具行
                    const command: any = {};
                    Object.assign(command, original);
                    if (command.bindKey) {
                        /**
                         * 如果存在快捷键，则绑定快捷键
                         */
                        graph.bindKey(command.bindKey, () => gCommand.run(command.name))
                    }
                    matrixG.push(command);
                })
                matrix.push(matrixG);
            });
            this._toolbar = matrix;
            /*
             * 这里要防止 this 指向发生变化，所以使用调用的模式更靠谱
             * 二阶函数模式，则可直接使用闭包来实现，而 GCommand 是独立的
             * 所以这里会调用 GCommand 中的 run 方法执行命令，而命令本身
             * 会穿透到顶层的 `on` 系列函数中。
             */
            this._config.onClick = (name) => gCommand.run(name);
        }
        return this;
    }

    id = (): string => this._id;
    css = (): any => this._css;

    ui = () => {
        const ui: any = {};
        if (__Zn.isNotEmpty(this._config)) {
            Object.assign(ui, this._config);
        }
        ui.items = this._toolbar;
        return ui;
    }
}