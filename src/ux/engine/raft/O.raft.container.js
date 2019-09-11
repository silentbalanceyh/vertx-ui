import {Container} from 'web';
import React from 'react';
import Datum from '../datum';
import Ut from '../../unity';

const raftContainer = (cell = {}, config = {}) => {
    const {
        addOn = {}
    } = config;
    const {reference} = addOn;     // 抽取引用信息
    const Component = Container[cell.name];
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
        return (values = {}) => {
            const attrs = Ut.toLimit(cell, [
                "name", "complex", "span",
                "optionJsx", "optionItem", "optionConfig"
            ]);
            return (
                <Component {...Datum.onUniform(reference.props)}
                           config={attrs} $inited={values}
                           reference={reference}/>
            )
        }
    }
};

export default {
    raftContainer,
}