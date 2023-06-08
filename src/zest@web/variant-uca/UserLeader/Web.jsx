import React from 'react';
import {Checkbox, Col, Input, Row} from 'antd';
import Op from './Op';
import UserSelector from '../UserSelector/UI';
import __Zn from '../zero.uca.dependency';

const renderSelector = (reference, item, valueInput = {}) => {
    const {$config = {}, $keySet = []} = reference.state;
    const attrs = {};
    const {linker = {}, title, info = {}} = $config;
    attrs.config = {
        linker
    };
    if (title['managerName']) {
        attrs.config.user = `${item.name}${title['managerName']}`;
        attrs.placeholder = __Zn.formatExpr(info.placeholder, title, true);
    }
    attrs.onChange = Op.rxSelected(reference, item);
    attrs.disabled = !$keySet.includes(item.key);
    attrs.allowClear = true;
    const assistData = __Zn.onUniform(reference);
    const {value, $selected} = valueInput;
    attrs.value = value;
    attrs.$keySet = {key: $selected};
    // $app
    return (
        <UserSelector {...assistData} {...attrs} reference={reference}/>
    )
}

const renderColumn = (reference, item) => {
    const {$columns = []} = reference.state;
    return $columns.map((column, index) => {
        return (
            <Col className={"leader-item-selector"}
                 span={7} key={`pos${item.key}-${column.field}`}>
                <Row>
                    <Col span={10} className={"form-item"}>
                        {column.label}：
                    </Col>
                    <Col span={14}>
                        {(() => {
                            const {value = {}} = reference.props;
                            const record = value != null && value[item.key] ? value[item.key] : {};
                            const valueRow = record[column.field];
                            if (0 === index) {
                                return renderSelector(reference, item, {
                                    value: valueRow,
                                    $selected: record['managerId'] // 选中专用
                                });
                            } else {
                                return (<Input readOnly value={valueRow}/>)
                            }
                        })()}
                    </Col>
                </Row>
            </Col>
        )
    })
}

const renderItem = (reference, item) => {
    const {$keySet = []} = reference.state;
    return (
        <Row className={"leader-item"}>
            <Col span={3}>
                <Checkbox onChange={Op.rxChecked(reference, item)}
                          checked={$keySet.includes(item.key)}/>
                <span className={"leader-name"}>{item.name}</span>
            </Col>
            {renderColumn(reference, item)}
        </Row>
    );
}
export default {
    renderItem
}