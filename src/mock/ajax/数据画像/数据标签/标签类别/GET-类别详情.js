import Ux from 'ux';

export default {
    mock: true,
    data: {
        "1": {
            id: "c1",
            name: "分类数据1",
            countCat: 3,
            countTag: 122,
            createBy: "user1",
            createTime: "2019-03-04 23:29:38",
            report: [
                {
                    type: '分类1-1',
                    value: 22,
                    key: "c11"
                },
                {
                    type: '分类1-2',
                    value: 27,
                    key: "c12"
                },
                {
                    type: '分类1-3',
                    value: 51,
                    key: "c13"
                }
            ]
        },
        "2": {
            id: "c2",
            name: "分类数据2",
            countCat: 2,
            countTag: 13,
            createBy: "user2",
            createTime: "2020-03-04 23:29:38",
            report: [
                {
                    type: '分类2-1',
                    value: 22,
                    key: "c11"
                },
                {
                    type: '分类2-2',
                    value: 78,
                    key: "c12"
                }
            ]
        }
    },
    processor: (response = {}, params = {}) => {
        const id = params.id;
        if (id.startsWith("c1")) {
            return Ux.promise(response[1]);
        } else {
            return Ux.promise(response[2]);
        }
    }
}