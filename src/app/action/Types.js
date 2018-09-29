import Ux from "ux";

export default {
    fnDeptList: Ux.createAction("/RX/MODULE/DEPT/SEARCH"),
    // Tree列表
    fnCategoryList: Ux.createAction("/RX/MODULE/CAT/LIST"),
    fnCategory: Ux.createAction("/RX/MODULE/CAT/TREE"),
    // Rank列表（处理TreeTable专用）
    fnTreeData: Ux.createAction("/RX/MODULE/TREE/DATA")
}
