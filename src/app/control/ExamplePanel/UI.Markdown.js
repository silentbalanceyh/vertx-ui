import React from 'react'
import {Table, Tabs} from "antd";
import {MarkdownViewer} from 'web';
import Ux from 'ux';

const {zero} = Ux;

const renderColumn = (columns = []) => columns.map(column => {

    return column;
});

const renderPage = (reference, markdown = {}) => {
    const {
        content, // Markdown内容
        ...rest // 其他配置
    } = markdown;
    // 表格数据信息
    const {$datalist = {}} = reference.props;
    const data = $datalist[rest.tab];
    const table = Ux.fromHoc(reference, "table");
    table.columns = renderColumn(table.columns);
    return (
        <Tabs.TabPane {...rest}>
            {Ux.auiTab(reference)
                .to(
                    <MarkdownViewer $source={content}/>,
                    <Table {...table} dataSource={data}/>
                )}
        </Tabs.TabPane>
    )
};

@zero(Ux.rxEtat(require("./Cab.json"))
    .cab("UI.Markdown")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const {$markdown = []} = this.props;
        if (0 < $markdown.length) {
            const key = $markdown[0].key;
            return (
                <Tabs className={"page-card-subtab"} tabPosition={"left"}
                      defaultActiveKey={key} size={"small"}>
                    {$markdown.map(markdown => renderPage(this, markdown))}
                </Tabs>
            )
        } else return false;
    }
}

export default Component