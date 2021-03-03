import Ux from "ux";
import {Of} from "app";
import {Dsl} from 'entity';
import Ex from "ex";
import FormOp from "../OpsTableColumnOp/UI";
import Form from "../../form/OpsFormTableColumn/UI";
import React from "react";

const yData = (reference, state = {}) => {
    // set ready to false, prepare loading
    reference.setState({$ready: false});

    const {data} = reference.props;
    const user = Ux.isLogged();
    // default pager value
    const query = Ux.fromHoc(reference, "query");
    // current pager value
    const {$query = {}} = state;
    const {pager = {}} = $query;
    const params = {};
    params.tableId = data.id;
    params.tenantId = user.company;
    params.page = pager.page?pager.page:query.pager.page;
    params.rows = pager.size?pager.size:query.pager.size;

    Dsl.of(reference).bind(Of.apiTableColumn).ok(response => {
        state.$dataSource = response['rows'];
        state.$total = response['total'];
        state.$ready = true;
        state.$query = {};
        state.$query.pager = {page: params.page, size: params.rows};
        reference.setState(state);
    }).async(params);
}

const yiInit = (reference) => {
    const state = {};
    const card = Ux.fromHoc(reference, "card");
    if (card.extra) {
        state.$extra = Ux.clone(card.extra);
    }
    const table = Ux.fromHoc(reference, "table");
    const $table = Ux.clone(table);
    $table.columns = Ux.configColumn(reference, $table.columns);
    state.$table = $table;

    // 窗口处理
    Ex.uiDialog(reference).footer((props = {}) => {
        const {$submitting = false} = props;
        return (
            <FormOp reference={reference} $submitting={$submitting}/>
        )
    }).child(() => {
        const {$inited = {}} = reference.state;
        return (<Form {...Ex.yoAmbient(reference)}
                      $mode={Ux.Env.FORM_MODE.EDIT}
                      $inited={$inited}/>)
    }).onMount(state);

    yData(reference, state);
}

const yuInit = (reference, virtualRef) => {
    const state = reference.state;
    // 物理表切换的情况
    if ( (null !== virtualRef.props.data.id && reference.props.data.id !== virtualRef.props.data.id)) {
        state.$query = {};
        yData(reference, state);
    }
    // 编辑后重新加载数据
    if (state.$refresh) {
        state.$refresh = false;
        yData(reference, state);
    }
}

const rxSearch = (reference) => ($keyword = "") => {
    reference.setState({$keyword})
}

const lnkEdit = (reference, record) => (event) => {
    Ux.prevent(event);
    Ex.uiDialog(reference, __dialog => __dialog.onOpen(record));

}
export default {
    yiInit,
    yuInit,
    rxSearch,
    yData,
    lnkEdit
}