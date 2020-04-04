import GEventConfig from './O.event.config';

import Executors from './I.executor';
import Command from './I.command';

import Abs from '../../../abyss';
import Dev from '../../../develop';
import Fn from '../func';

const enum EditorMode {
    Once = "ONCE",         /* 只能拖拽一次的绘制 */
    Standard = "STANDARD"  /* 标准模式 */
};

const bindEvent = (event = {}, key, gEvent: GEvent) => {
    /* 合并所有的 keys */
    const command = event[key] ? event[key] : {};
    const commandRef: any = {};
    Object.keys(command).filter(name => Abs.isFunction(command[name])).forEach(name => {
        const executor = command[name](gEvent);
        if (Abs.isFunction(executor)) {
            commandRef[name] = executor;
        }
    });
    return commandRef;
};

const runExecutor = (params = {}, name, validator = {}, executor: any = {}) => {
    let fnVerify: any = () => true;
    const fnValidator = validator[name];
    if (Abs.isFunction(fnValidator)) {
        fnVerify = fnValidator;
    }
    const {fnInternal, fnExternal} = executor;
    /* 验证函数先触发 */
    if (fnVerify(params)) {
        /*
         * 验证通过则执行
         */
        if (Abs.isFunction(fnInternal)) {
            /*
             * 先执行内部函数
             */
            fnInternal(executor.gEvent, params);
        }
        /*
         * 再执行外部函数
         */
        if (Abs.isFunction(fnExternal)) {
            fnExternal(params);
        }
    }
};

class GEvent {
    private readonly referenceRef = null;
    private readonly config = null;
    private readonly mode = null;
    private graphRef = null;
    /*
     * 行为处理
     * 1. command ：命令专用处理器
     * 2. executor ：执行专用处理器 CustomEvent
     * 3. validator ：验证专用处理器
     */
    private command: any = {};
    private executor: any = {};
    private validator: any = {};

    constructor(reference: any) {
        if (!reference) {
            throw new Error("对不起，不可传入空引用：reference");
        }
        this.referenceRef = reference;
        const graphic = reference.state ? reference.state.$graphic : {};
        this.config = new GEventConfig(graphic);
        /* 编辑模式判断 */
        const {source} = graphic;
        if (source && source.type) {
            if (EditorMode.Once === source.type) {
                this.mode = source.type;
            } else {
                this.mode = EditorMode.Standard;
            }
        } else {
            this.mode = EditorMode.Standard;
        }
        Dev.dgGraphic({mode: this.mode}, "当前图的最终模式！");
    }

    /*
     * Command专用执行器
     */
    onEvent(event: any = {}): GEvent {
        /*
         * 先绑定验证器
         */
        this.validator = bindEvent(event, 'validator', this);
        /*
         * 再绑定 command 和 executor
         */
        this.executor = bindEvent(event, 'executor', this);
        this.command = bindEvent(event, 'command', this);
        /*
         * 已经绑定好的
         */
        const executorRef = this.executor;
        Object.keys(Executors)
            /*
             * 最初的绑定是根据输入绑定的，那么有可能会出现没有 internal 的情况，这种情况需要使用
             * 一个值来占位，表示：
             * 1）外部没有传入，而内部存在的函数
             * 2）后续执行的时候会根据占位符执行
             */
            .filter(eventName => !executorRef.hasOwnProperty(eventName))
            .forEach(eventName => {
                this.executor[eventName] = false;
            });
        Dev.dgGraphic({
            input: event,
            output: {
                validator: this.validator,
                executor: this.executor,
                command: this.command
            }
        }, "绑定结果");
        return this;
    }

    onGraph(graph: any): GEvent {
        this.graphRef = graph;
        Dev.dgGraphic(graph, "绑定 graph 成功，建立连接！");
        this.referenceRef.setState({$ready: true});
        return this;
    }

    configGraphic(addOn: any = {}) {
        const graphic = this.config.configGraphic(addOn);
        if (!Abs.isEmpty(this.executor)) {
            /*
             * 事件注入
             */
            Object.keys(this.executor).forEach(name => {
                const fnExternal = this.executor[name];
                graphic[name] = (params: any = {}) => runExecutor(params, name, this.validator, {
                    fnExternal,                                                     /* 外部函数 */
                    fnInternal: Executors[name] ? Executors[name] : undefined,      /* 内部函数 */
                    gEvent: this,
                })
            })
        }
        Dev.dgGraphic(graphic, "最终图配置");
        return graphic;
    }

    configEditor() {
        const editor: any = this.config.configEditor();
        /* 命令行专用处理 */
        const commandRef = this.command;
        if (!Abs.isEmpty(commandRef)) {
            /*
             * 事件注入
             */
            const wrapper = {};
            Object.keys(commandRef).forEach(name => {
                const fnExternal = commandRef[name];
                wrapper[name] = (params: any = {}) => runExecutor(params, name, this.validator, {
                    fnExternal,                                                     /* 外部函数 */
                    /* 内部函数 Command 不带外部函数 */
                    // fnInternal: Executors[name] ? Executors[name] : undefined,
                    gEvent: this,
                })
            });
            editor.command = wrapper;
        }
        return editor;
    }

    configContext() {
        return this.config.configContext();
    }

    configItems() {
        return this.config.configItems();
    }

