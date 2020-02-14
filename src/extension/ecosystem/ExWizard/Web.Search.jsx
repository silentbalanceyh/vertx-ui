import React from 'react';
import {LoadingAlert} from 'web';
import Op from './Op';
import renderOp from './Web.Op';

export default (reference) => {
    const {$alert = {}} = reference.state;
    const {$form = {}} = reference.props;
    let Component = $form.FormSearch ? $form.FormSearch : false;
    return (
        <div>
            <LoadingAlert $alert={$alert}/>
            {Component ? (
                <Component rxFailure={Op.rxFailure(reference)}
                           rxSubmit={Op.rxSubmit(reference)}/>
            ) : false}
            {renderOp(reference)}
        </div>
    )
}