import React from 'react';
import {Button} from 'antd';
import Ux from "ux";

const onAdd = (reference) => (event) => {
    event.preventDefault();
    let {$data = []} = reference.state;
    $data.push({key: Ux.randomUUID()});
    $data = Ux.clone($data);
    reference.setState({$data});
};
const onRemove = (reference, key) => (event) => {
    event.preventDefault();
    let {$data = []} = reference.state;
    $data = $data.filter(item => key !== item.key);
    $data = Ux.clone($data);
    reference.setState({$data});
};
export default (reference, config = {}) => (text, record, index) => {
    return (
        <Button.Group>
            <Button icon={"plus"} onClick={onAdd(reference)}/>
            <Button icon={"minus"} disabled={0 === index}
                    onClick={onRemove(reference, text)}/>
        </Button.Group>
    )
};