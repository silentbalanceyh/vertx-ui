import Ux from "ux";

export default (params) => {
    /*
     * 如果选择的是模型，则读取模型本身的物理表、属性名
     * 如果选择的是关联行为或属性，则读取关联行为或属性对应的物理表、属性名
     */
    return Ux.ajaxGet("/api/model/full/read/:id", params);
}