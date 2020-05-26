import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import Op from './Op';
import {FormDesigner} from 'web';
import Mock from 'mock';

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.ylCard(this, () => {
            const {$data = {}, $model = {}} = this.state;
            return (
                <FormDesigner config={$data}
                              rxType={input => {
                                  Ux.dgDebug({
                                      input,
                                  }, "数据源参数：", "red")
                                  const data = Mock.Editor.dict[input.type];
                                  return Ux.promise(data ? data : [])
                              }}
                              rxApi={input => {
                                  Ux.dgDebug({
                                      input,
                                  }, "搜索参数：", "red")
                                  const response = Mock.Editor.assist;
                                  return Ux.promise(response.list)
                              }} $models={$model}/>
            );
        }, Ex.parserOfColor("PxFormEditor").page())
    }
}

export default Component