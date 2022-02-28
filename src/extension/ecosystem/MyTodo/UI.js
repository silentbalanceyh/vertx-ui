import React from 'react';
import Ux from "ux";
import {Button, Card, Icon, Table} from 'antd';
import Ex from "ex";
import './Cab.less';
import Ch from "../../library/channel";

const renderExtra = (reference, extra = {}) => {
    const {text, route, ...rest} = extra;
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
                        {record.icon ? (
                            <Icon type={record.icon}/>
                        ) : false}
                        &nbsp;&nbsp;
                        {record.name}
                    </a>
                )
            }
        }
        if ("user" === column.dataIndex) {
            const userConfig = Ux.fromHoc(reference, "user");
            column.render = (text, record = {}) => {
                const user = Ux.isLogged();
                let splitted = [];
                if (user.key === record['toUser']) {
                    splitted = userConfig['toUser'].split(',');
                } else if (user.key === record['openBy']) {
                    splitted = userConfig['openBy'].split(',');
                }
                return (
                    <span>
                        <Icon type={"user"} style={{
                            color: splitted[1],
                            fontSize: 14
                        }}/>
                        &nbsp;&nbsp;
                        {splitted[0]}
                    </span>
                )
            }
        }
    })
    table.className = "web-table";
    return (
        <Table {...table} dataSource={$data}/>
    )
}

const componentInit = (reference) => {
    Ch.yiAssist(reference).then(state => {
        const {$app} = reference.props;
        const sigma = $app._("sigma");
        Ux.ajaxPost("/api/up/flow-queue", {
            criteria: {
                sigma,
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
    .cab("MyTodo")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this)
    }

    render() {
        return Ex.yoRender(this, () => {
            const card = Ux.fromHoc(this, "card");
            return (
                <Card title={card.title} className={`${Ux.Env.ECONOMY.CARD_CONTAINER} ex-board`}
                      extra={renderExtra(this, card.extra)}>
                    {renderTable(this)}
                </Card>
            )
        }, Ex.parserOfColor("TxBoard").container());
    }
}

export default Component