import React from 'react';

const fxError = (message) => (<div className={"error-page"}>{message}</div>);

const fxRender = (reference, render) => {
    const {error} = reference.state ? reference.state : {};
    if (error) {
        return fxError(error);
    } else {
        if (reference.state) {
            return render()
        } else {
            return false;
        }
    }
};
export default {
    fxError,
    fxRender
}