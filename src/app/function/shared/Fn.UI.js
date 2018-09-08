import Ux from "ux";
import {Drawer} from "antd";
import React from "react";
import UI from "../../control/ExamplePanel/UI";
import Immutable from "immutable";
import {Langue} from "environment";

const drawer = (ref, key, children, additional = {}) => {
    const {reference, $visible = false} = ref.props;
    const drawer = Ux.fromHoc(ref, "drawer");
    return (
        <Drawer {...drawer} {...additional} onClose={() => {
            const state = {};
            state[key] = false;
            reference.setState(state)
        }} visible={$visible} height={500}
                className={"web-drawer-panel"}>
            {children}
        </Drawer>
    )
};

const _removed = Immutable.fromJS([
    "_button",
    "_dialog",
    "_loading",
    "_placeholder",
    "_logicals",
    "_demo"
]);
const _prepareJson = (reference, file) => {
    const {$hoc} = reference.state;
    const namespace = $hoc.namespace();
    const target = `${namespace}/${file}`;
    const config = Langue(target);
    return config;
};

const prepareJson = (reference, ...files) => {
    const $source = [];
    const {$hoc} = reference.state;
    files.forEach((file, index) => {
        const namespace = $hoc.namespace();
        const each = {};
        each.key = Ux.randomUUID();
        const data = _prepareJson(reference, file);
        const content = {};
        Object.keys(data).filter(key => !_removed.contains(key))
            .forEach(key => content[key] = data[key]);
        each.content = content;
        each.header = `cab/${Ux.Env['LANGUAGE']}/${namespace}/${files[index]}.json`;
        $source.push(each);
    });
    return $source;
};

const connect = (reference, file) => {
    const {$hoc} = reference.state;
    const namespace = $hoc.namespace();
    const each = {};
    each.key = Ux.randomUUID();
    const data = _prepareJson(reference, file);
    const content = {};
    Object.keys(data).filter(key => !_removed.contains(key))
        .forEach(key => content[key] = data[key]);
    each.content = content;
    each.header = `cab/${Ux.Env['LANGUAGE']}/${namespace}/${file}.json`;
    return each;
};

const prepareTree = (reference, file) => {
    const config = _prepareJson(reference, file);
    if (config) {
        return config['_configuration'];
    } else {
        return config;
    }
};
const markdown = (reference, ...uris) => {
    const array = [];
    uris.forEach(uri => array.push(Ux.ajaxResource(uri)));
    return Promise.all(array).then(md => reference.setState({md}))
};
const prepareMarkdown = (reference, ...files) => {
    const {md = []} = reference.state;
    const $markdown = [];
    md.forEach((each, index) => {
        const item = {};
        item.key = Ux.randomUUID();
        item.tab = `${files[index]}`;
        item.content = each;
        $markdown.push(item);
    });
    return $markdown;
};
/**
 * 统一函数
 * @param reference
 * @param tree
 * @param files
 * @returns {Function}
 */
const ui = (reference, tree, ...files) => (jsx) => {
    // 1.读取属性
    const $configuration = prepareTree(reference, tree);
    // 2.直接将files分组
    const jsFiles = files.filter(file => file.endsWith(".js") || file.endsWith(".ts"));
    const jsonFiles = files.filter(file => !(file.endsWith(".js") || file.endsWith(".ts")));
    // 3.构造面板
    const $markdown = prepareMarkdown.apply(this, [reference].concat(jsFiles));
    const $source = prepareJson.apply(this, [reference].concat(jsonFiles));
    // 4.工具栏禁用
    const $tool = Ux.fromHoc(reference, "disabled");
    // 5.Diagram专用
    const $diagram = Ux.fromHoc(reference, "diagram");
    // 6.内置属性列表
    const $datalist = Ux.fromHoc(reference, "datalist");
    // 7.内置文件结构
    const $datatree = Ux.fromHoc(reference, "datatree");
    const attrs = {
        $configuration,
        $diagram, $datalist, $datatree, // 绘图专用
        $markdown, $source, $tool,
        reference
    };
    return (
        <UI {...Ux.toUniform(reference.props)}
            {...attrs}>
            {jsx}
        </UI>
    )
};
export default {
    ui,
    markdown,
    drawer,
    connect
}