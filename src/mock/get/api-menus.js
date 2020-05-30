import Ux from 'ux';
import MenuControl from './menus/control.json';

export default {
    mock: true,
    data: [
        ...MenuControl,
        {
            "key": "mock_editor",
            "text": "编辑器",
            "uri": "EXPAND",
            "icon": "appstore"
        },
        {
            "key": "mock_editor_form",
            "text": "表单设计器",
            "uri": "/editor/form",
            "icon": "form",
            "parentId": "mock_editor"
        }
    ],
    processor: (response, params) => {
        response.forEach(item => item.type = "SIDE-MENU");
        return Ux.promise(response);
    }
}