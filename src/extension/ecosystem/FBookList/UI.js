import React from 'react';
import Ux from "ux";
import Ex from 'ex';
import {Table} from "antd";
import {Dialog} from "web";
import FBookView from '../FBookView/UI';

const UCA_NAME = "FBookList";
const mountOp = (reference, columns = []) => {
    const columnTo = Ux.configColumn(reference, columns);
    columnTo.forEach(column => {
        if ("key" === column.dataIndex) {
            column.render = (key) => {
                const {config = {}} = column;
                return (
                    // eslint-disable-next-line
                    <a href={""} onClick={event => {
                        Ux.prevent(event);
                        // 提取数据
                        Ux.ajaxGet("/api/fm-book/:key", {key}).then($inited => {
                            Ux.of(reference).in({
                                $inited
                            }).open().done();
                            // reference.?etState({$visible: true, $inited})
                        })
                    }}>
                        {Ux.v4Icon(config.icon)}&nbsp;&nbsp;
                        {config.text}
                    </a>
                );
            }
        }
    });
    return columnTo;
}

const renderView = (reference) => {
    const window = Ux.fromHoc(reference, "window");
    const config = Ux.configDialog(reference, window);
    const {$visible = false, $inited = {}} = reference.state;
    const inherit = Ex.yoAmbient(reference);
    return (
        <Dialog className={"ux_dialog"}
                size={"small"}
                $visible={$visible}
                $dialog={config}>
            <FBookView {...inherit} $inited={$inited}/>
        </Dialog>
    )
}

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    render() {
        let table = Ux.fromHoc(this, "table");
        table = Ux.clone(table);
        table.columns = mountOp(this, table.columns);

        const {$inited = []} = this.props;
        let dataSource = Ux.clone($inited);
        Ux.configScroll(table, dataSource, this);
        dataSource = dataSource.sort(Ux.sorterAscFn('serial'))
        return (
            <div>
                <Table {...table} dataSource={dataSource}/>
                {renderView(this)}
            </div>
        )
    }
}

export default Component