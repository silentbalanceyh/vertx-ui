import React from 'react';
import {component} from "../../../_internal";
import LoadingContent from "../../../loading/LoadingContent/UI";
import Ux from 'ux';
import {Button, Form, Icon, Upload} from "antd";

const yiInternal = (reference) => {
    const state = {};
    Ux.raftForm(reference, {
        id: "SubForm-Import", renders: {
            upload: (reference, jsx = {}) => {
                const {config = {}} = jsx;
                const {$files = []} = reference.state;
                return (
                    <Upload accept={".json"}
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
            $opSaveImport: (reference) => (params = {}) => {
                const {$fileData} = reference.state;
                if ($fileData) {
                    const reader = new FileReader();
                    reader.readAsText($fileData);
                    reader.onload = function () {
                        const content = reader.result;
                        try {
                            const parsed = JSON.parse(content);
                            if (parsed._form) {
                                /* raft */
                                const raft = parsed._form;
                                Ux.fn(reference).rxSubmit(raft);
                            } else {
                                Ux.sexMessage(reference, "form");
                                reference.setState({$submitting: false, $loading: false});
                            }
                        } catch (error) {
                            Ux.sexMessage(reference, "format");
                            reference.setState({$submitting: false, $loading: false});
                        }
                    }
                } else {
                    Ux.sexMessage(reference, "empty");
                    reference.setState({$submitting: false, $loading: false});
                }
            }
        }
        return Ux.promise(state);
    }).then(Ux.ready).then(Ux.pipe(reference));
}

@component({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Sub.Import",
})
class Component extends React.PureComponent {
    componentDidMount() {
        yiInternal(this);
    }

    render() {
        const {$inited = {}} = this.props;
        return (
            <div className={"viewer-layout"}>
                {Ux.xtReady(this, () => Ux.aiForm(this, $inited),
                    {component: LoadingContent}
                )}
            </div>
        );
    }
}

export default Form.create({})(Component)