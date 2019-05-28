import React from 'react';
import {Button} from 'antd';
import Ux from "ux";
import Fx from '../Fx';

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
    const {fieldColumn = {}} = config;
    let options = Ux.RxAnt.toOptions(reference, fieldColumn);
    options = Fx.mapOptions(reference, options);
    const limit = options.length;
    return (
        <Button.Group>
            <Button icon={"plus"} disabled={index === (limit - 1)}
                    onClick={onAdd(reference)}/>
            <Button icon={"minus"} disabled={0 === index}
                    onClick={onRemove(reference, text)}/>
        </Button.Group>
    );
};