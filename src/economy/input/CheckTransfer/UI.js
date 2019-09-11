import React from 'react';
import Ux from 'ux';
import Op from './Op';
import {Input, Transfer} from 'antd';

class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = Ux.xtInitArray(props, true);
    }

    componentDidMount() {
        Op.yiPage(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yuPage(this, {prevProps, prevState});
    }

    render() {
        return Ux.xtReady(this, () => {
            const {$transfer = {}} = this.state;
            const {$source = [], ...rest} = this.props;
            /*
             * targetKeys
             * selectedKeys
             */
            const {$sourceKeys = [], $targetKeys = []} = this.state;
            return (
                <Input.Group {...rest}>
                    <Transfer {...$transfer} dataSource={$source}
                              selectedKeys={$sourceKeys}
                              targetKeys={$targetKeys}/>
                </Input.Group>
            )
        });
    }
}

export default Component;