import React from 'react';
import Ux from 'ux';
import {Button, Form, Icon, Upload} from "antd";
import Op from "../op";
import Ex from "ex";

const yiInternal = (reference) => {
    const state = {};
    Ux.raftForm(reference, {
        id: "Permission-Import",
        renders: {
            upload: (reference, jsx = {}) => {
                const {config = {}} = jsx;
                const {$files = []} = reference.state;
                return (
                    <Upload accept={".csv"}
                            fileList={$files}
                            beforeUpload={item => false}
                            multiple={false}
                            onChange={(changed) => {
                                const {fileList = [], file} = changed;
                                const singleFile = fileList[fileList.length - 1];
                                reference.setState({
                                    $files: [singleFile],
                                    $fileData: file,
                                });
                            }}
                            onRemove={() => {
                                reference.setState({
                                    $files: [],
                                    $fileData: undefined
                                });
                            }}>
                        <Button>
                            <Icon type={"upload"}/>
                            {config.button}
                        </Button>
                    </Upload>
                )
            }
        }
    }).then(raft => {
        state.raft = raft;
        state.$op = {
            $opSelect: Op.rxImport,
        }
        return Ux.promise(state);
    }).then(Ux.ready).then(Ux.pipe(reference));
}

@Ux.zero(Ux.rxEtat(require("../Cab"))
    .cab("UI.Import")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        yiInternal(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$inited = {}} = this.props;
            return Ux.aiForm(this, $inited);
        }, Ex.parserOfColor("FormPerm-Import").form())
    }
}

export default Form.create({})(Component)