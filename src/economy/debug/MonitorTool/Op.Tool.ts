import Ux from 'ux';

const initTool = (reference: any) => {
    const tool = Ux.fromHoc(reference, "tool");
    const buttons = [];
    Object.keys(tool)
        .filter(key => "string" === typeof tool[key])
        .forEach(key => {
            const button: any = {};
            button.key = key;
            button.icon = key;
            const literal = tool[key];
            const arr = literal.split(',');
            button.className = arr[1];
            button.tip = arr[0];
            // 事件
            button.onClick = (event) => {
                event.preventDefault();
                const state: any = {};
                state[`$${key}`] = true;
                reference.setState(state);
            };
            buttons.push(button);
        });
    return buttons.sort((left, right) => Ux.sorterAsc(left, right, "className"));
};

export default {
    initTool
}