import React from 'react';
import Ux from 'ux';
import Ex from "ex";
import {Select} from 'antd';
import Op from './Op';

@Ux.zero(Ux.rxEtat(require("../Cab"))
    .cab("UI.Tenant")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiTenant(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const info = Ux.fromHoc(this, "info");
            const {$options = []} = this.state;
            const {rxTenant} = this.props;
            return (
                <div>
                    {info.prefix}
                    <Select className={"tenant-select"} size={"small"}
                            onChange={rxTenant}>
                        {$options.map(option => {
                            const {key, name, value} = option;
                            return (
                                <Select.Option key={key} value={value ? value : key}>
                                    {name}
                                </Select.Option>
                            )
                        })}
                    </Select>
                </div>
            );
        }, Ex.parserOfColor("Ex").define())
    }
}

export default Component