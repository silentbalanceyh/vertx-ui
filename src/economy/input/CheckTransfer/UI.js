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
            /*
             * modified by huarui
             * as the targetKeys receive 'key' field as default,
             * when using other field as below has to explicitly specify value's field
             * as rowKey instead.
             */
            const {$source = [], value = [], config, ...rest} = this.props;
            const {valueKey = "key"} = config;
            /*
             * targetKeys
             * selectedKeys
             */
            const {$sourceKeys = []} = this.state;
            return (
                <Input.Group {...rest} className={"web-transfer"}>
                    <Transfer {...$transfer} dataSource={$source}
                              rowKey={$source => $source[valueKey]}
                              selectedKeys={$sourceKeys}
                              targetKeys={value}/>
                </Input.Group>
            )
        });
    }
}

export default Component;
