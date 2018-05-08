import React from 'react';
import {Icon} from 'antd'

/**
 * 针对图标进行处理，类型包含icon和image两种
 * * 如果type以`img:`开头，则使用`<img/>`标签
 * * 其他情况则使用Ant Design中的`<Icon/>`处理
 * @method uiIcon
 * @param {String} type 传入的字符串值
 * @return {*}
 */
const uiIcon = (type = "") => {
    if (0 <= type.indexOf("img:")) {
        return (<img src={`/img${type.substring(4)}`} alt="icons"
                     style={{width: 24, height: 24}}/>)
    } else {
        return <Icon type={type} size={"large"}/>
    }
};
/**
 * @class Icon
 * @description 图标处理
 */
export default {
    uiIcon
}
