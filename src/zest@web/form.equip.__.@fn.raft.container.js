import React from 'react';
import __Zn from './zero.module.dependency';
/*
 * 可以直接从下边配置属性中处理子表单渲染器
 * {
 *      __children:{
 *          permissions:() => {
 *          }
 *      }
 * }
 * 上述值赋值给 renders 执行 Form 渲染
 */
const __raftSimple = (reference, addOn = {}) => {
    const {$renders = {}} = reference.props;
    const renderSource = $renders;
    const combineRenders = {};
    if (renderSource && renderSource.__children) {
        Object.assign(combineRenders, renderSource.__children);
    }
    if (addOn.renders) {
        Object.assign(combineRenders, addOn.renders);
    }
    return combineRenders;
}
/*
 * 此处使用 `key` 的核心原因
 * 1. name 属性会被 Ant-Form 识别，而这个字段为容器字段，所以不能使用 cell.name 的方式去定位
 * 2. name 在此处用于识别容器类型，可重复。
 * 3. 取而代之使用 `key` 来执行相关转换提取配置
 */
const __raftComplex = (reference, cell = {}) => {
    const {$complex = {}} = reference.props;
    const complex = $complex[cell.key];
    return __Zn.isObject(complex) ? complex : {};
}

export default (CONTAINER) => (cell = {}, config = {}) => {
    const {
        addOn = {}
    } = config;
    const {reference} = addOn;                  // 抽取引用信息
    const Component = CONTAINER[cell.name];     // Unlock模式
    if (Component) {
        /*
         * 容器型（子表单）
         * 1）容器型的主要的不同在于不使用 getFieldDecorator
         * 2）容器型的 render 可支持多字段，一般为大组件
         * 如：TableEditor / DialogEditor 这种
         * 3）主要层级结构：
         * -  分页：根据容器类型不同进行分页，每页一个字段
         * -  每个字段一般是复杂的数据结构：Object / Array
         */
        const config = cell.config ? cell.config : {};
        return (values = {}) => {
            /*
             * 子组件调用父组件对应的 renders，生成 $renders 变量
             */
            const $renders = __raftSimple(reference, addOn);
            /*
             * 子组件执行 complex 时的额外配置
             */
            const inherit = __Zn.onUniform(reference.props);
            const complex = __raftComplex(reference, cell);
            /*
             * 表单专用引用传入
             */
            const {metadata = {}} = addOn;
            inherit.$metadata = metadata;
            return (
                <Component {...inherit}
                           {...complex}
                           config={config} $inited={values}
                           $renders={$renders}
                           reference={reference}/>
            )
        }
    }
};