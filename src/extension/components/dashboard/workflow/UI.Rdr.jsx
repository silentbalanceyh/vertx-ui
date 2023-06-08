import Ux from "ux";
import {Table} from "antd";
import React from "react";

export default (reference, $data = []) => {
    let table = Ux.fromHoc(reference, "table");
    table.columns = Ux.configColumn(reference, table.columns);
    table.columns.forEach(column => {
        if ("link" === column.dataIndex) {
            column.render = (text, record = {}) => {
                return (
                    // eslint-disable-next-line
                    <a href={"#"} onClick={event => {
                        Ux.prevent(event);
                        // 根据 flowInstanceId 读取 workflow
                        const name = record.flowDefinitionKey;
                        const {$router} = reference.props;
                        const target = $router.path()
                        Ux.toRoute(reference, `/workflow/run`, {
                            name, _tid: record.key,
                            target,
                        });
                    }}>
                        {record.icon ? Ux.v4Icon(record.icon) : false}
                        &nbsp;&nbsp;
                        {record.name}
                    </a>
                );
            }
        }
        if ("user" === column.dataIndex) {
            const userConfig = Ux.fromHoc(reference, "user");
            column.render = (text, record = {}) => {
                const user = Ux.isLogged();
                let splitted = [];
                if (user.key === record['acceptedBy']) {
                    splitted = userConfig['acceptedBy'].split(',');
                } else if (user.key === record['openBy']) {
                    splitted = userConfig['openBy'].split(',');
                }
                return (
                    <span>
                        {Ux.v4Icon("user", {
                            style: {
                                color: splitted[1],
                                fontSize: 14
                            }
                        })}
                        &nbsp;&nbsp;
                        {splitted[0]}
                    </span>
                );
            }
        }
    })
    table.className = "ux_table";
    return (
        <Table {...table} dataSource={$data}/>
    )
}