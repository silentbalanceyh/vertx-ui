import React from 'react'
import Ux from 'ux';
import {Input} from 'antd';

const aiStateInput = (reference, column) => () => {
    let {rowRecord = {}} = reference.state;
    rowRecord = Ux.clone(rowRecord);
    return (
        <Input value={rowRecord[column.dataIndex] ? rowRecord[column.dataIndex] : ""}
               onChange={event => {
                   event.preventDefault();
                   rowRecord[column.dataIndex] = event.target.value;
                   reference.setState({rowRecord});
               }}/>
    )
};
export default {
    TEXT: aiStateInput
}