import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExForm} from "ei";
import Op from './Op';
import '../Cab.less';

import UILinker from '../web/UI.Linker';

@Ux.zero(Ux.rxEtat(require("../Cab.json"))
    .cab("UI.Page2.Step3")
    .to()
)
class Component extends React.PureComponent {

    render() {
        /*
         * 配置处理
         */
        const {
            $inited = {}, $mode = Ux.Env.FORM_MODE.ADD,
            $source = [], $target = [], $tableNames = []
        } = this.props;
        const formAttrs = Ex.yoAmbient(this);
        formAttrs.$inited = $inited;
        formAttrs.$mode = $mode;
        formAttrs.config = {form: Ux.fromHoc(this, "form")};
        formAttrs.$target = $target;
        formAttrs.$tableNames = $tableNames;
        return (
            <div className={"form-step3"}>
                <ExForm {...formAttrs} $height={"90px"}
                        $renders={{
                            modelRelation: (reference, jsx) => {
                                const {
                                    tableName,
                                    columns = [],
                                    relTableName,
                                    columnsRel = []
                                } = $inited;
                                const toSet = new Set(columns);
                                const fromSet = new Set(columnsRel);

                                const info = Ux.fromHoc(this, "info")

                                const to = {};
                                to.name = tableName;
                                to.info = info.to;
                                to.items = $source.filter(item => toSet.has(item.id));

                                const from = {};
                                from.name = relTableName;
                                from.info = info.from;
                                from.items = $target.filter(item => fromSet.has(item.id));
                                return (
                                    <UILinker {...jsx} reference={reference}
                                              $source={from} $target={to}/>
                                )
                            }
                        }}
                        $op={Op.actions}/>
            </div>
        )
    }
}

export default Component