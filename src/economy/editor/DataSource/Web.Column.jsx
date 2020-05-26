import Ux from 'ux';
import React from "react";

export default (reference) => {
    const button = Ux.fromHoc(reference, "button");
    return {
        dataIndex: "key",
        render: (text, record, index) => {
            return (
                <span>Hello</span>
            )
        }
    }
}