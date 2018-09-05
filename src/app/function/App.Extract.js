import Ux from 'ux';
import {Langue} from 'environment';
import {Alert, Button} from "antd";
import Op from "./App.Op";
import UI from "../control/ExamplePanel/UI";
import React from "react";
import Immutable from "immutable";

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
        each.header = `${namespace}/${files[index]}.json`;
        $source.push(each);
    });
    return $source;
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
    const {md = [], $hoc} = reference.state;
    const namespace = $hoc.namespace();
    const $markdown = [];
    md.forEach((each, index) => {
        const item = {};
        item.key = Ux.randomUUID();
        item.header = `${namespace}/${files[index]}`;
        item.content = each;
        $markdown.push(item);
    });
    return $markdown;
};

const demoButtons = (reference, buttons = []) => {
    return (
        <span style={{
            border: "dashed 1px #ddd",
            display: "inline-block",
            height: 48,
            width: "100%",
            padding: 6,
            borderRadius: 10,
            marginTop: 100
        }}>
            {buttons.map(button => (
                <Button id={button.key} key={button.key} type={"dashed"} ghost
                        onClick={Op.demoClick(reference, button.message)}
                >{button.text}</Button>
            ))}
        </span>
    )
};
const demoMessage = (reference) => {
    const {message} = reference.state ? reference.state : {};
    return message ? (
        <Alert message={message} type={"success"}/>
    ) : false
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
    const attrs = {
        $configuration,
        $markdown, $source,
        reference
    };
    return (
        <UI {...Ux.toUniform(reference.props)}
            {...attrs}>
            {jsx}
        </UI>
    )
};
const inject = (reference, ...keys) => {
    const {set = {}} = reference.state;
    set.rxInject = injectOptFun.apply(this, [reference].concat(keys));
    return set;
};
const injectOptFun = (reference, ...keys) => {
    const {set = {}} = reference.state;
    return (data) => {
        keys.forEach(key => {
            if (set.hasOwnProperty(key)) {
                data[key] = set[key];
            }
        });
        return data;
    };
};
export default {
    markdown,
    ui,
    inject,
    injectOptFun,

    demoMessage,
    demoButtons
}