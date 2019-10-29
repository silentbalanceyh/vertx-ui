import {ExComplexList} from "ei";
import {PageCard} from "web";
import React from "react";
import Ex from 'ex';

export default (reference, {
    config,
    form = {}
}) => (
    <PageCard reference={reference}>
        <ExComplexList {...Ex.yoAmbient(reference)}
                       config={config} $form={form}/>
    </PageCard>
)