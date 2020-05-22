import Ux from 'ux';

export default {
    mock: true,
    data: [
        {
            "key": "mock_control",
            "text": "自定义控件",
            "uri": "EXPAND",
            "icon": "code-sandbox"
        },
        {
            "key": "mock_control_checkjson",
            "text": "元数据编辑器",
            "uri": "/economy/check-json",
            "parentId": "mock_control"
        }
    ],
    processor: (response, params) => {
        response.forEach(item => item.type = "SIDE-MENU");
        return Ux.promise(response);
    }
}