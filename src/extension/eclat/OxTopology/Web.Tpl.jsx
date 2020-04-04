import renderGraphic from './Web.Graphic';
import React from 'react';
import {LoadingAlert} from 'web';
import Ux from 'ux';

export default (reference) => {
    const {$tpl} = reference.state;
    if ($tpl) {
        const {$tplKey} = reference.state;
        if ("ALL" !== $tplKey) {
            return renderGraphic(reference);
        } else {
            const alert = Ux.fromHoc(reference, "alert");
            return (
                <LoadingAlert $alert={alert}/>
            )
        }
    } else {
        return renderGraphic(reference);
    }
}