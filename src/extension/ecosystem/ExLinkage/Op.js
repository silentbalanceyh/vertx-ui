import Ux from 'ux';

const elementSave = ($data = [], $added = {}) => {
    /*
     * $data 中查找 $added 中匹配的数据
     */
    const encryptUnique = (item = {}) => {
        const seed = item.targetType + "/" + item.targetKey;
        return Ux.encryptMD5(seed);
    };
    const keyIn = encryptUnique($added);
    const $dataArray = Ux.clone($data);
    const found = $data.filter(item => {
        const keyOld = encryptUnique(item);
        return keyIn === keyOld;
    });
    if (1 === found.length) {
        const foundObj = Ux.clone(found[0]);
        // 合并
        $dataArray.push(Object.assign(foundObj, $added));
    } else if (0 === found.length) {
        // 添加
        $dataArray.push($added);
    }
    return $dataArray;
}

export default {
    /*
     * rxLink（添加Link时专用）
     */
    rxLink: (reference) => ($data = [], $lazySelected = {}) => {
        // 关闭窗口
        const state = {};
        state.$visible = false;


        // 计算 linkKey（以target为对端）
        {
            let {$lazy = {}} = reference.state;
            $lazy = Ux.clone($lazy);
            /*
             * field: {
             *      "key": "display"
             * }
             */
            Object.keys($lazySelected).forEach(field => {
                if ($lazy.hasOwnProperty(field)) {
                    // 已经存在，执行合并
                    const ref = $lazy[field];
                    Object.assign(ref, $lazySelected[field]);
                } else {
                    // 不存在，直接追加
                    $lazy[field] = $lazySelected[field];
                }
            })
            state.$lazy = $lazy;
        }
        // 记录设置，记录唯一键
        {
            // 构造 linkage 专用值
            const {$initial = {}} = reference.state;
            /*
             * 字段设置，基础字段：
             * - 「自动生成」key（根据模式，添加模式不带）
             * - 「默认值」alias, 别名
             * - 「默认值」type, 连接类型
             * - 「赋值/自动生成」name，（自动生成，序号 + 序号）
             * - 「默认值」region，连接区域
             *
             * - 「自动生成」linkKey，自动计算
             * - 「默认值」linkType, 关系记录类型
             * - 「忽略」linkData（可选，置空）
             *
             * - 「赋值/自动生成」sourceKey，源主键
             * - 「默认值」sourceType，源实体
             * - 「赋值/自动生成」sourceData，（数据记录）
             * - 「赋值」targetKey，目标主键
             * - 「默认值」targetType，目标实体
             * - 「赋值」targetData，（数据记录）
             *
             * $initial 中存在的字段
             * - alias
             * - region
             * - type
             * - linkType
             * - sourceType
             * - targetType
             */
            const {$inited = {}, $mode} = reference.props;
            const $original =
                // 原始数据
                reference.state.$data ? reference.state.$data : [];
            let $dataArray = Ux.clone($original);
            if (Ux.Env.FORM_MODE.ADD === $mode) {
                /*
                 * 添加模式，等待后台赋值字段
                 * - name
                 * - sourceKey
                 * - sourceType
                 * - sourceData
                 */
                $data.forEach(data => {
                    const dataItem = Ux.clone($initial);
                    // eslint-disable-next-line
                    dataItem.name = "`${sourceCode} - ${targetCode}`";
                    dataItem.targetKey = data.key;
                    dataItem.targetData = Ux.clone(data);
                    $dataArray = elementSave($dataArray, dataItem); // $dataArray.push(dataItem);
                })
            } else {
                /*
                 * 编辑模式，独立模式保存需要全数据
                 */
                if ($inited && $inited.code) {
                    $data.forEach(data => {
                        const dataItem = Ux.clone($initial);
                        dataItem.sourceKey = $inited.key;
                        dataItem.sourceData = Ux.clone($inited);
                        dataItem.name = `${$inited.code} - ${data.code}`;
                        dataItem.targetKey = data.key;
                        dataItem.targetData = Ux.clone(data);
                        $dataArray = elementSave($dataArray, dataItem);
                    })
                }
            }
            state.$data = $dataArray;
        }
        console.log(state);
        // Linkage
        reference.setState(state);
    }
}