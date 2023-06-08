import React from 'react';
import Ux from "ux";
import Ex from 'ex';
import {Col, Row} from 'antd';
import Rdr from './Web';

const componentInit = (reference) => {
    Ux.ajaxGet("/api/database").then(response => {
        const state = {};
        state.$ready = true;
        /*
         * atom
         * database
         * history
         * workflow
         */
        const database = Ux.fromHoc(reference, "database");
        const choice = Ux.fromHoc(reference, "choice");
        const {
            dbStatus, // 状态
            dbType,   // 类型
        } = choice;
        const $database = {};
        Object.keys(response).forEach(field => {
            const config = response[field];
            config.category = dbType[config.category];
            Object.assign(config, database[field]);
            if (config.jdbcUrl) {
                $database[field] = config;
                const iconKey = field.toUpperCase();
                $database[field].uiImage = Ux.Env.ICON_DATABASE[iconKey];
                $database[field].uiStatus = dbStatus["RUNNING"];
                $database[field].uiClass = "running";
            } else {
                $database[field] = config;
                $database[field].uiImage = Ux.Env.ICON_DATABASE.DISABLED;
                $database[field].uiStatus = dbStatus["DISABLED"];
                $database[field].uiClass = "disabled";
                $database[field].uiKo = true;
            }
        })
        state.$database = $database;
        // reference.?etState(state);
        Ux.of(reference).in(state).done();
    })
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.ylCard(this, () => {
            const {$database = {}} = this.state;
            const info = Ux.fromHoc(this, "info")
            return (
                <div className={"dx-database"}>
                    <Row>
                        <Col span={24} className={"ux_title"}>
                            {info.static}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            {Rdr.renderDatabase(this, $database.database)}
                        </Col>
                        <Col span={8}>
                            {Rdr.renderDatabase(this, $database.workflow)}
                        </Col>
                        <Col span={8}>
                            {Rdr.renderDatabase(this, $database.history)}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} className={"ux_title"}>
                            {info.dynamic}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={5}>
                            {Rdr.renderAtom(this, $database.atom)}
                        </Col>
                        <Col span={19}>
                            {Rdr.renderForm(this, $database.atom)}
                        </Col>
                    </Row>
                </div>
            )
        }, Ex.parserOfColor("Application.Database").toolkit())
    }
}

export default Component