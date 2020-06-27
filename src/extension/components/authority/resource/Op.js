import Ex from 'ex';
import React from "react";
import UIResource from './UI.Resource';
import Ux from "ux";
import {Dsl} from 'entity';
import opRes from './Op.Resource';

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
    yiPage,
    renderJsx: () => ({
        tabResource: (reference) => {
            const {$tree = [], $treeData = []} = reference.state;
            return <UIResource {...Ex.yoAmbient(reference)}
                               $treeData={$treeData}
                               $tree={$tree}/>
        },
        tabPermission: () => {
            return (
                <div>Permission</div>
            )
        }
    })
}