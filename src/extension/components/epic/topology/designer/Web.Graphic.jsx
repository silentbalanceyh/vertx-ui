import Ex from "ex";
import Ux from 'ux';
import React from "react";
import {ExGraphicPlotter} from "ei";
import Op from './op';

export default (reference) => {
    const inherit = Ex.yoAmbient(reference);
    const {
        $data = {},
        $auto = false, $autoLink = [],
        $current
    } = reference.state;
    const config = Ux.fromHoc(reference, "graphic");
    inherit.$auto = $auto;
    inherit.$graphic = config;
    if ($auto) {
        inherit.$autoLink = $autoLink;
    }
    if ($current) {
        inherit.$current = $current;
    }
    return (
        <ExGraphicPlotter {...inherit} data={$data} $action={Op.onSubmit(reference)}/>
    );
}