import Op from './QView.Op';
import React from 'react';
import {Button, Modal} from 'antd';
import Ux from "ux";
import "./Cab.norm.scss";
import __Zn from '../zero.aero.dependency';

import QxCriteria from "../QxCriteria/UI";

export default (reference) => {
    const {
        config = {},
        $query,
        $qr = {},
    } = reference.props;
    const {$dialog = {}, $visibleQ = false, $submitting = false} = reference.state;
    // v4
    $dialog.open = $visibleQ;
    // 关闭时初始化数据
    $dialog.onCancel = () => Ux.of(reference).in({
        $visibleQ: false,
        // $qr?ata: {},
    }).done();
    $dialog.confirmLoading = $submitting;
    $dialog.cancelButtonProps = {
        loading: $submitting
    };

    // 查询提示相关信息，构造 QxCriteria 所需查询条件。
    /*
     * 新规范部分有些区别
     * 1.打开弹窗的持久性 props      ->              $qr
     * 2.暂时性的 state             ->              $qrView
     * 3.默认的锁定条件来源 props    ->              $query
     */

    const {$qrView = {}} = reference.state;
    // Fix: $qr / $qrView 专用处理
    /*
     * 此处数据流为：
     * $qr  ->  $qrView  ->  onChange
     *             ^             v
     *             ^             v
     *             <-------------v
     * 所以数据基础以 $qr 为准
     */
    const value = Ux.clone($qr);
    Object.assign(value, $qrView);


    const attrQxC = __Zn.yoAmbient(reference);
    const $config = {};
    $config.field = config.field;
    $config.query = $query;
    attrQxC.config = $config;
    attrQxC.onChange = Op.onViewPre(reference);
    attrQxC.value = value;

    return (
        <Modal {...$dialog}>
            {(() => {
                // 分离代码区域，走就近原则
                const view = config[__Zn.Opt.SEARCH_CRITERIA_VIEW];
                return Ux.aiViewMy(view, reference);
            })()}
            <div>
                <QxCriteria {...attrQxC}/>
            </div>
            <Button className={"ux_hidden"} id={$dialog.__onOk}
                    onClick={Op.opViewSave(reference)}/>
        </Modal>
    );
}