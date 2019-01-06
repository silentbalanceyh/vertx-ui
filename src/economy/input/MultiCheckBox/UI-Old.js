import React from 'react';
import Ux from 'ux';
import './Cab.less';
import Immutable from 'immutable';
import {Checkbox, Row} from 'antd';

class Component extends React.PureComponent {

    render() {
        const {
            data = [], config = {}, vertical = true, childLine = true,
            fnChild, ...jsx
        } = this.props;
        const {key = "key", label = "label", labelExpr, items = "items"} = config;
        // 构造options
        const options = [];
        data.forEach(item => {
            const option = {};
            // 支持表达式
            if (labelExpr) {
                option.label = Ux.formatExpr(labelExpr, item);
            } else {
                option.label = item[label];
            }
            option.value = item[key];
            option.key = item[key];
            option.disabled = item.disabled;
            // 渲染子节点
            if (fnChild) {
                let itemArr = [];
                if (0 <= items.indexOf('.')) {
                    const path = items.split('.');
                    itemArr = Immutable.fromJS(item).getIn(path);
                    if (itemArr) {
                        itemArr = itemArr.toJS();
                    } else {
                        itemArr = [];
                    }
                } else {
                    // 直接取
                    if (Array.prototype.isPrototypeOf(item[items])) {
                        itemArr = Immutable.fromJS(item[items]).toJS();
                    }
                }
                itemArr.forEach(each => each.parent = item[key]);
                option.children = itemArr;
            } else {
                option.children = [];
            }
            options.push(option);
        });
        return (
            <span>
                <Checkbox.Group {...jsx}>
                    {options.map(item => {
                        const {label, ...rest} = item;
                        return (vertical ? (
                                <Row className={"web-check-row"} key={item.key}>
                                    <Checkbox {...rest}>
                                        {label}
                                    </Checkbox>{childLine ? <br/> : false}
                                    {fnChild ? fnChild(item) : false}
                                </Row>
                            ) : (
                                <span className={"web-check-col"} key={item.key}>
                                    <Checkbox {...rest}>
                                    {label}
                                    </Checkbox>
                                    {fnChild ? fnChild(item) : false}
                                </span>
                            )
                        );
                    })}
                </Checkbox.Group>
            </span>
        );
    }
}

export default Component;