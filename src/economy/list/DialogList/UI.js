import React from 'react'
import Ux from 'ux';
import {_zero} from '../../_internal/index';
import Fn from '../../_internal/Ix.Fn';
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

    componentDidUpdate(prevProps, prevState) {
        // 连接Monitor专用
        Fn.M.monitorDialogList(this, prevState);
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
            const {$inited = {}, $addKey, ...rest} = this.props;
            /**
             * 计算初始化数据initData，
             **/
            const initData = Ux.itemInit(this);
            // 不点取消不可关闭
            dialog.maskClosable = false;
            const inherits = Ux.toLimitation(rest, Fn.Limit.DialogList.Shared);
            return (
                <div>
                    {/** 渲染添加按钮 **/}
                    {Render.renderHeader(this)}
                    {/** 渲染表单 **/}
                    <Table {...table} dataSource={data}/>
                    <DynamicDialog $dialog={dialog}
                                   $visible={show}>
                        {/** 只有editKey存在时渲染 **/}
                        {FormEdit ? (editKey && show ? (
                            <FormEdit {...inherits}
                                      key={`formEdit`}
                                      $inited={initData}
                                      $key={editKey}
                                      $parent={$inited}
                                      fnClose={Op.rxClose(this)}
                                      fnListItem={Op.rxList(this)}
                                      fnClear={Op.rxReset(this)}/>
                        ) : false) : false}
                        {/** 只有editKey为undefined时渲染 **/}
                        {FormAdd ? (!editKey && show ? (
                            <FormAdd {...inherits}
                                     key={"formAdd"}
                                     $inited={initData}
                                     $parent={$inited}
                                     $addKey={$addKey}
                                     fnClose={Op.rxClose(this)}
                                     fnListItem={Op.rxList(this)}
                                     fnClear={Op.rxReset(this)}/>
                        ) : false) : false}
                    </DynamicDialog>
                </div>
            )
        }
    }
}

export default Component