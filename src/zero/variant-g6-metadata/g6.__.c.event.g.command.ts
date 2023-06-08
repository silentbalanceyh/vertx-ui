import {DI_ACTION, DI_NAME, DiMap} from "./g6.di.__.v.entry.point";
import __BND from './g6.__.fn.bind.event.command';
import __Zn from './zero.uca.dependency';
/*
 * 构造魔幻调用，vertx-ui 使用的是 rx 前缀
 * 这里的函数直接使用 gx 前缀
 *
 * 关于函数命名：
 * 1. 名动词结构
 * 名词 + 动词 + 标记位
 * 名词：
 * -- Node：节点
 * -- Edge：边
 * -- Canvas：画布
 * -- Group：组
 * 2. 标记位包括
 * --
 *
 */
const generateFn = (gEvent, name) => {
    return (item) => {
        // executor 提取
        let executor;
        const reference = gEvent.reference();
        if (reference) {
            // 注入 default 函数
            let params: any = {};
            const executorDefault = DI_ACTION[name];
            if (__Zn.isFunction(executorDefault)) {
                params = executorDefault(item, gEvent);
            } else {
                // 此处不拷贝，直接拿引用
                params = item;
            }
            // 外置函数
            if (reference.state) {
                executor = reference.state[name];
            }
            if (!__Zn.isFunction(executor)) {
                executor = reference.props[name];
            }
            if (__Zn.isFunction(executor)) {
                // 第二参为 gEvent 引用
                return executor(params, gEvent);
            } else return params;
        } else {
            throw new Error("对不起，该方法不支持 reference 引用为空的调用，引用缺失！");
        }
    }
}

// 命令 -> Action 的绑定关系，此处命令是 g6 的 Command，而 Action 是注入函数
const EVENT_COMMANDS = {
    'save': DiMap.onSubmit,
    "reset": DiMap.onReset,
    "tpl": DiMap.onTpl,
    "zoomIn": DiMap.onZoomIn,
    "zoomOut": DiMap.onZoomOut
}

export class GCommand {
    private readonly _gEvent: any = null;
    private readonly _gCommands: any = {};

    constructor(gEvent: any) {
        this._gEvent = gEvent;
        // 在此处注入相关信息，将 Command 绑定到 GEvent 变量中
        DI_NAME.forEach(event => {
            // 当前属性，用于 run 操作
            const wrapExecutor = generateFn(this._gEvent, event);
            /*
             * 注入两个地方：
             * 1. 外层调用 run 方法，会执行 -- Command
             * 2. 外层不调用 run 方法时，直接执行 -- None Command
             */
            this._gCommands[event] = wrapExecutor;
            gEvent[event] = wrapExecutor;
        });
        // 默认值注入
    }

    /*
     * 命令初始化
     */
    initialize() {
        // 注入函数信息
        const gEvent = this._gEvent;
        const graph = gEvent.g6Graph();

        /**
         * 鼠标进入节点 - node:mouseenter
         * 鼠标移出节点 - node:mouseleave
         *
         * 鼠标移动到内部，需要显示可连接的点，鼠标移除时则需要隐藏显示点
         *
         * 由于视觉上有延迟，所以点击画布时还需要消除连接点
         */
        graph.on('node:mouseenter', __BND.bindCombine([
            __BND.bindPortShow(gEvent),
            __BND.bindNodeAddon(gEvent)
        ]));
        graph.on('node:mouseleave', __BND.bindCombine([
            __BND.bindPortShow(gEvent, false),
            __BND.bindToolRemove(gEvent)
        ]));
        graph.on('blank:click', __BND.bindPortShow(gEvent, false));

        /*
         * 这两个事件用于移动到 Edge 边上时操作，如果移动到边上边，那么显示首尾对应的
         * 可拖动点，如果可拖拽，那么则触发后续的
         * edge:change:target：修改目标点
         * edge:change:source：修改源点
         */
        graph.on('edge:mouseenter', __BND.bindEdgeAddon(gEvent));
        graph.on('edge:mouseleave', __BND.bindToolRemove(gEvent));
        graph.on('edge:change:target', __BND.bindPortShow(gEvent));
        graph.on('edge:change:source', __BND.bindPortShow(gEvent));

        /*
         * 连接完成后触发连接完成的 Callback 参数，弹出对话框填写关系添加的相关信息
         * 1）先验证是否合法
         * 2）再添加
         */
        graph.on('edge:connected', __BND.bindEdgeConnected(gEvent));

        graph.on('node:added', __BND.bindNodeAdd(gEvent));
        graph.on('node:removed', __BND.bindNodeRemove(gEvent));
        graph.on('node:click', __BND.bindNodeClick(gEvent));
        graph.on('node:dblclick', __BND.bindNodeClick(gEvent, true));
    }

    /*
     * Toolbar 生成 onClick 专用
     * <Toolbar onClick/> 属性绑定
     */
    run = (name: string) => {
        const eventKey = EVENT_COMMANDS[name];
        if (eventKey) {
            const executor = this._gCommands[eventKey];
            // 最终调用
            if (__Zn.isFunction(executor)) {
                executor({});
            } else {
                console.warn("无法捕捉命令信息。", eventKey, this._gCommands);
            }
        }
    }
}