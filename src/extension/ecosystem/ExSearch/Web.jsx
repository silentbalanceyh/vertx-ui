import Op from './Op';
import React from 'react';
import Ex from 'ex';
import {Button, Drawer, Input, Tooltip} from 'antd';
import Ux from "ux";
import {LoadingAlert} from "web";
import './Cab.less';

const _renderNotice = (reference) => {
    const {$notice} = reference.state;
    return $notice ? (
        <LoadingAlert $alert={$notice} $type={"warning"}/>
    ) : false;
};

const renderDrawer = (reference) => {
    const {
        $advanced,
        $visible = false
    } = reference.state;
    $advanced.visible = $visible;
    const {$form = {}} = reference.props;
    const {FormFilter} = $form;
    if (FormFilter) {
        const filterAttrs = Ex.yoFilter(reference);
        return (
            <Drawer {...$advanced} className={"ex-drawer"}>
                {/* Drawer issue: https://github.com/ant-design/ant-design/issues/20175 */}
                {_renderNotice(reference)}
                <FormFilter {...filterAttrs}/>
            </Drawer>
        );
    } else return false;
}

const _renderInput = (reference) => {
    const {$search, searchText} = reference.state;
    return (
        <Input.Search {...$search} value={searchText}/>
    )
};

const _renderTooltip = (title, fnRender) => {
    if (title) {
        return (
            <Tooltip title={title} placement={"top"}>
                {fnRender()}
            </Tooltip>
        )
    } else {
        return fnRender();
    }
};

const _renderRedo = (reference) => {
    const {config = {}, $disableClear = false} = reference.props;
    const title = config[Ex.Opt.SEARCH_OP_REDO];
    const advanced = Op.isAdvanced(reference);
    return _renderTooltip(title, () => (
        <Button icon={"redo"} htmlType={"button"}
                className={advanced ? "search-right" : "search-clean"}
                disabled={$disableClear}
                onClick={Op.onClear(reference)}/>
    ));
};

const _renderAdvanced = (reference) => {
    const {config = {}} = reference.props;
    const title = config[Ex.Opt.SEARCH_OP_ADVANCED];
    return _renderTooltip(title, () => (
        <Button icon={"filter"} htmlType={"button"}
                onClick={Ex.rsVisible(reference)}/>
    ))
};

const _renderButtons = (reference) => (
    <Button.Group className={"ex-search"}>
        {_renderAdvanced(reference)}
        {_renderRedo(reference)}
        {Ux.anchorSearch(reference)}
    </Button.Group>
);

export default (reference) =>
    Op.isSearch(reference) ? (
        <span>
            {_renderInput(reference)}
            &nbsp;&nbsp;
            {Op.isAdvanced(reference) ?
                _renderButtons(reference) :
                false
            }
            {Op.isAdvanced(reference) ?
                renderDrawer(reference) :
                false
            }
        </span>
    ) : false;