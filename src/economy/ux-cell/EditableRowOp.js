import React from 'react'
import { Popconfirm } from 'antd';

class Component extends React.PureComponent {
    render() {
        const {$op, $editable} = this.props;
        const {
            fnEdit = () => {
            }, fnCancel = () => {
            }
        } = this.props;
        return ($editable ?
                (
                    <div className="editable-cell-input-wrapper">
                        <a>{ $op.apply.text }</a>
                        &nbsp;&nbsp;
                        <Popconfirm title={ $op.cancel.confirm }
                                    onConfirm={ fnCancel }>
                            <a href="">{ $op.cancel.text }</a>
                        </Popconfirm>
                    </div>
                ) :
                (
                    <div className="editable-cell-text-wrapper">
                        <a onClick={ fnEdit }>{ $op.edit.text }</a>
                        &nbsp;&nbsp;
                        <Popconfirm title={ $op.remove.confirm }>
                            <a href="">{ $op.remove.text }</a>
                        </Popconfirm>
                    </div>
                )
        )
    }
}

export default Component
