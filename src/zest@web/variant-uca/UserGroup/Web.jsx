import {Card, Checkbox, Empty, Menu} from 'antd';
import React from 'react';
import Op from './Op';

const renderType = (reference) => {
    const {
        $dataType = [],
        $config = {},
        $dataKeys = []
    } = reference.state;

    const {title = {}} = $config;
    // Menu Items
    const items = [];
    $dataType.forEach(item => {
        const itemMenu = {};
        itemMenu.label = item.title;
        itemMenu.key = item.code;
        itemMenu.icon = item.icon;
        items.push(itemMenu);
    })
    return (
        <Card title={title.root} size={"small"}>
            <Menu onSelect={Op.rxViewQ(reference)} selectedKeys={$dataKeys}
                  items={items}/>
        </Card>
    );
}
const renderChecked = (reference) => {
    const {
        $dataValue = [],
        $dataKeys = [],
        $config = {}
    } = reference.state;
    const {value = []} = reference.props;

    const options = [];
    $dataValue.filter(item => $dataKeys.includes(item.category)).forEach(item => {
        const option = {};
        option.key = item.key;
        option.text = item.name;// `${item.name}（${item.code}）`;
        option.value = item.key;
        option.type = item.category;
        option.icon = item.icon;
        options.push(option);
    });
    const {title} = $config;
    if (0 < options.length) {
        return (
            <Checkbox.Group className={"checked-group"}
                            value={value}
                            onChange={Op.rxChange(reference)}>
                {options.map(option => (
                    <div className={"checked-item"} key={option.key}>
                        <Checkbox key={option.key} value={option.value}>
                            {option.icon ? option.icon : false}
                            {option.icon ? <span>&nbsp;&nbsp;</span> : false}
                            {option.text}
                        </Checkbox>
                    </div>
                ))}
            </Checkbox.Group>
        );
    } else {
        return (
            <Empty description={title.empty} className={"checked-empty"}/>
        )
    }
}
export default {
    renderType,
    renderChecked,
}