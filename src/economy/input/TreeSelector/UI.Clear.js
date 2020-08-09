import {Icon} from "antd";
import React from "react";
import Ux from 'ux';

export default (reference) => {
    return (
        <Icon type={"delete"} style={{
            fontSize: 14
        }} onClick={event => {
            Ux.prevent(event);
            const {config = {}, value} = reference.props;
            // 有值才清空
            if (value) {
                const values = Ux.writeLinker({}, config);
                // 表单专用处理
                const ref = Ux.onReference(reference, 1);
                const {form} = ref.props;
                if (form) {
                    Ux.formHits(ref, values);
                }
            }
        }}/>
    )
}