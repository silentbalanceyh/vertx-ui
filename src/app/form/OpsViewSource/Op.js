import {Dsl} from 'entity';
import {Of} from 'app';
import Ux from 'ux';
import Ex from "ex";
import FormOp from "../../web/OpsSourceOp/UI";
import Form from "../OpsFormSource/UI";
import React from "react";

const yiInit = (reference) => {
    const state = {};
    state.$ready = true;
    const card = Ux.fromHoc(reference, "card");
    if (card.extra) {
        state.$extra = Ux.clone(card.extra);
    }

    // 窗口处理
    Ex.uiDialog(reference).footer((props = {}) => {
        const {$submitting = false} = props;
        return (
            <FormOp reference={reference} $submitting={$submitting}/>
        )
    }).child(() => {
        const {$inited = {}} = reference.props;
        return (<Form {...Ex.yoAmbient(reference)}
                      $mode={Ux.Env.FORM_MODE.EDIT}
                      $inited={$inited}/>)
    }).onMount(state);

    const {$key} = reference.props;
    if ($key) {
        Dsl.of(reference).bind(Of.apiSourceInfo).ok(response => {
            state.$inited = response;
            reference.setState(state);
        }).async({key: $key});
    } else {
        reference.setState(state);
    }
}
const yuInit = (reference, virtualRef) => {
    const current = reference.props.$key;
    const previous = virtualRef.props.$key;
    if (current !== previous) {
        reference.setState({
            $ready: false,
            $inited: undefined
        });
        const state = {}
        Dsl.of(reference).bind(Of.apiSourceInfo).ok(response => {
            state.$inited = response;
            state.$ready = true;
            reference.setState(state);
        }).async({key: current});
    }
}
const rxExtra = (reference) => ({
    lnkEdit: (event, config = {}) => {
        const {$inited} = reference.props;
        Ex.uiDialog(reference, __dialog => __dialog.onOpen($inited));
    },
    lnkSync: (event, config = {}) => {
        // TODO: 同步数据源，暂时 Pending
    },
    lnkDel: (event, config = {}) => {
        const {$inited = {}} = reference.props;
        reference.setState({$loading: true});
        Dsl.of(reference).bind(Of.apiSourceDelete).ok(response => {
            const {rxRefresh} = reference.props;
            if (Ux.isFunction(rxRefresh)) {
                rxRefresh();
            }
            reference.setState({$loading: false});
        }).async($inited);
    }
})
export default {
    yiInit,
    yuInit,
    rxExtra
}