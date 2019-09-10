import QTreeBranch from "./QTreeBranch";

const join = (left: QTreeBranch, right: QTreeBranch,
              isAnd: Boolean = false): QTreeBranch => {
    const branch = new QTreeBranch({"": isAnd});
    if (isAnd) {
        /*
         * left 和 right 使用 AND 连接符
         * ( a AND b ) AND ( c AND d )
         * ( a AND b ) AND ( c OR  d )
         * ( a OR  b ) AND ( c AND d )
         * ( a OR  b ) AND ( c OR  d )
         */
        if (left.isAnd()) {
            left.getNodes().forEach(node => branch.addNode(node));
        } else {
            branch.addNode(left);
        }
        if (right.isAnd()) {
            right.getNodes().forEach(node => branch.addNode(node));
        } else {
            branch.addNode(right);
        }
    } else {
        /*
         * left 和 right 使用 OR 连接符
         * ( a AND b ) OR ( c AND d )
         * ( a AND b ) OR ( c OR  d )
         * ( a OR  b ) OR ( c AND d )
         * ( a OR  b ) OR ( c OR  d )
         */
        if (left.isAnd()) {
            branch.addNode(left);
        } else {
            left.getNodes().forEach(node => branch.addNode(node));
        }
        if (right.isAnd()) {
            branch.addNode(right);
        } else {
            right.getNodes().forEach(node => branch.addNode(node));
        }
    }
    return branch;
};

export default {
    join,
}