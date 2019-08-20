import React from 'react';
import {PageCard} from 'web';
import Ex from "ex";
import {ExComplexList} from "ei";

export default (reference, {
    config,
    $query = {},
    form = {}
}) => (
    <PageCard reference={reference}>
        <ExComplexList {...Ex.yoAmbient(reference)}
                       config={config}
                       $form={form} $query={$query}/>
    </PageCard>
)