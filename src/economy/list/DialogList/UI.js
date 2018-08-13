import React from 'react'
import Ux from 'ux';
import {_zero} from '../../_internal/index';
import {DataLabor} from 'entity';
import {DynamicDialog} from 'web'
import {Table} from 'antd';
import Op from './Op';
import Render from './UI.Render';

@_zero({
    connect: {
        s2p: state => DataLabor.createOut(state)
            .rework({
                "list": ["items"]
            })
            .to(),
    },
    op: {
        show: (reference) => (event) => {
            reference.set({"show": true})
        },
        hide: (reference) => (event) => {
            reference.set({"show": false})
        }
    },
    state: {
        show: undefined,
        editKey: undefined,
        connectKey: "",
    }
})
class Component extends React.PureComponent {
    componentDidMount() {
        const verified = Ux.verifySubList(this);
        if (verified) {
            this.setState({error: verified});
        }
    }

    render() {
        const {error} = this.state;
        if (error) {
            return Ux.fxError(error);
        } else {
            // 计算表格中的值
            const {table = {}, data = []} = Op.initTable(this);
            // 处理Columns
            const dialog = Op.initDialog(this);
            // 窗口的隐藏显示
            const {show, editKey} = this.state;
            const {$formAdd: FormAdd, $formEdit: FormEdit} = this.props;
            const {$inited, ...rest} = this.props;
            const initData = Op.calcInited(this, $inited.key);
            return (
                <div>
                    {/** 渲染添加按钮 **/}
                    {Render.renderHeader(this)}
                    {/** 渲染表单 **/}
                    <Table {...table} dataSource={data}/>
                    <DynamicDialog $dialog={dialog} $visible={show}>
                        {editKey ? (FormEdit ? (
                            <FormEdit {...rest} key={"formEdit"} $inited={initData}
                                      fnClose={Op.rxClose(this)} fnListItem={Op.rxList(this)}/>
                        ) : false) : (FormAdd ? (
                            <FormAdd {...rest} key={"formAdd"} $inited={initData}
                                     fnClose={Op.rxClose(this)} fnListItem={Op.rxList(this)}/>
                        ) : false)}
                    </DynamicDialog>
                </div>
            )
        }
    }
}

export default Component