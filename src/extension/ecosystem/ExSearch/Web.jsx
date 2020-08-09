import Op from './Op';
import React from 'react';
import Ex from 'ex';
import {Button, Input, Tooltip} from 'antd';
import renderDrawer from './Web.Filter';
import './Cab.less';
import Ux from "ux";

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