import {ExListComplex} from "ei";
import {PageCard} from "web";
import React from "react";
import Ex from 'ex';
import Op from "./form/Op";

export default (reference, {
    config,
    form = {}
}) => (
    <PageCard reference={reference}>
        <ExListComplex {...Ex.yoAmbient(reference)}
                       rxPostDelete={Op.rxPostDelete(reference)}
                       rxAssist={Op.rxAssist(reference)}
                       config={config} $form={form}/>
    </PageCard>
)