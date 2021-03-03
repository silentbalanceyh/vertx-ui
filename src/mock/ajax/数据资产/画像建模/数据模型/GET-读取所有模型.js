export default {
    mock: true,
    data: [
        {
            "id": "m1",
            "name": "模型信息",
            "type": "MODEL"
        },
        {
            "id": "attr1",
            "name": "关联属性1",
            "type": "ATTRIBUTE",
            "parentId": "m1"
        },
        {
            "id": "attr2",
            "name": "关联属性2",
            "type": "ATTRIBUTE",
            "parentId": "m1"
        },
        {
            "id": "attr3",
            "name": "关联属性3",
            "type": "ATTRIBUTE",
            "parentId": "m1"
        },
        {
            "id": "action1",
            "name": "关联行为1",
            "type": "ACTION",
            "parentId": "m1"
        },
        {
            "id": "action2",
            "name": "关联行为2",
            "type": "ACTION",
            "parentId": "m1"
        },
        {
            "id": "action3",
            "name": "关联行为3",
            "type": "ACTION",
            "parentId": "m1"
        },
    ]
}