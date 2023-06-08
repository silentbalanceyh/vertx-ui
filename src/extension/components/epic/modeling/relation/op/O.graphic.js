import Ux from "ux";
import Ex from "ex";

export default {
    onSubmit: (thisRef, current = {}) => (gRequest, gEvent) => {
        /**
         * 数据结构
         * {
         *     "model": "当前操作模型的 key",
         *     "graphic": "变更后模型对应的 Spider 的值，对应模型中的 graphic 数据，可直接还原成 G6 的图",
         *     "removed": [
         *         "移除关系对应的 key"
         *     ],
         *     "relations": [
         *         {
         *             "此处每个元素都使用 M_RELATION 的关系定义节点"
         *         }
         *     ]
         * }
         */
        const reference = gEvent.reference();
        const graph = gEvent.g6Graph();
        if (Ux.x6IsFree(graph)) {
            Ux.sexMessage(reference, 'free', 2);
        } else {
            // 正式提交
            // reference.?etState({$submitting: true});    // 基础提交
            Ux.of(reference).submitting().handle(() => {
                const request = {};
                {
                    request.model = current.key;
                    request.graphic = gRequest.graphicJ();      // 读取 JSON 数据

                    // relations 和 removed 计算
                    const {$original = {}} = reference.state;
                    // 新数据和旧数据
                    const {relations = []} = $original;
                    const edges = gRequest.edgesData();

                    // removed 计算，使用原来的 - 新的 = 移除的
                    const removeSet = new Set();
                    relations.forEach(each => removeSet.add(each.key));
                    edges.forEach(each => removeSet.delete(each.key));
                    request.removed = Array.from(removeSet);
                    // 最新的 relations 数据
                    request.relations = edges;
                }
                // API调用
                Ux.ajaxPost('/api/relation/definition', request).then(response => {
                    // 提交完成
                    Ux.sexDialog(thisRef, 'submitted',
                        () => Ux.of(reference).submitted().done()
                        // () => reference.?etState({$submitting: false})
                    )
                })
            })


        }
    },
    onGraphInit: (thisRef, current = {}) => (gEvent) => {
        /*
         * response 的数据结构
         * {
         *     "nodes": [],
         *     "edges": [],
         *     "graphic": {}
         * }
         */
        const reference = gEvent.reference();
        if (gEvent) {
            /**
             * 定义图时的操作
             * 1）如果存在 response.graphic 中存储的数据，则以 response.graphic 中的数据构造图
             * 2）如果第一次，则分两种情况：
             * -- 2.1）无初始化数据的情况，不包含 relations 中的定义，则直接用`单节点`构造图
             * -- 2.2）有初始化数据，直接使用 relations 中的关系定义来构造图
             */
            const data = {};
            return Ux.ajaxGet('/api/relation/definition/:category', {category: current.key}).then(response => {
                if (response['graphic']) {
                    // 已经存储过图的相关数据了
                    Object.assign(data, response['graphic']);
                } else {
                    // 构造全新的数据
                    let relations = response['relations'] ? response['relations'] : [];
                    // 读取所有节点数据
                    const sourceNodes = Ux.onDatum(reference, 'graphic.nodes');
                    // 收集所有的 upstream / downstream
                    const identifiers = new Set();
                    if (0 < relations.length) {
                        /**
                         * 关系运算，根据关系计算节点信息
                         */
                        const nodes = [];
                        relations.forEach(item => {
                            identifiers.add(item.upstream);
                            identifiers.add(item.downstream);
                        });
                        Array.from(identifiers).forEach(identifier => {
                            const node = Ux.elementUnique(sourceNodes, 'identifier', identifier);
                            if (current.identifier === identifier) {
                                nodes.push(gEvent.nodeCreate(node, true));
                            } else {
                                nodes.push(gEvent.nodeCreate(node))
                            }
                        });
                        const edges = [];
                        relations = Ux.clone(relations);
                        relations.forEach(relation => edges.push(gEvent.edgeCreate(relation)));
                        data.nodes = nodes;
                        data.edges = edges;
                    } else {
                        data.nodes = [gEvent.nodeCreate(current, true)];
                        data.edges = [];
                    }
                    // 创建新内容需要执行布局计算
                    gEvent.layoutOn(data, {
                        focusNode: current.identifier
                    })
                }
                return Ux.promise(data);
            })
        } else {
            console.error("GEvent 对象构造失败，请检查定义配置！！");
            return Ux.promise({
                nodes: [],
                edges: []
            })
        }
    },
    /**
     * 限制条件
     * 1）当前节点可创建自引用，而其他节点不能创建自引用。
     * 2）不可重建重复关系（源到目标）
     * 3）其他节点之间不可创建关系
     */
    onEdgeConnectedBefore: (reference, managed = {}) => (edge = {}, gEvent) => {
        // 1. 验证当前线 Edge 是否重复
        const graph = gEvent.g6Graph();
        const duplicated = Ux.x6IsDupEdge(edge, graph); // Op.koDuplicated(edge, gEvent);
        if (duplicated) {
            Ux.sexMessage(reference, 'duplicated', 2);  // 3秒消息
            return false;
        }
        // 2. 验证环形，edge 的 source 和 target 相等时需要比较 reference
        const loop = Ex.X6.isLoopOk(edge, managed);
        if (loop) {
            Ux.sexMessage(reference, 'loop', 2);
            return false;
        }
        // 3. 验证其他关系
        const unmanaged = Ex.X6.isUnmanaged(edge, managed);
        if (unmanaged) {
            Ux.sexMessage(reference, 'unmanaged', 2);
            return false;
        }
        return true;
    },
}