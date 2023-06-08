import Ux from 'ux';

// eslint-disable-next-line no-template-curly-in-string
const KEY_LINK = "`${source.code} - ${target.code}`";

const valueRow = (linkage = {}) => {
    /*
     * 链接专用记录
     */
    if (!linkage.key) {
        linkage.key = Ux.randomUUID();
    }
    const record = {};
    const {targetData = {}} = linkage;
    Object.assign(record, targetData);
    record.__key = targetData.key;
    /*
     * 特殊字段
     * - key 赋值成 linkage 的 key
     * - record 赋值成提交请求要使用的 linkage 记录
     */
    const encryptUnique = (item = {}) => {
        const seed = item['targetType'] + "/" + item.targetKey;
        return Ux.encryptMD5(seed);
    };
    record.key = linkage.key;
    record.data = linkage;
    record.unique = encryptUnique(linkage);
    return record;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    valueRow,
    rxUnlink: (reference) => (event) => {
        Ux.prevent(event);
        let {
            $selected = [],
            $data = []
        } = reference.state;
        const keys = $selected.map(item => item.key);
        $data = Ux.clone($data);
        $data = $data.filter(item => !keys.includes(item.key));

        const state = {};
        state.$data = $data;
        state.$selected = [];
        // {
        //     const updated = state.$data.map(item => item.data);
        //     Ux.fn(reference).onChange(updated);
        // }
        state.$keyChange = Ux.randomString(8);
        Ux.of(reference).in(state).handle(() => {

            const updated = state.$data.map(item => item.data);
            Ux.fn(reference).onChange(updated);
        })
        // reference.?etState(state);
    },
    rxSave: (reference) => (event) => {
        Ux.prevent(event);
        // 发送请求更新
        const {$save = {}, $data = []} = reference.state;
        const keys = $data.map(item => item.key);
        // Removed（移除）
        const {data = [], message} = $save;
        // Save（保存）
        const removed = data.filter(item => !keys.includes(item.key)).map(item => item.key);
        const request = {};
        request.removed = removed;
        request.data = $data.map(item => item.data);
        Ux.ajaxPost("/api/linkage/sync/b", request).then(response => {
            if (message) {
                Ux.messageSuccess(message);
            }
            // 回调更新当前数据
            const state = {};
            state.$keyChange = undefined;

            const $data = [];
            response.forEach(row => $data.push(valueRow(row)));
            state.$data = $data;
            state.$save = {
                data: $data
            }
            Ux.of(reference).in(state).handle(() => {

                Ux.fn(reference).onChange($data.map(item => item.data));
            })
            // Ux.fn(reference).onChange($data.map(item => item.data));
            // reference.?etState(state);
        })
    },
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
            let $dataArray = [];
            /*
             * 根据 unique 保存
             */
            const saveRow = (item) => {
                const found = Ux.elementUnique($original, 'unique', item.unique);
                if (found) {
                    $dataArray.push(Object.assign(found, item));
                } else {
                    $dataArray.push(item);
                }
            }
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
                    dataItem.name = KEY_LINK;
                    dataItem.targetKey = data.key;
                    dataItem.targetData = Ux.clone(data);
                    const normalized = valueRow(dataItem);
                    saveRow(normalized);
                })
            } else {
                /*
                 * 编辑模式，独立模式保存需要全数据
                 */
                if ($inited && $inited.code) {
                    $data.forEach(data => {
                        const dataItem = Ux.clone($initial);
                        // ticket key
                        dataItem.sourceKey = $inited['traceId'];
                        dataItem.sourceData = Ux.clone($inited);
                        dataItem.name = `${$inited.code} - ${data.code}`;
                        dataItem.targetKey = data.key;
                        dataItem.targetData = Ux.clone(data);
                        // inited data
                        const normalized = valueRow(dataItem);
                        saveRow(normalized);
                    })
                }
            }
            state.$data = $dataArray;
        }
        // {
        //     const updated = state.$data.map(item => item.data);
        //     Ux.fn(reference).onChange(updated);
        // }
        // Linkage
        state.$keyChange = Ux.randomString(8);
        Ux.of(reference).in(state).handle(() => {

            const updated = state.$data.map(item => item.data);
            Ux.fn(reference).onChange(updated);
        })
        // reference.?etState(state);
    }
}