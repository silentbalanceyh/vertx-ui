import React from 'react';
import { Icon } from 'antd'

const uiIcon = (type = "") => {
    if (0 <= type.indexOf("img:")) {
        return (<img src={ `/img${type.substring(4)}` } alt="icons"
                     style={ {width : 24, height : 24} }/>)
    } else {
        return <Icon type={ type }/>
    }
};
export default {
    uiIcon
}
