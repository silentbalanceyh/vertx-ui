import React from 'react';
import {LoadingContent} from "zi";
import Loadable from 'react-loadable';

export default (uiLoaded) => Loadable({
    loader: uiLoaded,
    loading: LoadingContent
})