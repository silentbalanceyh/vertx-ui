import Op from './Op';
import React from 'react';
import Ex from 'ex';
import {Button, Drawer, Input, Modal, Tooltip} from 'antd';
import Ux from "ux";
import {LoadingAlert} from "web";
import './Cab.less';
import QxCriteria from "../QxCriteria/UI";

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

const renderCriteria = (reference) => {
    const {
        config = {},
        $query,
        $myQr,
    } = reference.props;
    /*
     * 查询条件
     */
    const {$dialog = {}, $visibleQ = false} = reference.state;
    $dialog.visible = $visibleQ;
    $dialog.onCancel = () => reference.setState({$visibleQ: false});
    /*
     * 查询提示
     */
    const view = config[Ex.Opt.SEARCH_CRITERIA_VIEW];
    const {$filters = {}} = reference.state;
    // Fix: $myQr
    const value = Ux.clone($filters);
    if ($myQr) {
        Object.assign(value, $myQr);
    }
    return (
        <Modal {...$dialog}>
            {Ux.aiViewMy(view, reference)}
            <div>
                <QxCriteria reference={reference}
                            config={{
                                field: config.field,
                                query: $query
                            }} value={value}
                            onChange={Op.onViewPre(reference)}
                            {...Ux.toAssist(reference)}/>
            </div>
            <Button className={"ux-hidden"} id={$dialog.__onOk}
                    onClick={Op.opViewSave(reference)}/>
        </Modal>
    );
}

const _renderInput = (reference) => {
    const {$search, searchText} = reference.state;
    return (
        <Input.Search {...$search} compact value={searchText}/>
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
    return _renderTooltip(title, () => (
        <Button icon={"redo"} htmlType={"button"}
                disabled={$disableClear}
                onClick={Op.onClear(reference)}/>
    ));
};
const _renderView = (reference) => {
    const {config = {}} = reference.props;
    const view = config[Ex.Opt.SEARCH_OP_VIEW];
    if (view) {
        const attrs = {}
        attrs.className = "ux-spec";
        return _renderTooltip(view, () => (
            <Button icon={"fullscreen"} {...attrs}
                    onClick={Op.onShow(reference)}/>
        ))
    } else return false;
}
const _renderAdvanced = (reference) => {
    const {config = {}} = reference.props;
    const title = config[Ex.Opt.SEARCH_OP_ADVANCED];
    const advanced = Op.isAdvanced(reference);
    return _renderTooltip(title, () => (
        <Button icon={"filter"} htmlType={"button"}
                className={advanced ? "search-right" : "search-clean"}
                onClick={Ex.rsVisible(reference)}/>
    ))
};

export default (reference) =>
    Op.isSearch(reference) ? (
        <span>
            {_renderInput(reference)}
            &nbsp;&nbsp;
            <Button.Group className={"ex-search"}>
                {_renderView(reference)}
                {Op.isAdvanced(reference) ? _renderRedo(reference) : false}
                {Op.isAdvanced(reference) ? _renderAdvanced(reference) : false}
                {Op.isAdvanced(reference) ? Ux.anchorSearch(reference) : false}
            </Button.Group>
            {renderCriteria(reference)}
            {Op.isAdvanced(reference) ? renderDrawer(reference) : false}
        </span>
    ) : false;