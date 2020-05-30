import React from 'react';
import Ux from 'ux';
import Op from './Op';
import {Checkbox, Input} from 'antd';

class Component extends React.PureComponent {

    componentDidMount() {
        Op.yiPage(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Ux.xtRevert(this, {state: prevState, props: prevProps}, {});
    }

    render() {
        return Ux.xtReady(this, () => {
            const {$source = []} = this.props;
            const attrs = Ux.valueLimit(this.props);
            return (
                <Input.Group {...attrs}>
                    <Checkbox.Group options={$source}
                                    value={attrs.value ? Object.keys(attrs.value)
                                            .filter(item => attrs.value[item])
                                        : []}
                                    onChange={Op.rxChange(this)}/>
                </Input.Group>
            );
        }, {name: "CheckJson", logger: true});
    }
}

export default Component