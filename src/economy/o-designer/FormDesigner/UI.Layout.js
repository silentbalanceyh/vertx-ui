import React from 'react';
import {Button, Row} from 'antd';
import Op from './Op';
import LayoutRow from './UI.Layout.Row';
import {_zero} from "../../_internal";

@_zero({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI.Layout",
    state: {
        rows: []
    }
})
class Component extends React.Component {

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
        );
    }
}

export default Component;