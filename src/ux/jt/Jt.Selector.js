import Random from "../util/Ux.Random";
import Ai from '../ai/AI';
import Prop from '../prop';
import Param from '../fun/Ux.Param';
import Async from '../prop/Ux.Field';
import Dialog from '../Ux.Dialog';
import E from '../Ux.Error';
import Uson from '../structure/Ux.Uson'
import {Button} from "antd";
import React from "react";
import Immutable from 'immutable';

const jslInit = () => ({
    $visible: false,
    $loading: false,
    $data: [],
    $select: undefined,
});

const _fnChange = (reference, config = {}) => (pagination, filters, sorter) => {
    reference.setState({$loading: true, $visible: true});
    const {mock} = reference.props;
    if (config.ajax) {
        const params = _fnParams(reference, config);
        params.pager.size = pagination.pageSize;
        params.pager.page = pagination.current;
        // 补充设置$page页面值
        Async.asyncData(config.ajax, params, ($data) => reference.setState({
            $loading: false, $data, $page: pagination.current
        }), mock);
    }
};
const _fnDialog = (reference = {}, show = false) => (event) => {
    event.preventDefault();
    let state = {};
    state.$visible = show;
    state = Immutable.fromJS(state).toJS();
    reference.setState(state)
};

const _fnSelect = (reference = {}, config = {}) => (event) => {
    event.preventDefault();
    const {$select} = reference.state;
    const ref = reference.props.reference;
    if ($select) {
        if (config.linker) {
            const values = Uson.create($select)
                .keep(Object.keys(config.linker))
                .convert(config.linker)
                .date(config.linkerDate).to();
            E.fxInfo(true, 10081, config.linker, values);
            Prop.formHits(ref, values);
            const {fnCallback} = config;
            if (fnCallback) {
                fnCallback($select);
            }
        }
        reference.setState({$visible: false})
    } else {
        E.fxTerminal(!config.validation, 10080, config.validation);
        if (config.validation) {
            Dialog.showError(ref, config.validation);
        }
    }
};
const _fnParams = (reference, config = {}) => {
    E.fxTerminal(!config.ajax, 10053, config);
    if (config.ajax) {
        const ref = Prop.onReference(reference, 1);
        E.fxTerminal(!ref, 10079, ref);
        if (ref) {
            return Param.parseAjax(ref, config.ajax.params);
        }
    }
};

const jslLoading = (reference, config = {}) => event => {
    if (event) event.preventDefault();
    reference.setState({
        $loading: true, $visible: true,
        $data: [], $tableKey: Random.randomString(16),
        $select: undefined
    });
    const {mock} = reference.props;
    if (config.ajax) {
        const params = _fnParams(reference, config);
        Async.asyncData(config.ajax, params, ($data) => reference.setState({$loading: false, $data}), mock);
    }
};

const jslDialog = (reference, config = {}) => {
    const dialog = Ai.aiExprWindow(config.window);
    // Footer关闭
    dialog.footer = (
        <span>
            <Button icon="check" className="ux-success"
                    onClick={_fnSelect(reference, config)}>{dialog.okText}</Button>
            <Button icon="close" type="danger"
                    onClick={_fnDialog(reference, false)}>{dialog.cancelText}</Button>
        </span>
    );
    dialog.onCancel = _fnDialog(reference, false);
    return dialog;
};
const _uiPagination = (reference, config = {}) => {
    const {$data = {}, $page} = reference.state;
    const pagination = {
        showQuickJumper: true
    };
    pagination.total = $data.count;
    if (config.ajax && config.ajax.params) {
        const pager = config.ajax.params.pager;
        E.fxTerminal(!pager, 10048, pager);
        if (pager) {
            pagination.pageSize = pager.size;
            pagination.current = $page ? $page : pager.page;
        }
    }
    return pagination;
};
const jslPager = (reference, config = {}) => {
    const pager = {};
    if ("client" !== config.pagination) {
        pager.onChange = _fnChange(reference, config);
        pager.pagination = _uiPagination(reference, config);
    } else {
        pager.pagination = true;
    }
    return pager;
};

const jslSelection = (reference) => ({
    type: 'radio',
    onSelect: keys => {
        reference.setState({$select: keys})
    }
});
const jslConfig = (reference, $config = {}) => {
    const {config = {}} = reference.props;
    $config = Immutable.fromJS($config).toJS();
    Object.assign($config, config);
    return $config;
};
// jsl = Js Selector List
export default {
    jslInit,
    jslConfig,
    jslLoading,
    jslDialog,
    jslPager,
    jslSelection
}