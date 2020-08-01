import {Tree} from "antd";
import React from "react";
import Ux from 'ux';
import Ex from 'ex';

const authData = (state = {}, reference) => {
    const {config = {}} = reference.props;
    const {$views = []} = reference.state;
    const {$resources, $source = []} = state;
    if ("string" === typeof $resources) {
        const view = Ux.elementUnique($views, "resourceId", $resources);
        const {event = {}} = config;
        const viewConfig = event[$resources];
        if (view) {
            const original = Ux.clone(viewConfig);
            // 将 view 中的数据拷贝到对应的 original 中
            original.rows.datum = view.rows;
            original.criteria.datum = view.criteria;
            original.projection.datum = view.projection;
            const calculated = Ex.authKeySet($source, original);
            if (calculated.keys) {
                state.$keySet = new Set(calculated.keys);
            } else {
                state.$keySet = new Set($source.map(item => item.key));
            }
        } else {
            // 没有找到对应的视图，则直接处理
            state.$keySet = new Set($source.map(item => item.key));
        }
    }
}

const rxGroup = (reference) => (keys = [], item = {}) => {
    const {node = {}} = item;
    const $data = node.props ? node.props.data : {};
    // 分组信息触发机制
    const {config = {}} = reference.props;
    const {group = {}, ui = {}} = config;
    // 读取 key 值
    let identifier;
    if (group.config && group.config['vector']) {
        identifier = $data[group.config['vector']];
    }

    // 读取数据信息
    const {ajax = {}, vector = {}, unsupport = []} = ui.config ? ui.config : {};
    const unsupportSet = new Set(unsupport);
    if (!ajax.method) ajax.method = "GET";

    // 需要加载
    reference.setState({$loading: true});
    Ux.toLoading(() => Ux.asyncPromise(ajax, {identifier: $data.identifier}).then(response => {
        let $resources;
        if (identifier) {
            $resources = vector[identifier];
        } else {
            $resources = undefined;
        }
        // 设置选中过后的 $source 数据
        const state = {
            $resources,
            $loading: false
        };
        state.$selected = $data;    // 选择的数据信息
        response.forEach(each => {
            each._cn = Ux.valuePinyin(each.alias);
            each.key = each.name;
            each.value = each.name;
            each.label = each.alias; // `${each.alias}「${each.name}」`;
            if (unsupportSet.has(each.name)) {
                each._type = "SYSTEM";
                each.disabled = true;   // 禁用
            } else {
                each._type = "BUSINESS";
            }
        })
        if (0 < response.length) {
            const $source = response.sort(Ux.sorterAscFn('_cn'));
            state.$source = $source;
            state.$datum = $source;
            // $validation 处理
            state.$validation = $source
                .filter(item => "SYSTEM" === item._type)
                .map(item => item.key);
            // $keySet 设置，后期需要对接到内容层
            authData(state, reference);
        } else {
            state.$source = undefined;
            state.$validation = [];
            state.$keySet = new Set();
        }
        reference.setState(state);
    }), 32.8)
}
export default (reference) => {
    const {$tree = [], $heightStyle} = reference.state;
    return (
        <div {...$heightStyle} className={"page-group"}>
            <Tree treeData={$tree}
                  onSelect={rxGroup(reference)}
                  defaultExpandAll/>
        </div>
    )
}