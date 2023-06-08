import React from 'react';

import {LoadingContent, uca} from 'zi';
import {Button, Upload} from "antd";
import __Zn from '../zero.uca.dependency';

const yiInternal = (reference) => {
    const state = {};
    __Zn.raftForm(reference, {
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
                                // reference.?etState({
                                //     $files: [singleFile],
                                //     $fileData: file,
                                // });
                                __Zn.of(reference).in({
                                    $files: [singleFile],
                                    $fileData: file,
                                }).done()
                            }}
                            onRemove={() => {
                                // reference.?etState({
                                //     $files: [],
                                //     $fileData: undefined
                                // });
                                __Zn.of(reference).in({
                                    $files: [],
                                    $fileData: undefined
                                }).done()
                            }}>
                        <Button>
                            {__Zn.v4Icon("upload")}
                            {config.button}
                        </Button>
                    </Upload>
                );
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
                                __Zn.fn(reference).rxSubmit(raft);
                            } else {
                                __Zn.sexMessage(reference, "form");
                                __Zn.of(reference).load().done();
                                // reference.?etState({$submitting: false, $loading: false});
                            }
                        } catch (error) {
                            __Zn.sexMessage(reference, "format");
                            __Zn.of(reference).load().done();
                            // reference.?etState({$submitting: false, $loading: false});
                        }
                    }
                } else {
                    __Zn.sexMessage(reference, "empty");
                    __Zn.of(reference).load().done();
                    // reference.?etState({$submitting: false, $loading: false});
                }
            }
        }
        return __Zn.promise(state);
    }).then(__Zn.ready).then(__Zn.pipe(reference));
}

@uca({
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
                {__Zn.xtReady(this, () => __Zn.aiForm(this, $inited),
                    {component: LoadingContent}
                )}
            </div>
        );
    }
}

export default Component