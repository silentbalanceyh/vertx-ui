import yoRender from '../yo.render';
import React from "react";
import {LoadingAlert, PageCard} from 'web';
import U from 'underscore';
/*
 * config 配置
 * {
 *      title: 坐上标题（同一个页面切换刷参数时必须）
 *      header：提示信息，用于加载 LoadingAlert 的表单说明信息（头）
 *      name: 当前组件的名称
 *      color：当前日志的背景色（白色字体）
 * }
 */
export default (reference, fnRender, config = {}) => {
    const {title, header, ...LOG} = config;
    return yoRender(reference, () => {
        const attrs = {};
        if (title) {
            /*
             * 特殊配置，左边页面上的标题
             */
            attrs.$title = title;
        }
        return (
            <PageCard reference={reference} {...attrs}>
                {
                    /* 警告提示信息
                     * 如果包含了 prompt 配置则直接渲染
                     */
                }
                {header ? (
                    <LoadingAlert {...header}/>
                ) : false}
                {U.isFunction(fnRender) ? fnRender() : false}
            </PageCard>
        )
    }, LOG)
}