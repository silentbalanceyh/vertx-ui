import {Button, DatePicker, Input, Modal, Popconfirm} from "antd";
import React from "react";
import __Zn from './zero.module.dependency';
import __Ct from './equip.fn.config.container';
import __Br from './behavior.fn.rx.workflow';

const {RangePicker} = DatePicker;
const Cv = __Zn.Env;

const uiTitle = (reference, fnJsx, configKey = "page") => {
    const grid = __Zn.fromHoc(reference, configKey);
    if (grid) {
        return (
            <span>{grid.title}&nbsp;&nbsp;&nbsp;&nbsp;
                {__Zn.isFunction(fnJsx) ? fnJsx() : false}
            </span>
        )
    } else return false;
}
const uiButton = (actions, executor = {}, reference) => {
    let $actions = [];
    if (__Zn.isArray(actions)) {
        $actions = __Zn.clone(actions);
    } else {
        $actions = [actions];
    }
    return $actions.map(action => {
        const {
            text,
            selected = false,           // 是否支持 $selected 禁用启用
            confirm,                    // 是否带有 confirm 设置
            success,                    // 是否有成功响应
            ...rest
        } = action;
        const attrs = __Zn.clone(rest);
        // selected = true
        if (selected) {
            const {$selected = []} = reference.state;
            attrs.disabled = 0 === $selected.length;
        }
        // parameters = {};
        const parameters = {pMessage: {}};
        if (success) {
            parameters.pMessage.success = success;
            parameters.pMessageKey = "success";
        }
        const onClick = (event) => {
            __Zn.prevent(event);
            const runnerFn = executor[rest.key];
            if (__Zn.isFunction(runnerFn)) {
                runnerFn(parameters);
            }
        };
        if (confirm) {
            const $confirm = __Zn.clone(confirm);
            if (attrs.disabled) {
                if (attrs.className) delete attrs.className;
            } else {
                // 没有禁用
                $confirm.onConfirm = onClick;
            }
            return (
                <Popconfirm {...$confirm} key={attrs.key}>
                    <Button {...attrs}>
                        {text}
                    </Button>
                </Popconfirm>
            )
        } else {
            if (__Zn.isFunction(onClick)) {
                attrs.onClick = onClick;
            }
            // 是不是禁用
            return (
                <Button {...attrs}>
                    {text}
                </Button>
            )
        }
    })
}
const uiModal = (config = {}, fnChild, reference) => {
    const modal = __Ct.configDialog(reference, config);
    const dialog = __Zn.clone(modal);
    const {$visible = false} = reference.state;
    // v4
    dialog.open = $visible;
    // children 专用
    const attrs = {};
    /*
     * 表单专用属性
     * - rxClose：关闭窗口
     */
    // reference.?etState({$submitting})
    // 表单关闭方法（带刷新）
    attrs.rxClose = __Br.rxCloseFn(reference, {
        pRefresh: true      // 关闭窗口时刷新界面
    })
    // 初始值
    const {$inited} = reference.state;
    attrs.$inited = $inited;
    // {__Zn.isFunction(fnChild) ? React.cloneElement(fnChild(), attrs) : false}
    return (
        <Modal {...dialog}>
            {__Zn.isFunction(fnChild) ? fnChild(attrs) : false}
        </Modal>
    );
}
const rxQrRunner = (reference, condition, rxQuery) => {
    // 默认函数直接合并
    const rxQueryFn = __Zn.isFunction(rxQuery) ? rxQuery : (iCond) => {
        const {$queryDefault = {}} = reference.state;
        const combined = __Zn.qrCombine($queryDefault, reference, iCond);
        return __Zn.promise(combined);
    };
    __Zn.asyncWrap(reference, {}, () => rxQueryFn(condition)).then($query => {
        const updated = {};
        updated.$query = $query;
        updated.$qrItem = condition;
        updated.$refresh = __Zn.randomString(12);
        __Zn.of(reference).in(updated).done();
        // reference.?etState(updated);
    })
}
const uiQrSearch = (search = {}, reference, rxQuery) => {
    const {title, ...inputAttr} = search;
    if (title) {
        return (
            <span className={"ux_qr_search"}>
                <span className={"prefix"}>{title}：</span>
                {uiQrSearch(inputAttr, reference)}
            </span>
        )
    } else {
        const {field = [], ...rest} = search;
        return (
            <Input.Search {...rest} allowClear onSearch={keyword => {
                __Zn.dgDebug(rest, "「Qr」搜索专用构造属性！", "#8B1C62");
                const {$qrItem = {}} = reference.state;
                const condition = __Zn.clone($qrItem);
                field.forEach(each => condition[`${each},c`] = keyword ? keyword : Cv.CV_DELETE);
                // 默认函数直接合并
                rxQrRunner(reference, condition, rxQuery);
            }}/>
        )
    }
}
const uiQrRange = (range = {}, reference, rxQuery) => {
    const {title, ...inputAttr} = range;
    if (title) {
        return (
            <span className={"ux_qr_range"}>
                <span className={"prefix"}>{title}：</span>
                {uiQrRange(inputAttr, reference)}
            </span>
        )
    } else {
        const {field, ...rest} = range;
        return (
            <RangePicker {...rest} showTime allowClear onOk={(event = []) => {
                __Zn.dgDebug(rest, "「Qr」范围专用构造属性！", "#8B1C62");
                const {$qrItem = {}} = reference.state;
                const condition = __Zn.clone($qrItem);
                const [fromAt, endAt] = event;
                condition[`${field},>`] = fromAt ? fromAt.toISOString() : Cv.CV_DELETE;
                condition[`${field},<`] = endAt ? endAt.toISOString() : Cv.CV_DELETE;
                condition[``] = true;   // AND Part
                // 默认函数直接合并
                rxQrRunner(reference, condition, rxQuery);
            }} onChange={(event = []) => {
                const [fromAt, endAt] = event;
                if (!fromAt && !endAt) {
                    // 清空
                    const {$qrItem = {}} = reference.state;
                    const condition = __Zn.clone($qrItem);
                    condition[`${field},>`] = Cv.CV_DELETE;
                    condition[`${field},<`] = Cv.CV_DELETE;
                    condition[``] = true;   // AND Part
                    // 默认函数直接合并
                    rxQrRunner(reference, condition, rxQuery);
                }
            }}/>
        )
    }
}
/*
 * 快速开发专用
 * - ui：返回 jsx
 * - uiQr：搜索专用组件快速开发
 */
export default {
    // 「搜索」UI系列方法
    uiQrSearch, aiQrSearch: uiQrSearch,
    uiQrRange, aiQrRange: uiQrRange,

    // ui系列方法（快速处理）
    uiButton,
    uiModal,
    uiTitle,
}