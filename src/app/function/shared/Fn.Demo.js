import {Alert, Button} from "antd";
import Op from "../App.Op";
import React from "react";
import Ux from 'ux';

const demoButtons = (reference, buttons = []) => {
    return (
        <span style={{
            border: "dashed 1px #ddd",
            display: "inline-block",
            height: 48,
            width: "100%",
            padding: 6,
            borderRadius: 10,
            marginTop: 100
        }}>
            {buttons.map(button => (
                <Button id={button.key} key={button.key} type={"dashed"} ghost
                        onClick={Op.demoClick(reference, button.message)}
                >{button.text}</Button>
            ))}
        </span>
    )
};
const demoMessage = (reference) => {
    const {message} = reference.state ? reference.state : {};
    return message ? (
        <Alert message={message} type={"success"}/>
    ) : false
};

const demoJson = (reference, level = 0, demoData = {}) => {
    const ref = Ux.onReference(reference, level);
    if (ref) {
        demoData = Ux.clone(demoData);
        ref.setState({demoData})
    }
};

export default {
    demoButtons,
    demoMessage,
    demoJson,
}