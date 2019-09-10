import React from 'react';
import {Input} from 'antd';

const aiHidden = (reference, jsx = {}) => {
    jsx.type = "hidden";
    return (<Input {...jsx}/>)
};

export default {
    aiHidden,
}