import Ux from 'ux';
import React from 'react';
import {Card, Spin} from 'antd';

export default (reference, fnChild, fnExtra, fnTitle) => {
    const {$loading = false} = reference.state;
    let card = Ux.fromHoc(reference, "card");
    card = card ? card : {}
    const cardAttrs = {};
    if (Ux.isFunction(fnTitle)) {
        cardAttrs.title = (
            <span className={"ops-title"}>{fnTitle(card.text)}</span>
        )
    } else {
        if (card.text) {
            cardAttrs.title = card.text;
        }
    }
    if (fnExtra) {
        cardAttrs.extra = Ux.isFunction(fnExtra) ? fnExtra() : false;
    }
    return (
        <Spin spinning={$loading}>
            <Card className={card.className ? card.className : "ops-card-form"}
                  {...cardAttrs}>
                {Ux.isFunction(fnChild) ? fnChild() : "未设置子组件函数"}
            </Card>
        </Spin>
    )
}