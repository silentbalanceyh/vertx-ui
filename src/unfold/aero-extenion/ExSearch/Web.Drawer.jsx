import React from 'react';
import {Drawer} from 'antd';
import Ux from "ux";
import {LoadingAlert} from "web";

import "./Cab.norm.scss";
import __Zn from '../zero.aero.dependency';

const _renderNotice = (reference) => {
    const {$notice} = reference.state;
    return $notice ? (
        <LoadingAlert $alert={$notice} $type={"warning"}/>
    ) : false;
};

const __endSearchText = (reference, request, response) => {
    let searchText = "";
    {
        const {
            $fields = []
        } = reference.state;
        const {
            $qrVLock = []
        } = reference.props;
        const {$condition = {}} = response;
        $fields.filter(field => {
            if (0 === $qrVLock.length) {
                return true;
            } else {
                // #QR_LOCK
                return !$qrVLock.includes(field);
            }
        }).forEach(cond => {
            if (!searchText && $condition.hasOwnProperty(cond)) {
                searchText = $condition[cond][0];
            }
        })
    }
    return searchText;
}
export default (reference) => {
    const {
        $advanced,
        $visible = false
    } = reference.state;
    // v4
    $advanced.open = $visible;
    const {$form = {}} = reference.props;
    const {FormFilter} = $form;
    if (FormFilter) {
        const filterAttrs = __Zn.yoFilter(reference);
        // console.log(filterAttrs);
        filterAttrs.rxClose = (request = {}, response = {}) => {
            // 高级搜索命中搜索框部分回调执行
            const searchText = __endSearchText(reference, request, response);
            const state = {searchText};
            Ux.of(reference).in(state).hide().handle(() => {


                // 关于高级搜索顶层的 $condition 执行
                Ux.of(reference)._.submitted({
                    $loading: true,
                }).then(() => {
                    const ref = Ux.onReference(reference, 1);
                    Ux.dglQrAdvance(ref);
                });
            })
        }
        return (
            <Drawer {...$advanced} rootClassName={"uex_ExSearch_Drawer"}>
                {/* Drawer issue: https://github.com/ant-design/ant-design/issues/20175 */}
                {_renderNotice(reference)}
                <FormFilter {...filterAttrs}/>
            </Drawer>
        );
    } else {
        console.warn("FormFilter未配置，请检查");
        return false;
    }
}