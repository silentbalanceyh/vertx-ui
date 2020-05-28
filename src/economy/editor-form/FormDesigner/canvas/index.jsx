import React from 'react';
import RowEditor from './UI.Row';

export default (reference) => {
    const {raft = {}} = reference.state;
    const form = raft.form;
    /*
     * 行数计算
     */
    const ui = []; // form.ui ? form.ui : [];
    if (0 === ui.length) {
        /*
         * 如果没有值（新增表单），添加默认行信息
         */
        ui.push({})
    }
    console.info(form.ui);
    return (
        <div>
            <RowEditor/>
        </div>
    )
}