import React from 'react';
import {Col, Icon, Input, Row, Select, Tag} from 'antd';
import './Cab.less';
import Op from './Op';

const renderTag = (reference, data, field) => {
    const {items = []} = data;
    const {value = {}} = reference.props;
    return (
        <Tag color={"blue"}>
            <div className={"title"}>{data.name}</div>
            <Select key={field} style={{
                width: "100%"
            }} onChange={Op.rxChange(reference, field)} value={value[field]}>
                {items.map(item => {
                    return (
                        <Select.Option key={item.id} value={item.id}>
                            {item.name}
                        </Select.Option>
                    )
                })}
            </Select>
        </Tag>
    )
}

class Component extends React.PureComponent {
    render() {
        const {$source = {}, $target = {}, ...rest} = this.props;
        console.log("prop:",this.props)
        return (
            <Input.Group className={"ops-linker"} {...rest}>
                <Row>
                    <Col span={8}>
                        {renderTag(this, $source, "from")}
                        <div className={"comment"}>
                            {$source.info}
                        </div>
                    </Col>
                    <Col span={2} className={"link"}>
                        <div className={"icon"}>
                            <Icon type={"link"} style={{
                                fontSize: 28,
                                color: "#3eb7ff"
                            }}/>
                        </div>
                    </Col>
                    <Col span={8}>
                        {renderTag(this, $target, "to")}
                        <div className={"comment"}>
                            {$target.info}
                        </div>
                    </Col>
                </Row>
            </Input.Group>
        )
    }
}

export default Component