    configCommands() {
        return this.config.configCommands();
    }

    configWindow() {
        return this.config.configWindow();
    }

    dataItems() {
        const {$items = []} = this.referenceRef.state;
        /* 是否执行过滤 */
        if (EditorMode.Once === this.mode) {
            const {$dropped} = this.referenceRef.state;
            const droppedSet = Abs.immutable($dropped);
            /* 根据 Mode 计算 */
            return $items.filter(item => !droppedSet.contains(item.identifier));
        } else {
            return $items;
        }
    }

    dataGraph() {
        const nodes = this.graph().getNodes();
        const edges = this.graph().getEdges();
        return {nodes, edges};
    }

    dataSource(key: any) {
        return this.config.dataSource(key);
    }

    /*
     * 根据名称生成
     * 1. validator
     * 2. command = true，直接执行 command
     *    command = false, 直接执行 executor 内容
     */
    generate(name, command: boolean = false): Function {
        const fnInternal = command ? Command[name] : Executors[name];
        const fnExternal = command ? this.command[name] : this.executor[name];
        return (params: any) => runExecutor(params, name, this.validator, {
            fnInternal, fnExternal,
            gEvent: this,
        })
    }

    graph() {
        if (this.graphRef) {
            return this.graphRef;
        } else {
            throw new Error("对不起，未绑定图相关信息，graphRef = null！");
        }
    }

    attributes() {
        const inherit: any = {};
        /* 第一属性（数据属性）*/
        const {$data, $submitting = false, $dropped = []} = this.referenceRef.state;
        if ($data) {
            inherit.data = $data;
        } else {
            inherit.data = {nodes: [], edges: []};
        }
        /* 第二属性（防重复提交）*/
        inherit.$submitting = $submitting;
        inherit.$dropped = $dropped;        /* 这行代码用于触发 re-render，必须存在 */

        /* 最恒是 $event */
        inherit.$event = this;

        return inherit;
    }

    dataCurrent() {
        const {$current = {}} = this.referenceRef.props;
        return $current;
    }

    dataFocus() {
        const {$focus} = this.referenceRef.state;
        return $focus;
    }

    reference() {
        return this.referenceRef;
    }

    /**
     * ----------------------- 下边是对外专用的操作 API -----------------------
     * g6：针对图的相关操作，如移除图上元素，查找等
     * rs：React State 的缩写，针对 reference.state 中的状态改变函数
     */
    g6Remove(model: any) {
        const graph = this.graph();
        const item = graph.findById(model.id);
        if (item) {
            graph.remove(item);
            graph.refresh();
        }
    }

    g6AddEdges(models: any = []) {
        const graph = this.graph();
        models.forEach(model => {
            graph.add("edge", model);
        });
        graph.refresh();
    }

    g6AddEdge(model: any = {}) {
        const graph = this.graph();
        graph.add("edge", model);
        graph.refresh();
    }

    g6Update(model: any, data: any) {
        const graph = this.graph();
        const itemId = model.id;
        const item = graph.findById(itemId);
        /* 更新数据 */
        Object.assign(model, data);
        item.update(model);
        item.refresh();
    }

    g6Forbidden(item: any) {
        if (item) {
            const graph = this.graph();
            /* 不显示锚点信息，证明不可连接，如果强制连接会出现相关信息 */
            graph.setItemState(item, "addingEdge", false);
            graph.setItemState(item, "limitLink", false);
        }
    }

    g6Nodes(model: any, exclude: boolean = true) {
        if (model) {
            const graph = this.graph();
            /*
             * 处理 nodes
             */
            let nodes = graph.getNodes();
            let edges = graph.getEdges();
            if (exclude) {
                /*
                 * 过滤当前节点
                 */
                nodes = nodes.filter(node => {
                    const nodeModel = node.getModel();
                    return nodeModel.id !== model.id;
                });
            }
            return {
                nodes: nodes.map(node => Fn.g6GetNode(node)),
                edges: edges.map(edge => Fn.g6GetEdge(edge))
            };
        }
    }

    /*
     * React State
     */
    rsDropRemove(identifier: any) {
        if (EditorMode.Once === this.mode && identifier) {
            const {$dropped} = this.referenceRef.state;
            const droppedSet = new Set($dropped);
            droppedSet.delete(identifier);

            /* 删除合并 */
            const $replaced = Abs.clone(Array.from(droppedSet));
            this.referenceRef.setState({$dropped: $replaced});
        }
    }

    rsState(state: any = {}) {
        if (!Abs.isEmpty(state)) {
            this.referenceRef.setState(state);
        }
    }

    rsDropAdd(identifier: any) {
        if (EditorMode.Once === this.mode && identifier) {
            const {$dropped} = this.referenceRef.state;
            const droppedSet = new Set($dropped);
            droppedSet.add(identifier);

            /* 添加合并 */
            const $replaced = Abs.clone(Array.from(droppedSet));
            this.referenceRef.setState({$dropped: $replaced});
        }
    }

    rsShow(initialize: any = {}, model: any) {
        this.referenceRef.setState({
            $visible: true,
            $inited: initialize,
            $focus: model,
        })
    }

    rsClose() {
        this.referenceRef.setState({
            $visible: false,
            $inited: undefined, $focus: undefined,
        });
    }
}

export default GEvent;