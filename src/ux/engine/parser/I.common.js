// 导入外层

const fnPredicate = (type, expression, supplier) => {
    if (expression && "string" === typeof expression) {
        return supplier();
    } else {
        console.error(` [ Ux ] ${type} 解析出错！expression = `, expression);
    }
};
export default {
    fnPredicate,
}