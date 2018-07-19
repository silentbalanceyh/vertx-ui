import React from 'react'
import './Cab.less'
import {DropTarget} from 'react-dnd'
import {Button, Row} from 'antd';
import Op from './Op';
import LayoutRow from './UI.Layout.Row'

class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: []
        };
    }

    render() {
        const {connectDropTarget} = this.props;
        const {rows = []} = this.state;
        return connectDropTarget(
            <div>
                {rows.map(item => (<LayoutRow reference={this}
                                              key={item.key}
                                              $key={item.key}/>))}
                <Row>
                    <Button icon={'plus'} onClick={Op.rowAdd(this)}/>
                </Row>
            </div>
        )
    }
}

export default DropTarget(
    Op.DragTypes.FormDesigner,
    Op.targetSpec,
    Op.targetConnect
)(Component);