import {OpsModelStep} from "app";
import React from "react";
import Ux from 'ux';
import {Button} from 'antd';

export default {
    page: (reference) => {
        const {$step} = reference.state;
        const comments = Ux.fromHoc(reference, "comments")
        return (
            <div>
                <OpsModelStep $step={$step}/>
                <ul className={"ops-model-step1"}>
                    {comments.map(item => (<li key={Ux.randomUUID()}>{item}</li>))}
                </ul>
            </div>
        )
    },
    op: (reference) => {
        const button = Ux.fromHoc(reference, "op");
        return (
            <div className={"ops-model-op"}>
                <Button type={"primary"} onClick={event => {
                    Ux.prevent(event);
                    reference.setState({$step: 1});
                }}>{button.next}</Button>
                <Button onClick={event => {
                    Ux.prevent(event);
                    const selected = Ux.toQuery("selected");
                    let target = Ux.toQuery("target");
                    target = target ? target : `/asset/model-map`
                    Ux.toRoute(reference, `${target}?selected=${selected}`)
                }}>{button.back}</Button>
            </div>
        );
    }
}