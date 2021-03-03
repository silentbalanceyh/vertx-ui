import Ux from 'ux';

export default {
    mock: true,
    data: {
        "id": "m1",
        "name": "模型信息",
        "type": "MODEL",
        "columns": [
            {
                "id": "attr1",
                "name": "关联属性1",
                "type": "ATTRIBUTE",
                "parentId": "mode"
            },
            {
                "id": "attr2",
                "name": "关联属性2",
                "type": "ATTRIBUTE",
                "parentId": "mode"
            },
            {
                "id": "attr3",
                "name": "关联属性3",
                "type": "ATTRIBUTE",
                "parentId": "mode"
            },
            {
                "id": "action1",
                "name": "关联行为1",
                "type": "ACTION",
                "parentId": "mode"
            },
            {
                "id": "action2",
                "name": "关联行为2",
                "type": "ACTION",
                "parentId": "mode"
            },
            {
                "id": "action3",
                "name": "关联行为3",
                "type": "ACTION",
                "parentId": "mode"
            }
        ]
    },
    processor: (resp = {}) => {
        resp.code = Ux.randomString(8);
        resp.type = Ux.randomArray(["MODEL", "ATTRIBUTE", "ACTION"])
        return Ux.promise(resp);
    }
}