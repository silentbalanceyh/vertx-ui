export default {
    mock: true,
    data: {
        count: {
            Account: 1,
            Attribute: 12,
            Behavior: 2,
            // 树形结构
            graph: [
                {
                    "id": "d1",
                    "name": "用户基本信息",
                    "data": {
                        "type": "1",
                    },
                    "children": [
                        {
                            "id": "d2",
                            "name": "用户信息详情",
                            "data": {
                                "type": "1",
                            },
                            "children": [

                                {
                                    "id": "r1",
                                    "name": "Wifi行为设计",
                                    "data": {
                                        "type": "4"
                                    }
                                },
                                {
                                    "id": "r2",
                                    "name": "主题娱乐行为设计",
                                    "data": {
                                        "type": "4",
                                    }
                                },
                                {
                                    "id": "r3",
                                    "name": "块钱行为统计",
                                    "data": {
                                        "type": "4",
                                    }
                                },
                                {
                                    "id": "r4",
                                    "name": "旅游行为设计",
                                    "data": {
                                        "type": "4",
                                    }
                                },
                                {
                                    "id": "a1",
                                    "name": "百货行为设计",
                                    "data": {
                                        "type": "2",
                                    }
                                },
                                {
                                    "id": "a2",
                                    "name": "酒店行为设计",
                                    "data": {

                                        "type": "2",
                                    }
                                },
                                {
                                    "id": "a3",
                                    "name": "飞凡APP",
                                    "data": {

                                        "type": "2",
                                    }
                                },
                                {
                                    "id": "a4",
                                    "name": "飞凡订单",
                                    "data": {
                                        "type": "2",
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
}