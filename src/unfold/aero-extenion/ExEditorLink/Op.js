import Ux from 'ux';
import {_I} from 'zet';

const rxSearch = (ajax = {}, $query = {}) => {
    return Ux.asyncPromise(ajax, $query).then(data => {
        const combine = {};
        combine.$data = Ux.valueArray(data);
        combine.$query = $query;
        combine.$loading = false;
        return Ux.promise(combine);
    })
}

const yiTreeBuild = (tree, reference) => {
    const {
        type,
        source,
    } = tree;
    if (type) {
        return _I.category({type})
    } else {
        const data = Ux.onDatum(reference, source);
        return Ux.promise(data);
    }
}

const yiTree = (tree = {}, reference) => {
    const {
        config = {}
    } = tree;
    return yiTreeBuild(tree, reference).then(response => {
        const $tree = {};
        $tree.treeArray = Ux.clone(response);
        $tree.treeData = Ux.toTree(response, config);
        return Ux.promise($tree);
    })
}
const yiEditor = (ajax = {}, reference) => {
    const params = Ux.xtLazyAjax(reference, {ajax});
    const query = Ux.fromHoc(reference, "query");

    const request = Ux.clone(query);
    Object.assign(request, params);
    return rxSearch(ajax, request).then((qrData = {}) => {
        const result = {};
        Object.assign(result, qrData);
        // 默认参数
        result.$queryDefault = Ux.clone(qrData.$query);
        return Ux.promise(result);
    }).catch(Ux.E.fxCatch(reference, ajax.error));
}
const yoSelection = (reference) => (record = {}) => {
    const props = {};
    const {$plugins = {}} = reference.props;
    const {koSelection} = $plugins;
    if (Ux.isFunction(koSelection)) {
        props.disabled = !koSelection(record);
    } else {
        props.disabled = false;
    }
    return props;
}
// ======================== 事件 =======================
const rxKeyword = (reference, condition = []) => (event) => {
    // 构造新的 $query 条件
    if (0 < condition.length) {
        const $keyword = Ux.ambEvent(event);
        Ux.of(reference).in({
            $keyword
        }).done();
        // reference.?etState({$keyword});
    }
}
const rxTree = (reference) => (keys = []) => {
    const $keySet = new Set();
    const {config = {}} = reference.props;
    const {tree = {}} = config;
    const {value = "key"} = tree.config ? tree.config : {};
    // 提取 value 中自带的字段值
    const {$tree = {}} = reference.state;

    keys.forEach(key => {
        if ("key" === value) {
            $keySet.add(key);
        } else {
            const {treeArray = []} = $tree;
            const found = Ux.elementUnique(treeArray, 'key', key);
            if (found && found[value]) {
                $keySet.add(found[value]);
            }
        }
    });
    Ux.of(reference).in({
        $keySet
    }).loading(false).done();
    // reference.?etState({$loading: true, $keySet});
}
const rxSubmit = (reference) => (event) => {
    Ux.prevent(event);
    const {$selected = []} = reference.state;
    if (0 === $selected.length) {
        const {config} = reference.props;
        Ux.messageFailure(config.validation);
    } else {
        const {rxLink} = reference.props;
        if (Ux.isFunction(rxLink)) {
            const {$lazy = {}} = reference.state;
            rxLink($selected, $lazy);
        } else {
            console.warn("`rxLink`函数没有设置！！");
        }
    }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    yiTree,
    yiEditor,

    yoSelection,

    rxKeyword,
    rxTree,
    rxSearch,
    rxSubmit,
}