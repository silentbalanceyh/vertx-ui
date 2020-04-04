import * as React from 'react';
import * as isArray from 'lodash/isArray';
import * as pick from 'lodash/pick';
import global from '../../common/global';
import {EditorEvent, GraphCommonEvent, RendererType} from '../../common/constants';
import {CommandEvent} from '../../common/interfaces';
import commandManager from '../../common/commandManager';
import {EditorContext, EditorContextProps, EditorPrivateContext, EditorPrivateContextProps,} from '../EditorContext';

interface EditorProps {
    style?: React.CSSProperties;
    event: any;
    className?: string;
    command?: any;
    [EditorEvent.onBeforeExecuteCommand]?: (e: CommandEvent) => void;
    [EditorEvent.onAfterExecuteCommand]?: (e: CommandEvent) => void;
}

interface EditorState extends EditorContextProps, EditorPrivateContextProps {
}

class Editor extends React.Component<EditorProps, EditorState> {
    static defaultProps = {
        [EditorEvent.onBeforeExecuteCommand]: () => {
        },
        [EditorEvent.onAfterExecuteCommand]: () => {
        },
    };
    lastMousedownTarget: HTMLElement | null = null;

    constructor(props: EditorProps) {
        super(props);

        this.state = {
            graph: null,
            setGraph: this.setGraph,
            executeCommand: this.executeCommand,
        };

        this.lastMousedownTarget = null;
    }

    static setTrackable(trackable: boolean) {
        global.trackable = trackable;
    }

    shouldTriggerShortcut(graph: G6.Graph, target: HTMLElement | null) {
        const renderer: RendererType = graph.get('renderer');
        const canvasElement = graph.get('canvas').get('el');

        if (!target) {
            return false;
        }

        if (target === canvasElement) {
            return true;
        }

        if (renderer === RendererType.Svg) {
            if (target.nodeName === 'svg') {
                return true;
            }

            let parentNode = target.parentNode;

            while (parentNode && parentNode.nodeName !== 'BODY') {
                if (parentNode.nodeName === 'svg') {
                    return true;
                } else {
                    parentNode = parentNode.parentNode;
                }
            }

            return false;
        }
    }

    bindEvent(graph: G6.Graph) {
        const {props} = this;

        graph.on<CommandEvent>(EditorEvent.onBeforeExecuteCommand, props[EditorEvent.onBeforeExecuteCommand]);
        graph.on<CommandEvent>(EditorEvent.onAfterExecuteCommand, props[EditorEvent.onAfterExecuteCommand]);
    }

    bindShortcut(graph: G6.Graph) {
        window.addEventListener(GraphCommonEvent.onMouseDown, e => {
            this.lastMousedownTarget = e.target as HTMLElement;
        });

        graph.on(GraphCommonEvent.onKeyDown, (e: any) => {
            if (!this.shouldTriggerShortcut(graph, this.lastMousedownTarget)) {
                return;
            }

            Object.values(commandManager.command).some(command => {
                const {name, shortcuts} = command;

                const flag = shortcuts.some((shortcut: string | string[]) => {
                    const {key} = e;

                    if (!isArray(shortcut)) {
                        return shortcut === key;
                    }
                    const switched: any = shortcut;
                    return switched.every((item, index) => {
                        if (index === shortcut.length - 1) {
                            return item === key;
                        }

                        return e[item];
                    });
                });

                if (flag) {
                    if (commandManager.canExecute(graph, name)) {
                        // Prevent default
                        e.preventDefault();

                        // Execute command
                        this.executeCommand(name);

                        return true;
                    }
                }

                return false;
            });
        });
    }

    setGraph = (graph: G6.Graph) => {
        this.setState({
            graph,
        });

        const {event} = this.props;
        if (event) {
            /* 如果存在 GEvent 则直接绑定当前 graph 到 GEvent 中*/
            event.onGraph(graph);
        }

        this.bindEvent(graph);
        this.bindShortcut(graph);
    };

    executeCommand = (name: string, params?: object) => {
        const {graph} = this.state;

        if (graph) {
            /* 传入数据，直接传入和 command 对应的相关数据信息 */
            const {command = {}} = this.props;
            const normalized: any = params ? params : {};
            if (command) {
                normalized.executor = command[name];
            }
            commandManager.execute(graph, name, normalized);
        }
    };

    render() {
        const {children} = this.props;
        const {graph, setGraph, executeCommand} = this.state;

        return (
            <EditorContext.Provider
                value={{
                    graph,
                    executeCommand,
                }}
            >
                <EditorPrivateContext.Provider
                    value={{
                        setGraph,
                    }}
                >
                    <div {...pick(this.props, ['className', 'style'])}>{children}</div>
                </EditorPrivateContext.Provider>
            </EditorContext.Provider>
        );
    }
}

export default Editor;
