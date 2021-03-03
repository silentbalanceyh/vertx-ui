import on from './O.on';
import yo from './O.yo';
import graphic from './O.graphic';
import Ex from "ex";
import Ux from 'ux';

export default {
    ...on,
    ...yo,
    ...graphic,

    rxCommand: (reference) => {
        const {$selected} = reference.state;
        const gxFun = {};
        /**
         * 验证关系专用处理
         */
        gxFun.onNodeInitBefore = Ux.g6Image();
        gxFun.onEdgeInitBefore = Ex.X6.rxEdgeInitType(reference);
        gxFun.onEdgeConnectedBefore = graphic.onEdgeConnectedBefore(reference, $selected.data);
        gxFun.onSubmit = graphic.onSubmit(reference, $selected.data);
        gxFun.rxGraphInit = graphic.onGraphInit(reference, $selected.data);
        gxFun.rxEdgeInit = Ex.X6.rxEdgeInit;

        return gxFun;
    }
}