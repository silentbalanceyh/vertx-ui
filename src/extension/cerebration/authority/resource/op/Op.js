import Ex from 'ex';
import Ux from "ux";
import {Dsl} from 'entity';

import opRes from './Op.Resource';
import opPerm from './Op.Permission';
import opFree from './Op.Free';

const yiPage = (reference) => Ex.yiStandard(reference).then(state => Ex.authTreeRes(state)
    .then(state => {
        /* resource.type */
        state.$a_resource_type = Dsl.getArray(Ux.clone(state.$tree.map(item => item.data)));
        /* resource.models */
        const models = Ux.clone(state.$treeData);
        state.$a_resource_models = Dsl.getArray(models);
        return Ux.promise(state);
    })
    .then(Ux.ready)
    .then(Ux.pipe(reference))
)
export default {
    /*
     * yiResPage
     * yoResList
     * yoResCriteria
     */
    ...opRes,
    /*
     * yiPermPage
     * yuPermPage
     * yoPermCriteria
     *
     * rxClosePerm
     */
    ...opPerm,
    /*
     * yoFreeList
     */
    ...opFree,
    yiPage,
}