import {Tree} from "antd";
import React from "react";
import Ux from 'ux';
import I from './I.group.visitant';

const fnActive = (reference, $resources) => {
    // 父类关联，处理按钮状态
    const ref = Ux.onReference(reference, 1);
    if (ref) {
        const {$module} = reference.state;
        if ($module) {
            let {$selected = {}} = ref.state;
            $selected = Ux.clone($selected);
            $selected[$module] = $resources;
            ref.setState({$selected});
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
    if (group.config && group.config['vectorField']) {
        identifier = $data[group.config['vectorField']];
    }

    // 读取数据信息
    const {ajax = {}, vector = {}, unsupport = []} = ui.config ? ui.config : {};
    const unsupportSet = new Set(unsupport);

    // 需要加载
    reference.setState({$loading: true});

    /*
     * 通用处理，实现整体操作
     */
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

    // ajax
    const fnAjax = Ux.isEmpty(ajax) ?
        () => {
            if ($resources) {
                const options = Ux.fromHoc(reference, "options");
                const {items = [], group = []} = options;
                state.$dataGroup = group;
                return Ux.promise(items);
            } else {
                /*
                 * 没有资源和它关联
                 */
                return Ux.promise([]);
            }
        } :
        () => {
            if (!ajax.method) ajax.method = "GET";
            return Ux.asyncPromise(ajax, {identifier: $data.identifier});
        }

    Ux.toLoading(() => fnAjax().then(response => {
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
        });
        return Ux.promise(response)
    }).then(response => {
        if (0 < response.length) {
            const $source = response.sort(Ux.sorterAscFn('_cn'));
            state.$source = $source;
            state.$datum = $source;
            // $validation 处理
            const validateSet = new Set();
            $source.filter(item => "SYSTEM" === item._type).forEach(item => {
                if (Ux.isArray(item.data)) {
                    item.data.forEach(key => validateSet.add(key));
                } else {
                    validateSet.add(item.key);
                }
            });
            state.$validation = Array.from(validateSet);
            // $keySet 设置，后期需要对接到内容层
            I.authData(state, reference);
        } else {
            state.$source = undefined;
            state.$validation = [];
            state.$keySet = new Set();
        }
        // resource 中的信息是否 visitant
        I.authVisit(state, config, {
            props: reference.props,
            state: {
                // 合并状态
                ...reference.state,
                ...state,
            }
        }).then(state => {
            reference.setState(state);
            // 父类关联，处理按钮状态
            fnActive(reference, $resources);
        })
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