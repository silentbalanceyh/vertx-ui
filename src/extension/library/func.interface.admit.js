import __Zp from 'zep';
// -------------------------------------- 行为处理分界 -------------------------------
/**
 * ## 「标准」`Ex.aclRoute`
 *
 * 「RBAC」
 * 新版本权限路由专用，用于执行权限路由路径
 * 权限路由进入权限设置主界面
 * params的数据结构
 *
 * ```json
 * {
 *    "key": "实体Key，角色或用户ID",
 *    "view": "视图类型，角色 = ROLE，用户 = USER",
 *    "admit": "特权标记（角色才拥有，是否拥有超级权限）"
 * }
 * ```
 *
 * @memberOf module:secure/upper
 * @param reference
 * @param params
 */
const aclRoute = (reference, params = {}) =>
    __Zp.aclRoute(reference, params);
/**
 *
 * ## 「标准」`Ex.aclRegionInit`
 * Parent / Child Initializing
 * 1. $regionV: It means that current component must be children and could not be `container`.
 *    props / $regionV --->             state / $inited
 * 2. Current component must be parent component and act as two roles:
 *    2.1. As component,
 *    $bindData[webComponent]   --->    state / $inited
 *    $bindData                 --->    state / $bindData
 *    2.2. As container,
 *    $bindData                 --->    state / $bindData
 *
 * After above initialized
 *    state / $inited           --->    combine.$inited ( Init Data Structure )
 *    --> $keySet
 *    --> $keyDefault
 *
 * @memberOf module:secure/upper
 * @param reference
 * @param actionFn
 * @param initState
 * @return {*}
 */
const aclRegionInit = async (reference, actionFn = {}, initState = {}) =>
    __Zp.aclRegionInit(reference, actionFn, initState);
/**
 *
 * ## 「标准」`Ex.aclChild`
 * webBind / webAction
 * Mount data structure
 * -- $bindValue    -- current component bind value ( Consume Point )
 * -- $bindData     -- All the bind data map in current region ( Include children Region )
 */
/*
 * Returned Data Structure
 * -- config = child configuration + $selected ( P )
 * -- data   = data[$selected.value];
 * -- $owner
 * -- $region
 *
 * @memberOf module:secure/upper
 * @param reference
 * @param child
 * @param $selected
 * @return {*}
 */
const aclChild = (reference, child = {}, $selected = {}) =>
    __Zp.aclChild(reference, child, $selected);
/**
 * ## 「标准」`Ex.aclChildUp`
 *
 * @memberOf module:secure/upper
 * @param reference
 * @param virtual
 * @param callback
 * @return {*}
 */
const aclChildUp = (reference, virtual = {}, callback) =>
    __Zp.aclChildUp(reference, virtual, callback);
/*
## 「标准」`Ex.aclRegion`
 * Returned Data Structure:
 * -- $owner
 * -- $region
 * -- $initial
 *    -- ownerType
 *    -- owner
 * -- data
 *    -- __children ( If So )
 * -- config
 *
 * Action Need
 * -- $bindValue
 * -- $bind
 * -- $anchors
 *
 * Execution Need
 * -- $loading
 * -- rxFlag
 * -- rxLoading
 *
 * @memberOf module:secure/upper
 * @param reference
 * @param region
 * @return {{}}
 */
const aclRegion = (reference, region = {}) =>
    __Zp.aclRegion(reference, region);

// -------------------------------------- 数据流分界 -------------------------------
/**
 * ## 「扩展」`Ex.aclIn`
 *
 * @memberOf module:secure/upper
 * @param reference
 * @param $inited
 * @param actionFn
 * @return {*}
 */
const aclIn = (reference, $inited = {}, actionFn) =>
    __Zp.aclIn(reference, $inited, actionFn);
/**
 * ## 「扩展」`Ex.aclOut`
 * @memberOf module:secure/upper
 * @param reference
 * @param $valueOut
 * @param option
 * @return {Set<any>|*}
 */
const aclOut = (reference, $valueOut, option = {}) =>
    __Zp.aclOut(reference, $valueOut, option);
/*
 * viewData结构
 * {
 *     "rows": {},
 *     "projection": [],
 *     "criteria": {}
 * }
 */
export default {
    // 新接口，用于新的权限管理
    /*
     * -------->「Input」
     * arguments[1] -> params
     * {
     *     key: "USER / ROLE key",
     *     view: "type of view, may be ROLE | USER",
     *     data: "owner record"
     * }
     *
     * ===================================================================
     * 「Output」--------> {
     *     _key,
     *     _view,
     *     _data
     * }
     * _ prefix means internal parameters that will be not show on URI
     */
    aclRoute,               // 权限路由


    /*
     * -------->「Input」
     * arguments[0] -> request data structure
     * {
     *     key: "User / Role key for current",
     *     type: "USER / ROLE"
     * }
     *
     * ===================================================================
     * 「Output」--------> state
     */
    aclRegionInit,              // 权限区域管理


    /*
     * -------->「Input」
     * props -> $inited,  The data structure is
     * {
     *     "key": "primary key of role / user",
     *     "type": "ROLE | USER",
     *     "data": {
     *         ...role / user object stored data information
     *     }
     * }
     * arguments -> region data structure
     * {
     *     "config": "dm configuration",
     *     "datum": "dm original data of S_PATH",
     *     "group": "dm compile result",
     *     "data": "ui compile data"
     * }
     *
     * ===================================================================
     * 「Output」-------->
     * {
     *     $owner:                      $inited -> data,
     *     $region:                     region ( arguments[1] ),
     *     $initial: {
     *         owner:                   $inited -> key,
     *         ownerType:               $inited -> type
     *     },
     *     $inited:                     state -> $initial ( Calculated by webBind ),
     *     $loading:                    state -> $loading,
     *     (Fn) rxLoading:                   Bind to $loading for inherit calling.
     *     data:                        region -> data,
     *     config: {
     *         ...region -> config,
     *         group                    region -> group,
     *         datum                    region -> datum
     *     }
     * }
     * webView / webBind
     */
    aclRegion,       // 权限区域内容
    aclChild,
    aclChildUp,      //


    // ------------- 数据处理
    aclIn,        // 构造 $keySet
    aclOut,      // 构造请求数据,
    // ------------- Function
    /**
     * ## 「标准」`Ex.aclE`
     * @memberOf module:secure/upper
     * @constant aclE
     * @type {Object}
     */
    aclE: __Zp.aclE
}