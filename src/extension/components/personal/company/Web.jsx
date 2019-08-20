import {ExForm} from "ei";
import {PageCard} from "web";
import React from "react";

export default (reference, {
    form,
    actions,
}) => (
    <PageCard reference={reference}>
        <ExForm {...form} $height={"200px"}
                $actions={actions}/>
    </PageCard>
)