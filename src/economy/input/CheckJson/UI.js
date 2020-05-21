import React from 'react';
import Ux from 'ux';
import Op from './op';
import {Checkbox, Input} from 'antd';

class Component extends React.PureComponent {

    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ux.xtReady(this, () => {
            const {$source = []} = this.props;
            const attrs = Ux.valueLimit(this.props);
            return (
                <Input.Group {...attrs}>
                    <Checkbox.Group options={$source}
                                    onChange={Op.rxChange(this)}/>
                </Input.Group>
            );
        }, {name: "CheckJson", logger: true});
    }
}

export default Component