import React from "react";
import RestfulApi from '../RestfulApi/UI';
import ParamInput from '../ParamInput/UI';

export default {
    source: (reference, jsx) => {
        const {rxSource} = reference.props;
        return (
            <RestfulApi rxSource={rxSource}
                        reference={reference}
                        {...jsx} />
        )
    },
    magic: (reference, jsx) => {
        return (<ParamInput reference={reference} {...jsx}/>)
    }
}