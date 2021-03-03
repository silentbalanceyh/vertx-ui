import yiPage from './O.fn.page';
import yuPage from './O.fn.page.update';

import graphic from './O.graphic';
import tpl from './O.tpl';
import Ux from "ux";
import Ex from "ex";

export default {
    ...tpl,
    yiPage,
    yuPage,
    rxCommand: (reference) => {
        const gxFun = {};

        gxFun.onNodeInitBefore = Ux.g6Image();
        gxFun.onEdgeInitBefore = Ex.X6.rxEdgeInitType(reference);
        gxFun.onNodeClickDouble = graphic.onNodeDoubleClick(reference);
        gxFun.onTpl = graphic.onTpl(reference);                     // 选择模板专用
        gxFun.rxGraphInit = graphic.onGraphInit(reference);         //
        return gxFun;
    }
}