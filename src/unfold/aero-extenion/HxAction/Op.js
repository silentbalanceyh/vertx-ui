import Ux from 'ux';
import BpmnJs from 'bpmn-js';
import __Zn from '../zero.aero.dependency';
import __Aop from './Op.Aop';

const addMarker = (canvas, task, prefix = 'ux_bpmn_hover') => {
    try {
        canvas['addMarker'](task, prefix);
    } catch (e) {
    }
}
const removeMarker = (canvas, task) => {
    try {
        canvas['removeMarker'](task, "ux_bpmn_hover");
        canvas['removeMarker'](task, "ux_bpmn_selected");
    } catch (e) {
    }
}
const clearMarker = (canvas, editor, reference) => {
    const elementRegistry = editor.get('elementRegistry');
    const {$node} = reference.state ? reference.state : {};
    elementRegistry
        .filter(element => EVENT_ACT.includes(element.type))
        .filter(element => {
            if ($node) {
                return $node.event !== element.id;
            } else return true;
        })
        .forEach(element => removeMarker(canvas, element.id))
}
const doSelected = (element, reference) => {
    const $selected = {};
    $selected.event = element.id;
    const busObj = element.businessObject;
    if (busObj) {
        $selected.name = busObj.name ? busObj.name.replace(/\n/g, "") : undefined;
    }
    /*
     * $keySet          ->
     * $keyDefault      ->
     */
    const state = {$node: $selected};
    __Zn.aclRegionInit(reference, {
        // Filter $keySet
        preFn: (source = []) => source.filter(item => element.id === item.event),
        // Default Value Apply
        keyFn2: __Aop.keyFn2,   // __Zn.aclE.rxSetFn
    }, state).then((response) => {
        Object.assign(state, response);
        Ux.of(reference).in(state).done();
        // reference.?etState(state);
    });
}
const yoData = (reference, event) => {
    const {data = []} = reference.props;
    return data
        .filter(each => event === each.event)
        .sort(Ux.sorterAscTFn('uiSort'))
}
const EVENT_ACT = [
    'bpmn:StartEvent',
    'bpmn:UserTask'
]
const componentBpmn = () => new BpmnJs({
    // customize text
    textRenderer: {
        defaultStyle: {
            fontSize: '14px'
        }
    }
})
// Init
const componentInit = (reference) => {
    Ux.dgAdmit(reference.props, "HxAction", true, {color: "#1C86EE"});
    const {$bpmn} = reference.props;
    const editor = componentBpmn();
    editor.importXML($bpmn).then(response => {
        const {warnings = []} = response;
        if (0 !== warnings.length) {
            return;
        }
        const state = {};
        // 事件处理
        const stateEditor = onEvent(editor, reference);
        Object.assign(state, stateEditor);

        Ux.of(reference).in(state).done();
        // reference.?etState(state);
        Ux.dgAdmit(reference.state, "HxAction", false, {color: "#1C86EE"});
    });
    editor.attachTo("#bpmnAction");
}
const onEvent = (editor, reference) => {
    // 自适应画布流程图代码
    const canvas = editor.get('canvas');
    canvas.zoom('fit-viewport');

    const eb = editor.get('eventBus');
    // onClick Event Processing
    eb.on('element.click', event => {
        const element = event.element;
        const {type} = element;
        if (EVENT_ACT.includes(type)) {
            // 先选中
            doSelected(element, reference);
            // StartEvent, UserEvent, 清除颜色
            clearMarker(canvas, editor, reference);
            // 追加选中颜色
            addMarker(canvas, element.id, "ux_bpmn_selected");
        }
    })

    // onHover Event Processing
    eb.on('element.hover', event => {
        const element = event.element;
        const {type} = element;
        clearMarker(canvas, editor, reference);
        // Other Event Hover
        if (EVENT_ACT.includes(type)) {
            // 追加选中颜色
            addMarker(canvas, element.id)
        }
    });
    // Bind Once
    const {$editorRef} = reference.state ? reference.state : {};
    const state = {};
    if (!$editorRef) {
        state.$editorRef = editor;
    }
    state.$node = undefined;
    return state;
}
const componentEditor = (reference, virtual = {}) => {
    const {$bpmn} = reference.props;
    const {$editorRef} = reference.state;
    const $bpmnPre = virtual.props.$bpmn;
    if ($bpmn !== $bpmnPre && $editorRef) {
        return new Promise((resolve) => {
            $editorRef.clear();
            $editorRef.importXML($bpmn).then(response => {
                const {warnings = []} = response;
                if (0 !== warnings.length) {
                    return;
                }
                // 事件处理
                const state = {};
                const stateEditor = onEvent($editorRef, reference);
                Object.assign(state, stateEditor);
                Ux.dgAdmit(reference.state, "HxAction", false, {color: "#1C86EE"});
                resolve(state);
            });
        });
    } else return Ux.promise({})
}
export default {
    yoData,
    onEvent,
    componentInit,
    componentUp: (reference, virtual = {}) =>
        __Zn.aclChildUp(reference, virtual, componentEditor)
}