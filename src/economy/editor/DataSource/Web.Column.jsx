import React from "react";
import {Button} from 'antd';
import Op from './op';

export default (reference) => {
    return {
        dataIndex: "key",
        className: "op-cell",
        render: (text, record, index) => {
            return (
                <Button.Group>
                    <Button icon={"edit"} size={"small"}
                            onClick={Op.onEdit(reference, record)}/>
                    {(() => {
                        if ("tabular" === text || "category" === text) {
                            return false;
                        } else {
                            return (
                                <Button icon={"delete"} type={"danger"} size={"small"}
                                        onClick={Op.onRemove(reference, record)}/>
                            )
                        }
                    })()}
                </Button.Group>
            )
        }
    }
}