import React from 'react';
import {Button, Col, Empty, Icon, Input, Popover, Row, Select} from 'antd';
import Ux from 'ux';
import Op from './Op';

const renderScript = (reference, item = {}) => {
    const info = Ux.fromHoc(reference, "info");
    return (
        <Popover placement={"left"} trigger={"click"}
                 className={"op-script-content"}
                 overlayClassName={"ops-script-over"}
                 overlayStyle={{width: "300px"}}
                 content={
                     <Input value={item.runScript}
                            placeholder={info.script}
                            onChange={Op.rxChange(reference, {
                                ...item,
                                field: "runScript"
                            })}/>
                 }>
            <Icon type={"code"}/>
        </Popover>
    )
}

const renderRow = (reference, item = {}) => {
    const {$sourceField, $targetField} = reference.state;
    const selectField = Ux.fromHoc(reference, "selectField");
    return (
        <Row key={item.key} className={"select-row"}>
            <Col span={4} style={{textAlign: "center"}}>
                <Button.Group>
                    <Button icon={"plus"} shape={"circle"}
                            onClick={Op.rxAdd(reference, item)}/>
                    <Button icon={"minus"} shape={"circle"}
                            onClick={Op.rxRemove(reference, item)}/>
                </Button.Group>
            </Col>
            <Col span={9}>
                <Select style={{width: "100%"}} {...selectField}
                        maxTagCount={0} mode="multiple"
                        onChange={Op.rxChange(reference, {
                            ...item,
                            field: "source"
                        })} value={item.source}>
                    {$sourceField.map(field => {
                        return (
                            <Select.Option key={field.key} value={field.key}>
                                {field.name}
                            </Select.Option>
                        )
                    })}
                </Select>
            </Col>
            <Col span={9}>
                <Select style={{width: "100%"}} {...selectField}
                        onChange={Op.rxChange(reference, {
                            ...item,
                            field: "target"
                        })} value={item.target}>
                    {$targetField.map(field => {
                        return (
                            <Select.Option key={field.key} value={field.key}>
                                {field.name}
                            </Select.Option>
                        )
                    })}
                </Select>
            </Col>
            <Col span={1} className={"op-script"}>
                {renderScript(reference, item)}
            </Col>
        </Row>
    )
}

export default (reference) => {
    const info = Ux.fromHoc(reference, "info");
    return (
        <div className={"range"}>
            <Row className={"title-row title-row-select"}>
                <Col span={10} offset={4}>
                    {info.sourceField}
                </Col>
                <Col span={10}>
                    {info.targetField}
                </Col>
            </Row>
            {(() => {
                const {$sourceField, $targetField} = reference.state;
                if ($sourceField && $targetField) {
                    const {$relations = []} = reference.state;
                    return $relations.map((item, index) => renderRow(reference, {
                        ...item,
                        index,
                    }));
                } else {
                    return (<Empty description={info['unselected']}/>)
                }
            })()}
        </div>
    )
}