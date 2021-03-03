import React from "react";
import Ux from "ux";
import {Button} from "antd";

export default (reference) => {
    const button = Ux.fromHoc(reference, "op")
    return (
        <div className={"ops-model-op"}>
            <Button onClick={event => {
                Ux.prevent(event);
                const ref = Ux.onReference(reference, 1);
                ref.setState({$step: 3, $stepSub: 0})
            }}>{button.prev}</Button>
            <Button type={"primary"} onClick={event => {
                Ux.prevent(event);
                Ux.toRoute(reference, "/asset/model-map?selected=DataAsset");
            }}>{button.done}</Button>
        </div>
    )
}