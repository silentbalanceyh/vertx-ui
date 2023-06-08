import datum from './engine.interface.datum';
import config from './engine.interface.config';
/*
 * 1）属性解析器
 * 2）表达式解析器
 * 3）查询引擎
 */
import parser from './engine.interface.parser';
import query from './engine.interface.query';
// 成套组件
import webComponent from './engine.web.interface.component';
import webNavigation from './engine.web.interface.navigation';
import webField from './engine.web.interface.field';
import webColumn from './engine.web.interface.column';
import webUnit from './engine.web.interface.unit';
import webUi from './engine.web.interface.ui';
import webAction from './engine.web.interface.action';
import webLayout from './engine.interface.ai.layout';
// functions
import fn_event from './engine.fn.interface.fn.on.event';
import fn_to from './engine.fn.interface.to';
import fn_child from './engine.fn.interface.child';
import fn_rx from './engine.fn.interface.rx';
import fn_ajax from './engine.fn.interface.fn.ajax';
import fn_anchor from './engine.fn.interface.fn.web-pin';
import fn_element from './engine.fn.interface.fn.datum.value';
import fn_redux from './engine.fn.interface.fn.write-redux';
import fn_tree from './engine.fn.interface.fn.tree';
import fn_listener from './engine.fn.interface.window';
// raft
import raft_form from './engine.interface.raft.form';
import raft_row from './engine.interface.raft.row';
import raft_cell from './engine.interface.raft.cell';
import raft_column from './engine.interface.raft.column';
import raft_render from './engine.interface.raft.render';
import raft_container from './engine.interface.raft.container';
// expression
import expr_ai from './engine.expr.interface.ai'
import expr_parse from './engine.expr.interface.parse'
import expr_apply from './engine.expr.interface.apply'
import Ant from './engine.expr.interface.c.ant';

export default {
    // engine expr
    ...expr_ai,
    ...expr_parse,
    ...expr_apply,
    Ant,
    // engine raft
    ...raft_form,
    ...raft_row,
    ...raft_cell,
    ...raft_column,
    ...raft_render,
    ...raft_container,
    // engine fn
    ...fn_redux,
    ...fn_event,
    ...fn_to,
    ...fn_child,
    ...fn_rx,
    ...fn_ajax,
    ...fn_anchor,
    ...fn_element,
    ...fn_tree,
    ...fn_listener,

    ...datum,
    ...config,

    ...parser,
    ...query,

    ...webComponent,
    ...webNavigation,
    ...webUnit,
    ...webField,
    ...webColumn,
    ...webUi,

    ...webAction,
    ...webLayout,
    // Nr: Rft.Normalizer,
}