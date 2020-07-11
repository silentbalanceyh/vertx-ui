import React from 'react';
import {Button} from 'antd';

const closeFooter = (reference, item, config = {}) => {
    return (
        <Button type={"primary"} onClick={config.onCancel}>
            {config.okText}
        </Button>
    )
}

export default {
    question: closeFooter,
    preview: closeFooter
}