import Ux from 'ux';
import {Button, Tooltip} from 'antd';
import React from 'react';

const yiColumn = (reference) => {
    const editor = Ux.fromHoc(reference, "editor");
    const {column = {}} = editor;
    const {config = {}, ...rest} = column;
    rest.width = 96;
    rest.render = (text, record, index) => {
        const {add = {}, remove = {}} = config;
        return (
            <Button.Group>
                <Tooltip title={add.tooltip}>
                    <Button icon={add.icon} onClick={Ux.xtRowAdd(reference, record, index)}/>
                </Tooltip>
                <Tooltip title={remove.tooltip}>
                    <Button icon={remove.icon}
                            onClick={event => Ux.xtRowDel(reference, record, index)(event).then(merged => {
                                if (merged) {
                                    const {config = {}} = reference.props;
                                    Ux.fn(reference).onChange(Ux.xtFormat(merged, config.format));
                                }
                            })}/>
                </Tooltip>
            </Button.Group>
        )
    }
    return {...rest};
}
export default (reference, table = {}) => {
    const $table = Ux.clone(table);
    $table.columns = [yiColumn(reference)].concat(Ux.configColumn(reference, $table.columns));
    $table.className = $table.className ? `web-table-editor ${table.className}` : "web-table-editor";
    $table.pagination = false;
    return $table;
}