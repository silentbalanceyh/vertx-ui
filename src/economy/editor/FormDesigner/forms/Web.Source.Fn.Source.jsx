import React from "react";
import RestfulApi from '../../RestfulApi/UI';

export default (reference, jsx) => {
    const {$source} = reference.props;
    return (
        <RestfulApi $source={$source} rxSubmit={(value) => {
            console.info(value);
        }}/>
    )
}