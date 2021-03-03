import Ux from 'ux';
import {Dsl} from 'entity';
import {Of} from 'app';

const insertAt = (dataArray = [], response = {}) => {
    const processed = Ux.clone(dataArray);
    const filtered = dataArray.filter(each => each.parentId === response.parentId);
    response.sort = filtered.length + 1;
    processed.push(response);
    return processed;
}

const updateAt = (dataArray = [], response = {}) => {
    const processed = Ux.clone(dataArray);
    let foundIndex = -1;
    processed.forEach((item, index) => {
        if (item.id === response.id) {
            foundIndex = index;
        }
    });
    processed[foundIndex] = response;
    return processed;
}

const treeBranch = (dataArray = [], item = {}) => {
    const collect = [];
    collect.push(item);

    const children = dataArray.filter(each => each.parentId === item.id);
    if (0 < children.length) {
        children.forEach(child => {
            const childEach = treeBranch(dataArray, child);
            childEach.forEach(found => collect.push(found))
        });
    }
    return collect;
}

const stateClean = ($treeArray = []) => {
    const state = {};
    state.$treeArray = $treeArray;      // 更新数组
    state.$submitting = false;          // 防重复提交
    state.$isEdit = false;              // 不可编辑
    state.$edition = undefined;         // 无编辑数据
    state.$mode = undefined;            // 清除模式
    return state;
}

const rxSelect = (reference) => ($selectedKeys = []) => {
    const id = $selectedKeys[0];
    reference.setState({$spinning: true});       // 加载
    Dsl.of(reference).bind(Of.apiTagCatGet).ok(response => {
        /*
         * report 是最后位置的百分比设置
         * 其他字段用于渲染表单
         */
        const state = {};
        if (response) {
            const {report = {}, ...rest} = response;
            /*
             * 基础信息和分类所占百分比
             */
            state.$dataBasic = Ux.clone(rest);
            state.$dataReport = Ux.clone(report);
        }
        state.$selectedKeys = $selectedKeys;
        reference.setState(state);
    }).async({id});
}
const rxAdd = (reference, node) => (event) => {
    Ux.prevent(event);
    /*
     * 设置状态
     */
    const state = {};
    state.$selectedKeys = [];
    state.$edition = {
        parentId: node.parent,   // 父键
        id: Ux.randomUUID(),     // 主键
        name: "EDIT"
    };
    state.$editionText = "";     // 编辑文字
    state.$isEdit = true;
    state.$mode = "ADD";
    state.$dataBasic = undefined;
    state.$dataReport = undefined;
    reference.setState(state);
}
const rxAddNo = (reference) => (event) => {
    Ux.prevent(event);
    const {$treeArray = []} = reference.state;
    const state = stateClean($treeArray);
    reference.setState(state);
}
const rxAddYes = (reference, item) => (event) => {
    Ux.prevent(event);
    const {$editionText, $mode} = reference.state;
    /*
     * 内置
     */
    if ($editionText && $mode) {
        reference.setState({$submitting: true});        // 提交
        /*
         * 新增数据，利用返回数据更新 $treeArray 数组
         */
        const {$edition = {}} = reference.state;
        const request = Ux.clone($edition);
        request.name = $editionText;
        if ("ADD" === $mode) {
            Dsl.of(reference).bind(Of.apiTagCatAdd).ok(response => {
                /*
                 * 确认后的回调
                 */
                let {$treeArray = []} = reference.state;
                $treeArray = insertAt($treeArray, response);
                const state = stateClean($treeArray);
                reference.setState(state);
            }).async(request);
        } else {
            /*
             * 更新数据专用
             */
            Dsl.of(reference).bind(Of.apiTagCatSave).ok(response => {
                /*
                 * 确认后的回调
                 */
                let {$treeArray = []} = reference.state;
                $treeArray = updateAt($treeArray, response);
                const state = stateClean($treeArray);
                reference.setState(state);
            }).async(request);
        }
    } else {
        const message = Ux.fromHoc(reference, "message");
        Ux.messageFailure(message.empty);
    }
}
const rxAddChange = (reference) => (event) => {
    Ux.prevent(event);
    const $editionText = Ux.ambEvent(event);
    reference.setState({$editionText});
}
const rxSubAdd = (reference, item) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    const state = {};
    state.$selectedKeys = [];
    state.$edition = {
        parentId: item.key,      // 当前节点作为父节点
        id: Ux.randomUUID(),     // 主键
        name: "EDIT"
    };
    state.$editionText = "";     // 编辑文字
    state.$isEdit = true;
    state.$mode = "ADD";
    state.$dataBasic = undefined;
    state.$dataReport = undefined;
    reference.setState(state);
}
const rxSubDel = (reference, item) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    Ux.sexDialog(reference, "removed", () => {
        const request = Ux.clone(item.data);
        Dsl.of(reference).bind(Of.apiTagCatDel).ok(() => {
            /*
             * 从 $treeArray 中删除
             */
            let {$treeArray = []} = reference.state;

            const branch = treeBranch($treeArray, request);
            const removedSet = new Set(branch.map(item => item.id));
            $treeArray = Ux.clone($treeArray);
            $treeArray = $treeArray.filter(item => !removedSet.has(item.id));
            /*
             * 删除后的回调执行
             */
            const state = {};
            state.$treeArray = $treeArray;      // 更新数组
            state.$submitting = false;          // 防重复提交
            state.$isEdit = false;              // 不可编辑
            state.$edition = undefined;         // 无编辑数据
            state.$mode = undefined;            // 清除模式
            state.$dataBasic = undefined;
            state.$dataReport = undefined;
            reference.setState(state);
        }).async(request);
    })
}
const rxSubEdit = (reference, item) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    const state = {};
    const normalized = Ux.clone(item.data);
    state.$editionText = normalized.name;
    normalized.name = "EDIT";

    state.$edition = normalized;
    state.$isEdit = true;
    state.$mode = "EDIT";
    reference.setState(state);
}
export default {
    // 选中节点
    rxSelect,
    // 点击添加
    rxAdd,
    // 添加 -> 关闭
    rxAddYes,
    rxAddNo,
    // 添加 -> 输入变更
    rxAddChange,
    // 添加子类
    rxSubAdd,
    rxSubDel,
    rxSubEdit,
}