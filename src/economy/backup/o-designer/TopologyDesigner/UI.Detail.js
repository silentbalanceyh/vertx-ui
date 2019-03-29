import React from 'react';
import {
    CanvasPanel,
    DetailPanel,
    EdgePanel,
    GroupPanel,
    MultiPanel,
    NodePanel,
} from 'gg-editor';

const renderDetail = (reference) => {
    const {$detail = {}} = reference.props;
    const {NodeDetail, EdgeDetail, GroupDetail, MultiDetail, CanvasDetail} = $detail;
    return (
        <DetailPanel className={"detail-panel"}>
            <NodePanel>
                <NodeDetail/>
            </NodePanel>
            <EdgePanel>
                <EdgeDetail/>
            </EdgePanel>
            <GroupPanel>
                <GroupDetail/>
            </GroupPanel>
            <MultiPanel>
                <MultiDetail/>
            </MultiPanel>
            <CanvasPanel>
                <CanvasDetail/>
            </CanvasPanel>
        </DetailPanel>
    );
};
export default {
    renderDetail
};