import React from 'react';
import Ux from "ux";
import {Button, Card, Table} from 'antd';
import Ex from "ex";
import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "MyTodo";
const renderExtra = (reference, extra = {}) => {
    const {text, route, ...rest} = extra;
    if (rest.icon) {
        rest.icon = Ux.v4Icon(rest.icon);
    }
    return (
        <Button {...rest} onClick={(event) => {
            Ux.prevent(event);
            if (route) {
                Ux.toRoute(reference, route);
            }
        }}>
            {text}
        </Button>
    )
}

const renderTable = (reference) => {
    const {$data = []} = reference.state;
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

const componentInit = (reference) => {
    Ex.yiAssist(reference).then(state => {
        const {$app} = reference.props;
        const sigma = $app._("sigma");
        const user = Ux.isLogged();
        Ux.ajaxPost("/api/up/flow-queue", {
            criteria: {
                "": true,
                sigma,
                acceptedBy: user.key,
            },
            pager: {
                page: 1,
                size: 5
            }
        }).then(response => {
            state.$data = Ux.valueArray(response);
            return Ux.promise(state);
        }).then(Ux.ready).then(Ux.pipe(reference))
    })
}


@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        componentInit(this)
    }

    render() {
        return Ex.yoRender(this, () => {
            const card = Ux.fromHoc(this, "card");
            return (
                <div {...Sk.mixMy(UCA_NAME)}>
                    <Card title={card.title}
                          className={"ux_card"}
                          extra={renderExtra(this, card.extra)}>
                        {renderTable(this)}
                    </Card>
                </div>
            )
        }, Ex.parserOfColor(UCA_NAME).container());
    }
}

export default Component