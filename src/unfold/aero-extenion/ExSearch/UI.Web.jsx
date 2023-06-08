import Op from './UI.Op';
import React from 'react';
import {Button, Input, Tooltip} from 'antd';
import Ux from "ux";
import "./Cab.norm.scss";
import __Zn from '../zero.aero.dependency';

import renderDrawer from './Web.Drawer';
import renderCriteria from './QView.Web.jsx';

const _renderInput = (reference) => {
    const {$search, searchText} = reference.state;
    // Fix: https://gitee.com/silentbalanceyh/vertx-zero-scaffold/issues/I6VQKR
    const attrKwClean = {};
    attrKwClean.id = Ux.Env.K_UI.BTN_CLEAR_KEYWORD;
    attrKwClean.key = "btnClearKeyword";
    attrKwClean.className = "ux_hidden";
    const fields = Op.dataConds(reference);
    attrKwClean.onClick = event => {
        Ux.prevent(event);
        if (searchText) {
            const {$condition = {}} = reference.props;
            const subset = Ux.valueSubset($condition, fields);
            if (Ux.isEmpty(subset)) {
                Ux.of(reference).in({
                    searchText: ""
                }).done()
            }
        }
    }
    // #QR_LOCK
    const {$qrVLock = []} = reference.props;
    const disabled = !!Ux.elementInAll(fields, $qrVLock);

    return [
        <Input.Search {...$search}
                      key='inputSearch'
                      disabled={disabled}
                      value={searchText}/>,
        <Button {...attrKwClean}/>
    ]
};

const _renderTooltip = (title, fnRender) => {
    if (title) {
        return (
            <Tooltip title={title} placement={"top"}
                     destroyTooltipOnHide>
                {fnRender()}
            </Tooltip>
        )
    } else {
        return fnRender();
    }
};

const _renderRedo = (reference) => {
    const {
        config = {},
        $condition = {},
        // #QR_LOCK
        $qrVLock = [],
    } = reference.props;
    const title = config[__Zn.Opt.SEARCH_OP_REDO];
    const attrs = {};
    attrs.icon = Ux.v4Icon("delete");
    if (0 === Object.keys($condition).length) {
        attrs.disabled = true;
    } else {
        // #QR_LOCK
        const subset = Object.keys($condition)
        if (0 === $qrVLock.length) {
            const counter = subset.map(key => $condition[key])
                .filter(value => null === value || 0 < value.length);
            attrs.disabled = 0 === counter.length;
        } else {
            attrs.disabled = Ux.elementInAll(subset, $qrVLock);
        }
    }
    return _renderTooltip(title, () => (
        <Button onClick={Op.onClear(reference)} {...attrs}/>
    ));
};
const _renderView = (reference) => {
    const {config = {}} = reference.props;
    const view = config[__Zn.Opt.SEARCH_OP_VIEW];
    if (view) {
        const attrs = {}
        attrs.className = "uc_pink";
        return _renderTooltip(view, () => (
            <Button icon={Ux.v4Icon("fullscreen")} {...attrs}
                    onClick={Op.onShow(reference)}/>
        ));
    } else return false;
}
const _renderAdvanced = (reference) => {
    const {config = {}} = reference.props;
    const title = config[__Zn.Opt.SEARCH_OP_ADVANCED];
    const advanced = Op.isAdvanced(reference);
    return _renderTooltip(title, () => (
        <Button icon={Ux.v4Icon("filter")} htmlType={"button"}
                className={advanced ? "search-right" : "search-clean"}
                onClick={event => {
                    Ux.prevent(event);
                    Ux.of(reference).open().done();
                }}/>
    ));
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (reference) =>
    Op.isSearch(reference) ? (
        <span className={"ux_op_search"}>
            <Button id={Ux.Env.K_UI.BTN_CLEAR_SEARCH} className={"ux_hidden"}
                    onClick={event => {
                        Ux.prevent(event);
                        Ux.of(reference).in({searchText: ""}).done();
                    }}/>
            {_renderInput(reference)}
            &nbsp;&nbsp;
            <Button.Group>
                {_renderView(reference)}
                {Op.isAdvanced(reference) ? _renderRedo(reference) : false}
                {Op.isAdvanced(reference) ? _renderAdvanced(reference) : false}
                {Op.isAdvanced(reference) ? Ux.anchorSearch(reference) : false}
            </Button.Group>
            {renderCriteria(reference)}
            {Op.isAdvanced(reference) ? renderDrawer(reference) : false}
        </span>
    ) : false;