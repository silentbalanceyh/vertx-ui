import global from './global';
import authority from './authority';
// ------------- 上边是全局处理 -------------
import E from './error';
// ------------- 上边是调试专用 -------------
import business from './business';
import func from './func';
import parser from './parser';
import generator from './generator';
import config from './config';
// ------------- X6 -----------------------
import X6 from './x6';

/**
 * # 核心工具函数
 *
 * ## 1.函数列表
 *
 * |函数名|含义|
 * |:---|:---|
 * |mapAsyncDatum|「专用」`OxHistory`执行字典数据操作专用函数。|
 * |mapButtons|早起处理`optionJsx.extension`专用函数。|
 * |mapFn|过滤继承属性`rx, fn, do`专用函数名过滤器。|
 * |mapMeta|后端`metadata`序列化的补充函数。|
 * |mapUri|uri地址规范化函数。|
 * |onApp|记录中追加应用信息的专用函数，和`X_APP`绑定。|
 * |onOp|动态表单配置时按钮事件绑定专用函数。|
 * |onRelation|关系计算专用函数。|
 * |onRelationIdentifiers|双树模型中计算相关模型标识符专用函数。|
 * |onRelationType|关系类型计算专用函数。|
 * |onTree|树配置专用处理函数。|
 * |toArray|二义性数组读取，近似于`Ux.ambArray`。|
 * |toColor|随机生成颜色，Dashboard专用。|
 * |toDialog|窗口配置统一生成，服务于`<Modal/>`。|
 * |toIdentifier|配置映射计算专用函数，通常处理`vector`节点。|
 * |toModelId|将`modelId`转换成identifier再执行`toIdentifier`函数抽取配置。|
 * |toNamespace|名空间计算函数。|
 * |toUri|uri地址规范化函数，`mapUri`内部调用了`toUri`，而且很多地方计算路径也会调用该函数。|
 * |upCondition|$condition专用比对函数。|
 * |upList|列表组件比对函数，除了$query以外还检查列表更新信息。|
 * |upLoading|$loading加载效果比对函数。|
 * |upQuery|$query专用比对函数。|
 * |upValue|通用值计算比对函数。|
 *
 * > `Ex`中的核心工具类主要服务于Ex（扩展层）和Ox（配置层）的组件，并且大部分不是JavaScript的纯函数，具有一定业务意义。
 *
 * @module _function
 */
/**
 *
 * # 常量定义模块
 *
 * @module _constant
 */
export default {
    ...func,
    ...config,
    ...generator,
    ...global,
    ...business,
    ...authority,
    E,
    X6,

    ...parser,
    Order: {
        "op.open": [
            "op.open.add",
            "op.open.filter"
        ],
        "op.batch": [
            "op.batch.edit",
            "op.batch.delete"
        ],
        "op.extra": [
            "op.extra.column",
            "op.extra.view",
            "op.extra.export",
            "op.extra.import"
        ],
        "op.add": [
            "op.submit.add",
            "op.submit.reset"
        ],
        "op.edit": [
            "op.submit.save",
            "op.submit.delete",
            "op.submit.close",
            "op.submit.reset"
        ]
    }
}