import Ux from 'ux';

export default {
    actions: {
        $opNext: (reference) => (params = {}) => {
            // 验证 subTasks
            if (!params['subTasks'] || 0 === params['subTasks'].length) {
                Ux.sexMessage(reference, "empty");
            } else {
                // 执行当前按钮操作
                const state = {};
                state.$dialogData = params;
                state.$dialogStep = 1;
                // 这里必须是 2，不是 1
                const ref = Ux.onReference(reference, 2);
                ref.setState(state);
            }
        },
        $opEdit: (reference) => (params = {}) => Ux.fn(reference).rxSubmit(params)
    }
}