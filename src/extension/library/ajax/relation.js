import Ux from "ux";

export default {

    /*
    * /api/relation
    * 读取所有的关系定义
    * */
    relation: () => Ux.ajaxGet("/api/relation", {}),

    relationSave: (relations = []) => Ux.ajaxPost("/api/ox/relation/save", {
        $body: relations,
    }),

    relationDelete: (keys = []) => Ux.ajaxPost("/api/ox/relation/remove", {
        $body: keys,
    }),
}