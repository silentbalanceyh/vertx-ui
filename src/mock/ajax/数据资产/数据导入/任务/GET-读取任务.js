export default {
    mock: true,
    data: {
        "runFreq": "YEAR",
        "subTasks": [
            {
                "isRun": false,
                "vector": [
                    {
                        "key": "7ab784e0-9f0f-46f4-9974-948bbb1f8bf6",
                        "source": [
                            "field11",
                            "field12"
                        ],
                        "target": "field12",
                        "runScript": "TEST"
                    },
                    {
                        "key": "56bf2344-a170-4edc-8599-7f035f8bf1b5",
                        "source": [
                            "field12"
                        ],
                        "target": "field11",
                        "runScript": "TEST2"
                    }
                ],
                "sourceKey": [
                    "table1",
                    "table2"
                ],
                "runCount": 0,
                "active": true,
                "targetKey": "table1",
                "target": "表名1",
                "language": "cn",
                "source": [
                    "表名1",
                    "表名2"
                ],
                "key": "31b1c012-d5c1-4a2e-9fab-756056f0abe7"
            }
        ],
        "runMode": "TIME",
        "startTime": [
            "2020-08-10T12:32:38.000Z"
        ],
        "taskName": "测试任务",
        "startDate": [
            "2020-08-11T11:32:40.831Z",
            "2020-08-20T11:32:43.209Z",
            "2020-08-23T11:32:45.654Z"
        ],
        "target": "数据库3",
        "taskDesc": "描述信息",
        "runTime": 3,
        "source": "数据库2",
        "id": "cd41ce8a-6156-480c-80db-40ae79514842"
    }
}