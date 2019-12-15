import {Modal, Table} from "antd";
import React from "react";

export default (reference) => {
    const {
        $dialog = {}, $visible = false,
        $table = {}, $data = []
    } = reference.state;
    return (
        <Modal className="web-dialog" {...$dialog} visible={$visible}>
            <Table {...$table} dataSource={$data}/>
        </Modal>
    )
}