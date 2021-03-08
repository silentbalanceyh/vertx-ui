import {Button, Modal, Table} from "antd";
import Op from "./Op";
import React from "react";
import {LoadingAlert} from "web";
import Ex from "ex";

const renderOp = (reference) => {
    const {$op} = reference.state;
    if ($op) {
        return (
            <Button id={$op} onClick={Op.rxClick(reference)} className={"ux-hidden"}/>
        )
    } else return false;
}

export default {
    renderSearch: (reference) => {
        const {$alert = {}} = reference.state;
        const {$form = {}} = reference.props;
        let Component = $form.FormSearch ? $form.FormSearch : false;
        return (
            <div>
                <LoadingAlert $alert={$alert}/>
                {Component ? (
                    <Component rxFailure={Op.rxFailure(reference)}
                               rxSubmit={Op.rxSubmit(reference)}/>
                ) : false}
                {renderOp(reference)}
            </div>
        )
    },
    renderDialog: (reference) => {
        const {
            $dialog = {}, $visible = false,
            $table = {}, $data = []
        } = reference.state;
        return (
            <Modal className="web-dialog" {...$dialog} visible={$visible}>
                <Table {...$table} dataSource={$data}/>
            </Modal>
        )
    },
    renderDynamic: (reference, item) => {
        const {$form = {}} = reference.props;
        const {$inited = {}} = reference.state;
        let Component = $form.FormDynamic ? $form.FormDynamic : false;
        if (Component) {
            const inherit = Ex.yoAmbient(reference);
            return (
                <Component {...inherit} $inited={$inited} rxClose={Op.rxClose(reference, item.key)}/>
            )
        } else return false;
    }
}