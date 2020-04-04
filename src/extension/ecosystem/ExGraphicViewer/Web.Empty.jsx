import Ux from 'ux';
import {LoadingAlert} from 'web';
import React from 'react';

export default (reference) => {
    const empty = Ux.fromHoc(reference, "empty");
    return (
        <LoadingAlert $alert={empty}/>
    )
}