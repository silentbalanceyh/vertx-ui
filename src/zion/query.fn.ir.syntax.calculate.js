/*
 * 多路径合并计算（双向同步）
 * 1. 列过滤：根据 $condition / $terms 计算 $qr
 * 2. 搜索框：根据 $condition / $terms 计算 $qr
 * 3. 高级搜索提交：根据 $qr / $terms 计算 $condition
 *
 * $qr 会用于查询视图、高级搜索表单两个地方
 * 视图选择时修改 $queryView 构造最新的值
 */
import {QQuery} from 'zmr';
import __Zn from './zero.module.dependency';
import __QRP from './query.__.fn.qr.processor';

const __qrIsDelete = (value) => null === value || "__DELETE__" === value;
const __qrCond = (condition = {}, mode = 1, $terms = {}) => {
    if (1 === mode) {
        // keyword 专用，过滤 null 和 __DELETE__
        const cond = {};
        Object.keys(condition)
            .filter(field => !__qrIsDelete(condition[field]))
            .forEach(field => {
                cond[field] = condition[field];
            });
        // console.log("Keyword: ", cond);
        return cond;
    } else if (2 === mode) {
        // $condition 存储专用，转换成 [] 格式
        const cond = {};
        Object.keys(condition).forEach(field => {
            const value = condition[field];
            if (__qrIsDelete(value)) {
                if (Object.keys($terms).hasOwnProperty(field)) {
                    cond[field] = [];
                }
            } else {
                cond[field] = value;
            }
        });
        // console.log("Store: ", cond);
        return cond;
    } else {
        // $ __DELETE__ 转换
        const cond = {};
        Object.keys(condition).forEach(field => {
            const value = condition[field];
            if (__qrIsDelete(value)) {
                cond[field] = __Zn.Env.CV_DELETE;
            } else {
                if (__Zn.isArray(value) && 0 === value.length) {
                    cond[field] = __Zn.Env.CV_DELETE;
                } else {
                    cond[field] = value;
                }
            }
        });
        // console.log("Norm: ", cond);
        return cond;
    }
}

const __qrKeyword = (state = {}, configuration = {}) => {
    const {
        $terms = {},
        $condition = {}
    } = configuration;
    // 关键字高亮
    const $keyword = {};
    Object.keys($terms).forEach(field => {
        const config = $terms[field];
        if ("SEARCH" === config.type && $condition.hasOwnProperty(field)) {
            const keyword = $condition[field];
            $keyword[field] = keyword[0];   // 此处 keyword 必定是 []
        }
    });
    state.$keyword = $keyword;
}
/*
 * 1) $condition -> $qr（合并原始） -> $keyword
 * 2) $qr（替换） -> $condition    -> $keyword
 *
 * 流程处理（入口函数注释 #QR-COMMENT）
 * 入口：列过滤：$condition（合并）-> 1)
 * 入口：输入框：$condition（替换）-> 1)
 * 入口：高级搜索：$qr（替换）
 * 入口：查询条件：$queryView -> $qr（清空，限制列过滤）
 */
