import Ex from "ex";
import {Drawer} from "antd";
import React from "react";
import {LoadingAlert} from "web";

const _renderNotice = (reference) => {
    const {$notice} = Ex.state(reference);
    return $notice ? (
        <LoadingAlert $alert={$notice} $type={"warning"}/>
    ) : false;
};

export default (reference) => {
    const {
        $advanced,
        $visible = false
    } = Ex.state(reference);
    $advanced.visible = $visible;
    const {$form = {}} = reference.props;
    const {FormFilter} = $form;
    if (FormFilter) {
        const filterAttrs = Ex.yoFilter(reference);
        return (
            <Drawer {...$advanced} className={"ex-drawer"}>
                {_renderNotice(reference)}
                <FormFilter {...filterAttrs}/>
            </Drawer>
        );
    } else return false;
}