import Ux from 'ux';
import Ex from "ex";

const onSwitch = (reference) => ($admin) => {
    const {$changed} = reference.state;
    if ($changed) {
        Ux.sexDialog(reference, "unsave", {
            ok: () => Ux.of(reference).in({
                $admin,
                $changed: undefined
            }).done()
            // reference.?etState({$admin, $changed: undefined})
        })
    } else {
        Ux.of(reference).in({
            $admin,
            $changed: undefined
        }).done()
        // reference.?etState({$admin, $changed: undefined});
    }
}

const onRoute = (reference, item = {}) => (event) => {
    Ux.prevent(event);
    const {$admin = false} = reference.state;
    if ($admin) {
        const info = Ux.fromHoc(reference, "info");
        Ux.messageFailure(info['admin'], 2);
    } else {
        Ux.toRoute(reference, item.uri);
    }
}

const onAdd = (reference) => (event) => {
    Ux.prevent(event);
    Ux.of(reference).open().done();
    // reference.?etState({$visible: true})
}

const onSave = (reference) => (event) => {
    Ux.prevent(event);
    const {$router, config = {}} = reference.props;
    const {$data = []} = reference.state;
    // reference.?etState({$submitting: true});
    Ux.of(reference).submitting().handle(() => {

        const request = {};
        const {parameters = {}} = config;
        Object.assign(request, parameters);
        request.page = $router.path();
        const user = Ux.isLogged();
        request.owner = user.key;

        const menus = Ux.clone($data);
        menus.forEach((menu, index) => menu.uiSort = (index + 1));
        request.menus = menus;
        Ux.ajaxPost("/api/my/menu/save", request).then(response => Ux.sexDialog(reference, "saved", () => {
            Ux.of(reference).in({
                $data: response,
                $changed: undefined
            }).submitted().done();
            // reference.?etState({
            //     $data: response,
            //     $submitting: false,
            //     $changed: undefined
            // })
        }))
    })

}

const toolkit = (reference, item = {}) => ({
    rxLeft: (event) => {
        Ux.prevent(event);
        const {$data = []} = reference.state;
        let data = Ux.clone($data);
        data = Ux.elementWrap(data, item.index, item.index - 1);
        data.forEach((each, index) => each.index = index);
        Ux.of(reference).in({
            $data: data,
            $changed: Ux.randomString(8)
        }).done();
        // reference.?etState({$data: data, $changed: Ux.randomString(8)})
    },
    rxRight: (event) => {
        Ux.prevent(event);
        const {$data = []} = reference.state;
        let data = Ux.clone($data);
        data = Ux.elementWrap(data, item.index, item.index + 1);
        data.forEach((each, index) => each.index = index);
        Ux.of(reference).in({
            $data: data,
            $changed: Ux.randomString(8)
        }).done();
        // reference.?etState({$data: data, $changed: Ux.randomString(8)})
    },
    rxDelete: (event) => {
        Ux.prevent(event);
        const {$data = []} = reference.state;
        let data = Ux.clone($data);
        data = data.filter(each => each.key !== item.key);
        data.forEach((each, index) => each.index = index);
        Ux.of(reference).in({
            $data: data,
            $changed: Ux.randomString(8)
        }).done();
        // reference.?etState({$data: data, $changed: Ux.randomString(8)})
    }
})
const transfer = (reference, item = {}) => ({
    rxTree: ($sourceSelectedKeys = []) => {
        Ux.of(reference).in({
            $sourceSelectedKeys,
            $targetSelectedKeys: []
        }).done()
        // reference.?etState({
        //     $sourceSelectedKeys,
        //     $targetSelectedKeys: []
        // });
    },
    rxList: (event) => {
        const checked = event.target.checked;
        let {$targetSelectedKeys = []} = reference.state;
        $targetSelectedKeys = Ux.clone($targetSelectedKeys);
        const {keys = []} = item;
        if (checked) {
            // 选中
            keys.forEach(key => $targetSelectedKeys.push(key));
        } else {
            // 移除
            $targetSelectedKeys = $targetSelectedKeys.filter(key => !keys.includes(key));
        }
        // reference.?etState({
        //     $sourceSelectedKeys: [],
        //     $targetSelectedKeys
        // })
        Ux.of(reference).in({
            $sourceSelectedKeys: [],
            $targetSelectedKeys
        }).done()
    },
    onChange: (item, direction, moveKeys) => {
        const state = {};
        if ("left" === direction) {
            // 右往左
            const {$treeMap = {}} = reference.state;
            const uris = [];
            moveKeys.forEach(key => uris.push($treeMap[key]));
            let {$data = []} = reference.state;
            $data = $data.filter(item => !uris.includes(item.uri));
            state.$data = $data;
            state.$targetKeys = toKeyTarget($data, $treeMap);
            state.$sourceSelectedKeys = [];
            state.$targetSelectedKeys = [];
        } else {
            // 左往右
            const {$tree = [], $treeMap = {}} = reference.state;
            const menus = $tree.filter(item => moveKeys.includes(item.key));
            const data = toData(reference, menus);
            let {$data = []} = reference.state;
            $data = $data.concat(data);
            $data = toAttach($data);
            state.$data = $data;
            state.$targetKeys = toKeyTarget($data, $treeMap);
            state.$sourceSelectedKeys = [];
            state.$targetSelectedKeys = [];
        }
        Ux.of(reference).in(state).done();
        // reference.?etState(state);
    }
});
const toData = (reference, menus = []) => {
    const data = [];
    const {config = {}} = reference.props;
    const {parameter = {}} = config;
    const user = Ux.isLogged();
    const keyMap = new Set();
    menus.forEach(item => {
        if (!keyMap.has(item.uri)) {
            const record = {};
            Ux.valueCopy(record, item, [
                "icon",
                "text",
                "uri"
            ]);
            Object.assign(record, parameter);
            record.active = true;
            record.owner = user.key;
            record.key = Ux.randomUUID();
            data.push(record);
            keyMap.add(item.uri);
        }
    });
    return data;
}
const toKey = (input, $treeMap = {}) => {
    let uris = [];
    if (Ux.isArray(input)) {
        // 多值
        uris = input.map(item => item.uri)
            .filter(item => !!item);
    } else {
        // 单值
        if (input.uri) {
            uris = [input.uri];
        }
    }
    const keys = [];
    Object.keys($treeMap).forEach(key => {
        const uri = $treeMap[key];
        if (uris.includes(uri)) {
            keys.push(key);
        }
    })
    return keys;
}
const toAttach = ($data = []) => {
    $data.forEach((data, index) => {
        const style = {};
        if (data['uiColorFg']) {
            style.color = data['uiColorFg'];
        } else {
            style.color = "white";
            data['uiColorFg'] = "white";
        }
        if (data['uiColorBg']) {
            style.backgroundColor = data['uiColorBg'];
        } else {
            style.backgroundColor = Ex.toColor(index);
            data['uiColorBg'] = Ex.toColor(index);
        }
        data.style = style;
        data.index = index;
    });
    return $data;
}
const toKeyTarget = ($data = [], $map = {}) => {
    let keys = [];
    $data.forEach(item => {
        const extracted = toKey(item, $map);
        keys = keys.concat(extracted)
    })
    return keys;
}
export default {
    onSave,
    onSwitch,
    onRoute,
    onAdd,
    // 工具专用事件
    toolkit,
    transfer,
    // uri -> keys
    toKey,
    // style, index 重算
    toAttach,
    toKeyTarget,
}