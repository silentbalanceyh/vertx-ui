import Qt from './Qt';
import QForest from './QForest';
import Ux from 'ux';

/*
 * 外层查询条件
 * {
 *     "criteria": QTree,
 *     "sorter":
 *     "pager":
 *     "projection":
 * }
 */
class QQuery {
    private reference = null;       // 需要绑定的 reference 部分的信息
    /*
     * 计算完成的query信息，计算完成的条件
     * 1）query中的每一个节点执行过初始化
     * 2）生成QTree的信息
     */
    private readonly query: any;
    private readonly forest: any;

    /*
     * 初始化对象
     * 格式说明：
     * 1）针对四个键值执行基本解析，存储到 normalized 中
     * 2）只执行基础格式解析，不处理 state / props 中的部分
     */
    constructor(query = {}, reference) {
        /*
         * 传入的是 query 参数
         * 1）主要是处理四个核心节点
         * - pager
         * - sorter
         * - projection
         * - criteria
         * 2）是否包含了 reference
         * 如果包含了 reference，则 criteria 是需要解析的
         * 可执行 parser 中的所有解析操作！
         */
        this.query = {};
        this.query.pager = Qt.irPager(query);
        this.query.sorter = Qt.irSorter(query);
        this.query.projection = Qt.irProjection(query);
        this.query.criteria = Qt.irCriteria(query);
        if (reference) {
            /*
             * reference的绑定（有状态）
             */
            this.reference = reference;
            /*
             * 和 React 组件绑定
             */
            const queryData = Qt.analyze(this.query.criteria, reference);
            this.forest = new QForest(queryData);
        } else {
            this.forest = new QForest(this.query.criteria);
        }
    }

    and(filters = {}): QQuery {
        this.forest.and(filters);
        return this;
    }

    init(filters = {}): QQuery {
        this.forest.init(filters);
        return this;
    }

    /*
     * pager 相关处理
     */
    size(size = 10): QQuery {
        if (size && this.query.pager) {
            const pagerRef = this.query.pager;
            pagerRef.size = size;
        }
        return this;
    }

    page(page = 1): QQuery {
        if (page && this.query.pager) {
            const pagerRef = this.query.pager;
            pagerRef.page = page;
        }
        return this;
    }

    /*
     * sorter 专用
     */
    sort(field: any = "", isAsc = true, appendOnly = false): QQuery {
        const queryRef = this.query;
        if (!queryRef.sorter) {
            queryRef.sorter = [];
        }
        /*
         * 单参数
         */
        if (1 === arguments.length) {
            if (Array.isArray(field)) {
                queryRef.sorter = field;
            }
        } else {
            if ("string" === typeof field) {
                const sortItem = `${field},${isAsc ? "ASC" : "DESC"}`;
                if (!appendOnly) {
                    queryRef.sorter = [];
                }
                queryRef.sorter.push(sortItem);
            }
        }
        return this;
    }

    to() {
        const $query = Ux.clone(this.query);
        $query.criteria = this.forest.to();
        Ux.dgDebug({
            condition: $query.criteria,
            query: $query,
        }, "[ Qr ] 森林分析最终的 $query = ", "#666");
        return $query;
    }
}

export default QQuery