import Expr from "./O.format";

const valueExpr = (field = "", data = {}, keep = false) => {
    let display = "";
    if (0 <= field.indexOf(":")) {
        display = Expr.formatExpr(field, data, keep);
    } else {
        display = data[field];
        if (!display) display = "";
    }
    return display;
};
export default {
    valueExpr,
}