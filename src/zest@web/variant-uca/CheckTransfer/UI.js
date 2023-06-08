import React from 'react';
import Op from './Op';
import {Transfer} from 'antd';

import __Zn from '../zero.uca.dependency';
import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "CheckTransfer";
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    const state = {};
    const {config = {}} = reference.props;
    // state.$source = $source;
    /*
     * 抽取 jsx 数据（除开 onChange）
     */
    const {...rest} = config;
    const $transfer = __Zn.clone(rest);

    $transfer.onChange = Op.onChange(reference, config);
    $transfer.onSelectChange = Op.onChangeSelect(reference, config);
    /*
     * 处理可选择的 key
     */
    // $transfer.targetKeys = $source.map(item => item.key);
    $transfer.render = (item) => item.label;
    // $transfer.dataSource = $source;
    state.$transfer = $transfer;
    // state.$sourceKeys = $source.map(item => item.key);
    __Zn.of(reference).in(state).ready().done();
    // reference.?etState(state);
    // state.$ready = true;
}
const componentUp = (reference, {prevState, prevProps}) => {
    /*
     * 判断重置专用方法
     */
    __Zn.xtReset(reference, {props: prevProps, state: prevState}, ($targetKeys) => {
        /*
         * values 是初始值
         */
        __Zn.of(reference).in({
            $targetKeys
        }).done();
        // reference.?etState({$targetKeys});
    })
};

class Component extends React.PureComponent {
    displayName = UCA_NAME;

    constructor(props) {
        super(props);
        this.state = __Zn.xtInitArray(props, true);
    }

    componentDidMount() {
        componentInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        componentUp(this, {prevProps, prevState});
    }

    render() {
        return __Zn.xtReady(this, () => {
            const {$transfer = {}} = this.state;
            const {$source = [], value = [], config, ...rest} = this.props;
            const {valueKey = "key"} = config;
            /*
             * targetKeys
             * selectedKeys
             */
            const {$sourceKeys = []} = this.state;
            const attrInput = Sk.mixUca(UCA_NAME);
            const WebField = __Zn.V4InputGroup;
            return (
                <WebField {...rest} {...attrInput}>
                    <Transfer {...$transfer} dataSource={$source}
                              rowKey={$source => $source[valueKey]}
                              selectedKeys={$sourceKeys}
                              targetKeys={value || []}/>
                </WebField>
            )
        });
    }
}

export default Component;
