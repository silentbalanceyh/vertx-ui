import React from 'react'
import './Cab.less'
import {Input, Table} from 'antd';
import Op from './UI.Render';
import Ux from 'ux';
import U from 'underscore';

class Component extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            source: props.value || [{key: Ux.randomUUID()}]
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            const value = nextProps.value;
            if ("object" === typeof value) {
                this.setState(value);
            }
        }
    }

    render() {
        const {config = {}, $render, ...jsx} = this.props;
        const {value, ...rest} = jsx;
        if (config.columns) {
            config.columns = Op.renderColumn(this, config.columns, jsx, $render);
        }
        const {source = []} = this.state;
        if (U.isArray(source)) {
            source.forEach((item, index) => (item.sequence = (index + 1)))
        }
        return (
            <Input.Group {...rest}>
                <Table {...config} className={"web-table-editor"} pagination={false}
                       dataSource={value}/>
            </Input.Group>
        )
    }
}

export default Component;