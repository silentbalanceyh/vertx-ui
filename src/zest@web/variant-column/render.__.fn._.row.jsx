import __Zn from './zero.uca.dependency';
import React from 'react';

import WebField from '../variant-uca/index.column.UNLOCK.ROW';

export default {

    ROW: (reference, column = {}) => {
        const {value = []} = reference.props;
        const {$config = {}} = column;
        const {
            field, jsx = {},
            fieldCond = 'key',
            fieldKey = 'key'
        } = $config;
        const executor = WebField[field];
        // jsx processing
        return (text, record = {}) => {
            const $jsx = __Zn.clone(jsx);
            if (__Zn.isFunction(executor)) {
                if (text) {
                    $jsx.value = text;
                }
                return executor(reference, $jsx, (data) => {
                    record[column.dataIndex] = data;
                    const $value = __Zn.clone(value);
                    let foundIndex = __Zn.elementIndex(value, fieldCond, record[fieldKey]);
                    if (0 <= foundIndex) {
                        $value[foundIndex] = __Zn.clone(record);
                    }
                    __Zn.fn(reference).onChange($value);
                })
            } else {
                return (
                    <span>{field} is invalid</span>
                )
            }
        }
    },
}