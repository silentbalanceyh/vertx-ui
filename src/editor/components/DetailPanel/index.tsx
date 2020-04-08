import * as React from 'react';
import {getSelectedEdges, getSelectedNodes} from '../../utils';
import {EditorEvent, GraphState} from '../../common/constants';
import {EditorContextProps, withEditorContext} from '../EditorContext';
import {GraphStateEvent} from '../../common/interfaces';

type DetailPanelType = 'node' | 'edge' | 'multi' | 'canvas';

export interface DetailPanelComponentProps {
    type: DetailPanelType;
    nodes: G6.Node[];
    edges: G6.Edge[];
}

class DetailPanel {
    static create = function <P extends DetailPanelComponentProps>(type: DetailPanelType) {
        return function (WrappedComponent: React.ComponentType<P>) {
            type TypedPanelProps = EditorContextProps & Omit<P, keyof DetailPanelComponentProps>;
            type TypedPanelState = { graphState: GraphState };

            class TypedPanel extends React.Component<TypedPanelProps, TypedPanelState> {
                state = {
                    graphState: GraphState.CanvasSelected,
                };

                componentDidMount() {
                    const {graph} = this.props;

                    graph.on<GraphStateEvent>(EditorEvent.onGraphStateChange, ({graphState}) => {
                        this.setState({
                            graphState,
                        });
                    });
                }

                render() {
                    const {graph} = this.props;
                    const {graphState} = this.state;

                    if (graphState !== `${type}Selected`) {
                        return null;
                    }

                    const nodes = getSelectedNodes(graph);
                    const edges = getSelectedEdges(graph);

                    return <WrappedComponent type={type} nodes={nodes} edges={edges} {...(this.props as any)} />;
                }
            }

            return withEditorContext<TypedPanelProps>(TypedPanel);
        };
    };
}

export default DetailPanel;
