import {Dsl} from 'entity';
import {Of} from 'app';
import Ux from 'ux';
import Ex from "ex";
import React from "react";
import Form from '../../form/OpsFormSource/UI';
import FormOp from '../OpsSourceOp/UI';

const _yiData = (reference, state = {}) => {
    Dsl.of(reference).bind(Of.apiSource).ok(response => {
        state.$sources = response;
        state.$ready = true;
        reference.setState(state);
    }).async();
}
const yiSource = (reference) => {
    const state = {};
    Ex.uiDialog(reference).footer((props = {}) => {
        const {$submitting = false} = props;
        return (
            <FormOp reference={reference} $submitting={$submitting}/>
        )
    }).child(() => {
        const {$inited = {}} = reference.state;
        return (<Form {...Ex.yoAmbient(reference)}
                      $inited={$inited}/>)
    }).onMount(state);

    _yiData(reference, state);
}
const onSelect = (reference) => (selected = [], menu = {}) => {
    const {rxSelect} = reference.props;
    if (Ux.isFunction(rxSelect)) {
        const {node} = menu;
        const data = node && node.props ? node.props.data : {};
        rxSelect(selected[0], data);
    } else {
        console.error("关键函数丢失：", rxSelect);
    }
}
const onShow = (reference) => (event) => {
    Ux.prevent(event);
    Ex.uiDialog(reference, __dialog => __dialog.onOpen({}));
}
const yuSource = (reference, virtualRef) => {
    let isRefresh = Ex.upValue(reference.props, virtualRef.props, "$refresh");
    if (isRefresh) {
        const state = {};
        reference.setState({$ready: false});
        _yiData(reference, state);
    } else {
        isRefresh = Ex.upValue(reference.state, virtualRef.state, "$refresh");
        if (isRefresh) {
            const state = {};
            reference.setState({$ready: false});
            _yiData(reference, state);
        }
    }
}
export default {
    yiSource,
    yuSource,
    onSelect,
    onShow,
}