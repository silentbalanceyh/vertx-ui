import Ex from 'ex';
import React from "react";
import Ux from "ux";
import {Dsl} from 'entity';

import opRes from './Op.Resource';
import opPerm from './Op.Permission';

import UIResource from './UI.Resource';
import UIPermission from './UI.Permission';

const yiPage = (reference) => {
    const state = {};
    /* resource.tree 的内容读取 */
    Ex.authTreeRes(state)
        .then(state => {
            /* resource.type */
            state.$a_resource_type =
                Dsl.getArray(Ux.clone(state.$tree.map(item => item.data)));
            /* resource.models */
            const models = Ux.clone(state.$treeData);
            state.$a_resource_models = Dsl.getArray(models);
            return Ux.promise(state);
        })
        .then(Ux.ready)
        .then(Ux.pipe(reference));
}
export default {
    ...opRes,
    ...opPerm,
    yiPage,
    renderJsx: () => ({
        tabResource: (reference) => {
            const {$tree = [], $treeData = []} = reference.state;
            return <UIResource {...Ex.yoAmbient(reference)}
                               $treeData={$treeData}
                               $tree={$tree}/>
        },
        tabPermission: (reference) => {
            const {$treeData = []} = reference.state;
            return <UIPermission {...Ex.yoAmbient(reference)}
                                 $category={$treeData}/>
        }
    })
}