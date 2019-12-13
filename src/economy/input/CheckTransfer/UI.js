import React from 'react';
import Ux from 'ux';
import Op from './Op';
import {Input, Transfer} from 'antd';
import './Cab.less';

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
            /*
             * modified by Hongwei
             * get value from reference.props
             * line 38: set targetKeys using variable: value
             */
            const {$source = [], value = [], ...rest} = this.props;
            /*
             * targetKeys
             * selectedKeys
             */
            const {$sourceKeys = []} = this.state;
            return (
                <Input.Group {...rest} className={"web-transfer"}>
                    <Transfer {...$transfer} dataSource={$source}
                              selectedKeys={$sourceKeys}
                              targetKeys={value}/>
                </Input.Group>
            )
        });
    }
}

export default Component;
