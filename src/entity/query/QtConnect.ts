import QTreeBranch from "./QTreeBranch";
import QTreeNode from "./QTreeNode";
import QTreeLeaf from "./QTreeLeaf";

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
const combineBranch = (content: any = {}, node: QTreeBranch, keyIfMore: any) => {
    const nodeContent = node.to();
    if (1 < node.getNodes().length &&
        /*
         * 防止 nodeContent = {} 而生成
         * $x = {} 的查询条件：500 Error
         */
        0 < Object.keys(nodeContent).length) {
        /*
         * 长度大于1，即子树不升级，那么启用 keyIfMore
         */
        content[keyIfMore] = nodeContent;
    } else {
        /*
         * 长度 == 1，直接合并
         */
        Object.assign(content, nodeContent);
    }
};
const combine = (nodes: Array<QTreeNode>, _isAnd: Boolean) => {
    const content: any = {};
    const validNodes = nodes.filter(node => node.valid());
    /*
     * 递归合并处理
     * 1）只有 validNodes 的长度 > 0 时会执行
     */
    if (0 < validNodes.length) {
        /*
         * 长度为1的处理
         */
        if (1 === validNodes.length) {
            const node: QTreeNode = validNodes[0];
            if (node instanceof QTreeLeaf) {
                /*
                 * 如果是叶节点，直接合并
                 */
                Object.assign(content, node.to())
            } else {
                combineBranch(content, node as QTreeBranch, "$0");
            }
        } else {
            content[""] = _isAnd;       // 这种情况才处理操作符
            validNodes.forEach((node, index) => {
                if (node instanceof QTreeLeaf) {
                    const merged = node.to();
                    Object.assign(content, merged);
                } else {
                    const key = `$${index}`;
                    combineBranch(content, node as QTreeBranch, key);
                }
            });
            /*
             * 计算完成后检查
             * 1）所有子节点为 __DELETE__ 被删除
             * 2）仅保留了操作符号位
             * 防止单节点出现：
             * {
             *     "": true
             * }
             * 或
             * {
             *     "": false
             * }
             * 500 Error
             */
            if (1 === Object.keys(content).length && content.hasOwnProperty("")) {
                delete content[""];
            }
        }
    }
    return content;
};
export default {
    join,
    combine,
}