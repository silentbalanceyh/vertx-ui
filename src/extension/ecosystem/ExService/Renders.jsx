import IxDatabase from "../IxDatabase/UI";
import IxIntegration from '../IxIntegration/UI';
import IxService from '../IxService/UI';
import IxChannel from '../IxChannel/UI';
import IxDict from '../IxDict/UI';
import IxMapping from '../IxMapping/UI';
import IxRule from '../IxRule/UI';
import React from "react";

export default {
    configDatabase: (reference, jsx) => {
        return (<IxDatabase reference={reference} {...jsx}/>)
    },
    configIntegration: (reference, jsx) => {
        return (<IxIntegration reference={reference} {...jsx}/>)
    },
    serviceConfig: (reference, jsx) => {
        return (<IxService reference={reference} {...jsx}/>)
    },
    channelConfig: (reference, jsx) => {
        return (<IxChannel reference={reference} {...jsx}/>)
    },
    dictConfig: (reference, jsx) => {
        return (<IxDict reference={reference} {...jsx}/>)
    },
    mappingConfig: (reference, jsx) => {
        return (<IxMapping reference={reference} {...jsx}/>)
    },
    ruleUnique: (reference, jsx) => {
        const {$inited = {}} = reference.props;
        return (<IxRule reference={reference} {...jsx}
                        $source={$inited.identifier}/>)
    }
}