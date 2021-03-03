import Ux from 'ux';
import Ex from 'ex';

const yiData = (reference, state = {}) => {
    const {$inited} = reference.props;
    /*
     * 赋值专用，初始化（编辑）
     */
    const {$source = [], $target = []} = state;
    if ($inited.sourceKey) {
        /*
         * 初始化树的选择
         */
        const sourceSet = new Set($inited.sourceKey);
        const keys = $source
            .filter(item => sourceSet.has(item.key) || sourceSet.has(item.parentId))
            .map(item => item.key)
            .filter(item => undefined !== item);
        const keySet = new Set(keys);
        state.$keySet = keySet;
        state.$sourceKey = $source
            .filter(item => sourceSet.has(item.key));
        state.$sourceField = $source
            .filter(item => keySet.has(item.key))
            .filter(item => "FIELD" === item.type);
    }
    if ($inited.targetKey) {
        /*
         * 初始化目标数据源
         */
        const found = Ux.elementUnique($target, "key", $inited.targetKey);
        if (found) {
            const foundParent = Ux.elementUnique($target, "key", found.parentId);
            if (foundParent) {
                state.$itemDropKey = foundParent.key;
                const {$itemDropResult = []} = state;
                const tree = Ux.elementChildTree($itemDropResult, foundParent);
                tree.forEach(node => node.selectable = true);
                state.$itemDropTree = tree;
            }
            /*
             * 初始化树的选择
             */
            state.$targetKey = found;
            state.$targetField = Ux.elementFind($target, {
                parentId: $inited.targetKey
            });
        }
    }
    if ($inited.vector) {
        /*
         * 初始化关系
         */
        state.$relations = Ux.clone($inited.vector);
    } else {
        state.$relations = [{
            key: Ux.randomUUID()
        }]
    }
}

const yiPage = (reference) => {
    const state = {};
    const ajaxSource = Ux.ajaxGet("/api/search/data-sub-source", {});
    const ajaxTarget = Ux.ajaxGet("/api/search/data-sub-target", {});
    Ux.parallel([ajaxSource, ajaxTarget], "source", "target").then(response => {
        // 数据源
        const {source = [], target = []} = response;
        state.$source = source;
        state.$target = target;
        state.$treeSource = Ux.toTree(source, {title: "name"});
        state.$itemDrop = target.filter(item => !item.parentId);
        const dropResult = Ux.toTreeArray(target.filter(item => !!item.parentId), {title: "name"});
        dropResult.forEach(item => item.selectable = false);
        state.$itemDropResult = dropResult;
        // 右手选择
        yiData(reference, state);
        state.$ready = true;
        reference.setState(state);
    })
}
const rxSelect = (reference) => (key) => {
    const {$itemDropResult = [], $itemDrop = []} = reference.state;
    const state = {};
    const current = Ux.elementUnique($itemDrop, "key", key);
    const tree = Ux.elementChildTree($itemDropResult, current);
    tree.forEach(node => node.selectable = true)
    state.$itemDropTree = tree;
    state.$itemDropKey = key;
    reference.setState(state);
}
const rxTreeChecked = (reference) => (keySet = []) => {
    // 生成 sourceField
    const keys = keySet ? Array.from(keySet) : [];
    if (0 < keys.length) {
        const {$source = []} = reference.state;
        const keySet = new Set(keys);
        const state = {};
        state.$sourceKey = $source
            .filter(item => keySet.has(item.key))
            .filter(item => "TABLE" === item.type);
        state.$sourceField = $source
            .filter(item => keySet.has(item.key))
            .filter(item => "FIELD" === item.type);
        return state;
    } else {
        return {
            $sourceKey: undefined,
            $sourceField: undefined
        }
    }
}
const rxTreeSelect = (reference) => (keys = []) => {
    const key = keys[0];
    if (key) {
        const {$target = []} = reference.state;
        const state = {};
        // 先查找表信息
        const table = Ux.elementUnique($target, 'key', key);
        if (table) {
            state.$targetKey = Ux.clone(table);
            state.$targetField = Ux.elementFind($target, {
                parentId: table.key
            });
            reference.setState(state);
        } else {
            reference.setState({
                $targetKey: undefined,
                $targetField: undefined
            });
        }
    } else {
        reference.setState({
            $targetKey: undefined,
            $targetField: undefined
        });
    }
}
const rxAdd = (reference, item = {}) => (event) => {
    Ux.prevent(event);
    let {$relations = []} = reference.state;
    $relations = Ux.clone($relations);
    $relations.splice(item.index + 1, 0,
        {key: Ux.randomUUID()});

    reference.setState({$relations});
}
const rxRemove = (reference, item = {}) => (event) => {
    Ux.prevent(event);
    let {$relations = []} = reference.state;
    $relations = Ux.clone($relations);
    $relations = $relations.filter(each => item.key !== each.key);
    reference.setState({$relations});
}
const rxChange = (reference, item = {}) => (event) => {
    const value = Ux.ambEvent(event);
    let {$relations = []} = reference.state;
    $relations = Ux.clone($relations);
    // 构造新数据
    const data = {};
    data[item.field] = value;
    data.key = item.key;
    Ux.elementSave($relations, data);
    reference.setState({$relations});
}

const rxSubmit = (reference) => (event) => {
    Ux.prevent(event);
    const {$sourceField, $targetField} = reference.state;
    if ($sourceField && $targetField) {
        const {
            $relations = [],
            $sourceKey,
            $targetKey,
        } = reference.state;
        const normalized = [];
        $relations.forEach(item => {
            if (item.source && item.target) {
                normalized.push(item);
            }
        })
        if (0 < normalized.length) {
            // 提交数据合并
            const {$inited = {}} = reference.props;
            const task = {};
            task.sourceKey = $sourceKey.map(item => item.key);
            task.source = $sourceKey.map(item => item.name);
            task.targetKey = $targetKey.key;
            task.target = $targetKey.name;
            task.vector = normalized;
            task.runCount = 0;
            task.isRun = false;
            const combine = Object.assign({}, $inited, task);
            // 提交新的
            Ex.dialog(reference).saveRow(combine, {close: true});
        } else {
            Ux.sexMessage(reference, "field")
        }
    } else {
        Ux.sexMessage(reference, "source")
    }
}

export default {
    yiPage,
    rxSelect,
    rxTreeChecked,
    rxTreeSelect,
    // 数据部分
    rxAdd,
    rxRemove,
    rxChange,
    rxSubmit
}