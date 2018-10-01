import JsxOp from "../../jsx/Ux.Jsx.Op";

const aiAction = (reference, jsx = {}) => {
    if (jsx.buttons) {
        // submit + reset双按钮专用生成
        // E.fxInfo(true, 10076, "optionJsx.buttons");
        return JsxOp.rtNorm(reference, jsx);
    } else if (jsx.hasOwnProperty("bind")) {
        // 多个按钮
        // E.fxInfo(true, 10076, "optionJsx.bind");
        return JsxOp.rtDialog(reference, jsx);
    } else if (jsx.hasOwnProperty("direct")) {
        // 直接按钮处理专用
        return JsxOp.rtDirect(reference, jsx);
    } else {
        // 专用Bind按钮处理
        // E.fxInfo(true, 10076, "DEFAULT");
        return JsxOp.rtBind(reference, !jsx.hidden)
    }
};

export default {
    aiAction,
}