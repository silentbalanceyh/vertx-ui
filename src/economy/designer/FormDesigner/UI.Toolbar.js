import React from 'react'
import './Cab.less'
import {_zero} from "../../_internal";
import {Collapse, List} from 'antd';
import DragItem from './UI.Toolbar.Item'

@_zero({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI.Toolbar"
})
class Component extends React.PureComponent {
    render() {
        const {$hoc} = this.state;
        const collapse = $hoc._('_collapse');
        const {items = [], ...other} = collapse;
        return (
            <Collapse {...other}>
                {items.map(item => {
                    const {children = [], ...rest} = item;
                    return (
                        <Collapse.Panel {...rest}>
                            <List dataSource={children} renderItem={item => (
                                <DragItem {...item} {...this.props}/>
                            )}/>
                        </Collapse.Panel>
                    )
                })}
            </Collapse>
        )
    }
}

export default Component