import React from 'react'
import Op from './Op'
import Ux from "ux";
import {Table} from 'antd';
import {PageCard} from "web";

class Component extends React.PureComponent {
    componentDidMount() {
        Op.initTable(this);
    }

    render() {
        const {children, reference} = this.props;
        const {table, data = []} = this.state ? this.state : {};
        if (table) {
            console.info(data);
            return (
                <PageCard reference={reference}>
                    {Ux.auiTab(reference).type("card")
                        .to(children, (
                            <Table {...table} dataSource={data}/>
                        ))}
                </PageCard>
            )
        } else return false;
    }
}

export default Component