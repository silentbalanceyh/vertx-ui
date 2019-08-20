import {LoadingAlert, PageCard} from "web";
import {ExForm} from "ei";
import Op from "./Op";
import React from "react";

export default (reference, {
    alert,
    form,
}) => (
    <PageCard reference={reference}>
        <LoadingAlert $alert={alert}
                      $icon={"warning"}
                      $type={"warning"}
                      $size={40}/>
        <ExForm {...form} $height={"200px"}
                $actions={Op.actions}/>
    </PageCard>
)