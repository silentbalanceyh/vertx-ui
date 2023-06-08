import QTree from "./QTree";
import __Zn from '../zero.module.dependency';

/*
 * 查询树专用辅助类（和后端的查询引擎对接）
 * {
 *      "criteria",
 *      "pager",
 *      "sorter",
 *      "projection",
 * }
 * 只处理 Criteria
 */
class QForest {
    private readonly seed: QTree;
    private query: QTree;

    /*
     * Seed为基础条件，即：
     * 1）任何情况下，Seed和新加入的条件的关系必须是：AND 关系
     * 2）Seed为空的时候，后续的条件可自由组合
     */
    constructor(seed: any = {}) {
        this.seed = new QTree(__Zn.clone(seed));
    }

    /*
     * 浅层合并（不执行 QLeaf 搜索）
     */
    init(filters: any): QForest {
        if (!__Zn.isEmpty(filters)) {
            this.query = new QTree(filters);
        }
        return this;
    }

    and(condition: any): QForest {
        if (!__Zn.isEmpty(condition)) {
            if (this.query) {
                const tree = new QTree(condition);
                this.query.join(tree, true);
            } else {
                this.query = new QTree(condition);
            }
        }
        return this;
    }

    to() {
        const validSeed = this.seed.valid();
        const validQuery = this.query ? this.query.valid() : false;
        if (validSeed && validQuery) {
            /*
             * seed AND query
             * 1）seed 是基础条件
             * 2）query 是被合并的条件
             */
            return this.seed.join(this.query).to();
        } else if (validSeed && !validQuery) {
            return this.seed.to();
        } else if (!validSeed && validQuery) {
            return this.query.to();
        } else {
            return {};
        }
    }
}

export default QForest;