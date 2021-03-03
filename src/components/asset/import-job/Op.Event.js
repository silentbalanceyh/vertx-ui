import Ux from 'ux';
import {Dsl} from 'entity';
import {Of} from 'app';

const dataFlush = (reference, record = {}, key) => {
    let {$data = []} = reference.state;
    $data.reverse();
    Ux.elementSave($data, record, "id");
    $data.reverse();
    // 成功
    if (key) {
        Ux.sexMessage(reference, key);
    }
    return Ux.clone($data);
}

const dataAjax = (reference, promise, key) => (params = {}, state = {}) => {
    reference.setState({$submitting: true})
    Dsl.of(reference).bind(promise).ok(response => {
        const $data = dataFlush(reference, response, key);
        const updatedState = {
            ...state,
            $data,
        }
        return Ux.promise(updatedState);
    }).async(params);
}

export default {
    dataAjax,
    $opAdd: (reference) => (event) => {
        Ux.prevent(event);
        reference.setState({
            $inited: {},
            $visible: true,
            $dialogStep: 0,
        })
    },
    $opView: (reference) => (text, record) => {
        // 新界面
        Dsl.of(reference).bind(Of.apiTaskView).ok(response => {
            // 窗口
            // 窗口
            return Ux.promise({
                $dialogData: response,
                $visible: true,
                $dialogStep: 2,
            });
        }).async(record);
    },
    $opEdit: (reference) => (text, record) => {
        // 旧界面
        Dsl.of(reference).bind(Of.apiTaskView).ok(response => {
            // 窗口
            return Ux.promise({
                $dialogData: response,
                $visible: true,
                $dialogStep: 0,
            });
        }).async(record);
    },
    $opTurn: (reference) => (text, record) => {
        if ("STOP" === record.status) {
            // 启用
            dataAjax(reference, Of.apiTaskEnabled, "running")(record);
        } else {
            // 禁用
            dataAjax(reference, Of.apiTaskDisabled, "stop")(record);
        }
    },
    $opDelete: (reference) => (text, record) => {
        // 删除
        reference.setState({$submitting: true})
        Dsl.of(reference).bind(Of.apiTaskRemove).ok(response => {
            let {$data = []} = reference.state;
            $data = Ux.clone($data);
            $data = $data.filter(item => item.id !== response.id);
            return Ux.promise({$data});
        }).async(record);
    },
    $opRun: (reference) => (text, record) => {
        // 执行
        dataAjax(reference, Of.apiTaskRun, "manual")(record);
    }
}