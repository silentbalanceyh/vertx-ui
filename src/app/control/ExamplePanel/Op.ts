import Ux from 'ux';

const setting = (reference: any) =>
    () => reference.setState({$drawer: true});
const thunderbolt = (reference: any) =>
    () => reference.setState({$connect: true});
const initDynamic = (reference: any) => {
    const ref = Ux.onReference(reference, 1);
    const {dynamic, tabs} = ref.state;
    const children = [];
    let jsx = [];
    if (dynamic) {
        const dynamicConfig = Ux.fromHoc(reference, "dynamic");
        Ux.itObject(dynamic, (field, value) => {
            const tab: any = {};
            tab.tab = dynamicConfig[field];
            tab.key = field;
            if (tabs) {
                tabs.push(field);
            }
            children.push(tab);
            // 处理render信息生成children
            jsx.push(() => value(ref));
        });
        reference.setState({tabs: {children, jsx, tabs}});
    }
};
export default {
    Tool: {
        setting
    },
    initDynamic
}