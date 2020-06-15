
import Ex from 'ex';
import React from 'react';
import pageMain from './Web.Main';
import PageDesigner from './Web.Design';

export default {
    /* (reference) => () => {} */
    pageMain,
    /* 这里要使用二级函数 */
    pageDesigner: (reference) => () => {
        const { $inited = {}} = reference.state;
        return (
            <PageDesigner {...Ex.yoAmbient(reference)}
                          $inited={$inited}/>
        )
    },
}