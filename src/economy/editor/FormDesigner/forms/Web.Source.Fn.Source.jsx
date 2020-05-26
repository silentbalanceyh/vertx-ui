import React from "react";
import RestfulApi from '../../RestfulApi/UI';

export default (reference, jsx) => {
    const {rxSource} = reference.props;
    return (
        <RestfulApi rxSource={rxSource} rxSubmit={(value) => {
            console.info(value);
        }}/>
    )
}