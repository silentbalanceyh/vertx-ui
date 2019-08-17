import {Button} from "antd";
import React from "react";

export default (reference, {
    left,
    right
}) => (
    <Button.Group>
        <Button {...left}/>
        <Button {...right}/>
    </Button.Group>
)