import React from 'react';
import Ex from 'ex';
import Op from './Op';

export default (reference, item) => {
    const {$form = {}} = reference.props;
    const {$inited = {}} = reference.state;
    let Component = $form.FormDynamic ? $form.FormDynamic : false;
    if (Component) {
        const inherit = Ex.yoAmbient(reference);
        return (
            <Component {...inherit} $inited={$inited} rxClose={Op.rxClose(reference, item.key)}/>
        )
    } else return false;
}