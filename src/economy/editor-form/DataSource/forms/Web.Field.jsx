import React from "react";
import Ux from 'ux';
import RestfulApi from '../../RestfulApi/UI';
import ParamInput from '../../ParamInput/UI';

export default {
    source: (reference, jsx) => {
        const {rxSource} = reference.props;
        return (
            <RestfulApi rxSource={rxSource} rxSubmit={(value) => {
                if (value) {
                    const formValues = {};
                    formValues.uri = value.uri;
                    formValues.method = value.method;
                    if (value.name) {
                        formValues.comment = value.name;
                    }
                    Ux.formHits(reference, formValues);
                }
            }}/>
        )
    },
    magic: (reference, jsx) => {
        return (<ParamInput reference={reference} {...jsx}/>)
    }
}