const __qrFromCondition = (inCondition = {}, state = {}, isAppend = true) => {
    let condition = {};
    let {
        $condition = {},
        $terms,
        $qr,
    } = state;
    // mode = 2, 存储专用
    const __condStore = __qrCond(inCondition, 2, $terms);
    if (isAppend) {
        $condition = __Zn.clone($condition);
        condition = Object.assign($condition, __condStore);
    } else {
        condition = __Zn.clone(__condStore);
    }
    const response = {};
    response.$condition = condition;
    // mode = 1, keyword 专用
    const __condKw = __qrCond(inCondition, 1);
    __qrKeyword(response, {
        $condition: __condKw,
        $terms,
    });

    /*
     * 此处计算 $qr 不考虑 isAppend 参数，由于 condition 已经
     * 计算过一次，所以此处的 $qr 可直接根据 condition 执行计算
     * 低优先级往高优先级执行可以直接使用替换合并的模式处理
     */
    let qr = $qr ? __Zn.clone($qr) : {};
    // mode = 3, qr语法专用
    const __condNorm = __qrCond(inCondition, 3);
    const __qrNorm = __QRP.qrNorm(__condNorm, {terms: $terms, strict: false});
    Object.assign(qr, __qrNorm);


    if (isAppend) {
        // Fix: https://gitee.com/silentbalanceyh/vertx-zero-scaffold/issues/I6VQJV
        qr.connector = "AND";
    } else {
        qr.connector = qr[""] && __Zn.isNotEmpty(__qrNorm) ? "AND" : "OR";
    }
    delete qr[""];


    response.$qr = qr;
    return response;
}
const irData = (reference) => (params = {}) => {
    let {
        $queryView = {},        // 默认查询条件
        $terms,                 // 列过滤处理
    } = reference.state;
    const {
        $condition = {},        // 传入的查询条件,
        isQrC = false,
        isAppend = false,
    } = params;
    const state = __qrFromCondition($condition, reference.state, isAppend);
    if (isQrC) {
        // 追加一个判断:
        state.$qr = {connector: "OR"};
    }
    $queryView = __Zn.clone($queryView);
    const queryRef = new QQuery($queryView, reference);
    // mode = 3, qr语法专用
    const __condNorm = __qrCond($condition, 3);
    __condNorm[""] = "AND" === state.$qr.connector;
    const queryCond = __QRP.qrNorm(__condNorm, {terms: $terms});
    queryRef.and(queryCond);
    return [state, queryRef];
};
const __qrFromForm = (qrInput = {}, state = {}) => {
    const qr = {};
    Object.keys(qrInput)
        .filter(field => __Zn.Env.CV_DELETE !== qrInput[field])
        .forEach(field => qr[field] = qrInput[field]);
    let {
        // $condition 旧代码
        $terms = {},
    } = state;
    const response = {};
    /*
     * 此处计算 $qr 一定是替换（高优先级），但需要根据 $qr 把 $condition 计算出来
     * 只有计算了 $condition 之后才可以构成最终的结果以及 $keyword 部分的内容。
     * 此处有一个变数，就是保存视图的时候和提交高级查询时的区别
     */
    const condFields = Object.keys($terms);
    // Fix: https://gitee.com/silentbalanceyh/vertx-zero-scaffold/issues/I6VQXG
    const condition = {}; // clean ? {} : __Zn.clone($condition);
    Object.keys(qr).forEach(field => {
        if (0 < field.indexOf(",")) {
            const term = field.split(",")[0];
            if (condFields.includes(term)) {
                const condValue = qr[field];
                if (__Zn.isArray(condValue)) {
                    condition[term] = condValue;
                } else {
                    condition[term] = [condValue];
                }
            }
        }
    });
    response.$condition = condition;
    /* 此处 qr 是提交后数据，带 "" 键值 */
    response.$qr = irSwitcher(null)
        // "" -> connector
        .client(qr);
    // mode = 1, keyword 专用
    const __condKw = __qrCond(qr, 1)
    __qrKeyword(response, {
        $condition: __condKw,
        $terms,
    });
    return response;
}
const irSubmit = (reference) => ($qr = {}, addOn) => {
    // const {
    //     $qr,
    // } = state;
    let {
        $queryView,
        $terms,
    } = reference.state;


    // 1. 创建 queryRef
    $queryView = __Zn.clone($queryView);
    const queryRef = new QQuery($queryView, reference);

    // 2. 计算 $condition 和 $qr
    const response = __qrFromForm($qr, reference.state);
    const queryCond = __QRP.qrNorm($qr, {terms: $terms});
    queryRef.and(queryCond);
    response.$query = queryRef.to();

    if (addOn) {
        Object.assign(response, addOn);
    }
    return __Zn.of(reference).in(response).future(() => {
        __Zn.dglQrC(reference, true);
        return __Zn.promise(response)
    })
}
/*
 * ir转换器，用于兼容和计算 connector 做服务端和客户端的转换专用
 * 读取模式分两种：拷贝模式和修改模式
 * 1）拷贝模式：不该变原始数据，拷贝新的执行修改
 * 2）修改模式：直接修改，可返回也可不返回（默认）
 */
const irSwitcher = (reference) => {
    const __fnClient = ($qr = {}) => {
        $qr.connector = $qr[""] ? "AND" : "OR";
        if ($qr.hasOwnProperty("")) {
            delete $qr[""];
        }
    }
    const __fnServer = ($qr = {}) => {
        const connector = $qr.connector;
        if ($qr.hasOwnProperty('connector')) {
            delete $qr.connector;
        }
        if (0 < Object.keys($qr).length) {
            $qr[""] = "AND" === connector;
        }
    }
    return {
        /* 服务端查询条件转客户端查询条件专用 */
        client: ($qr = {}, ref = true) => {
            const vQr = ref ? $qr : __Zn.clone($qr);

            __fnClient(vQr);
            // 专成客户端专用，所以 server = true
            __Zn.dglQrV(reference, vQr, $qr, true);
            return vQr;
        },
        /* message专用 */
        message: ($qr = {}) => {
            if ($qr.connector) {
                return $qr.connector;
            } else {
                return $qr[""] ? "AND" : "OR";
            }
        },
        /* 客户端查询条件专服务端查询条件专用 */
        server: ($qr = {}, ref = true) => {
            const vQr = ref ? $qr : __Zn.clone($qr);
            __fnServer(vQr);
            // 专成服务端专用，所以 server = false
            __Zn.dglQrV(reference, vQr, $qr, false);
            return vQr;
        },
        /*
         * <name>: {
         *     name: <name>,
         *     op: <op>
         * }
         */
        metadata: ($qr = {}, $terms) => {
            const metadata = {};
            Object.keys($qr).filter(field => "connector" !== field).forEach(field => {
                if (0 < field.indexOf(",")) {
                    const term = field.split(",");
                    const name = term[0];
                    if ($terms) {
                        if ($terms.hasOwnProperty(name)) {
                            metadata[name] = {
                                name,
                                op: term[1] ? term[1] : "=",
                                value: $qr[field]
                            }
                        }
                    } else {
                        metadata[name] = {
                            name,
                            op: term[1] ? term[1] : "=",
                            value: $qr[field]
                        }
                    }
                } else {
                    if ($terms) {
                        if ($terms.hasOwnProperty(field)) {
                            metadata[field] = {};
                            metadata[field].name = field;
                            metadata[field].op = "=";
                            metadata[field].value = $qr[field];
                        }
                    } else {
                        metadata[field] = {};
                        metadata[field].name = field;
                        metadata[field].op = "=";
                        metadata[field].value = $qr[field];
                    }
                }
            });
            return metadata;
        }
    }
}
export default {
    irSubmit,
    irData,
    irSwitcher,
}