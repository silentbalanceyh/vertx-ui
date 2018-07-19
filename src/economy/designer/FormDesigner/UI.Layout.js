import React from 'react'
import './Cab.less'
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
        const {rows = []} = this.state;
        const {target = {}} = this.props;
        return (
            <div>
                {rows.map(item => (<LayoutRow reference={this}
                                              pointer={this.props['pointer']}
                                              key={item.key}
                                              target={target}
                                              $key={item.key}/>))}
                <Row>
                    <Button icon={'plus'} onClick={Op.rowAdd(this)}/>
                </Row>
            </div>
        )
    }
}

export default Component;