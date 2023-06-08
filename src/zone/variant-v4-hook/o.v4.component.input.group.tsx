import classNames from 'classnames';
import * as React from 'react';
import {useContext, useMemo} from 'react';
import {ConfigContext} from 'antd/es/config-provider';
import type {FormItemStatusContextProps} from 'antd/es/form/context';
import {FormItemInputContext} from 'antd/es/form/context';
import useStyle from 'antd/es/input/style';

export interface GroupProps {
    className?: string;
    size?: 'large' | 'small' | 'default';
    children?: React.ReactNode;
    style?: React.CSSProperties;
    onMouseEnter?: React.MouseEventHandler<HTMLSpanElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLSpanElement>;
    onFocus?: React.FocusEventHandler<HTMLSpanElement>;
    onBlur?: React.FocusEventHandler<HTMLSpanElement>;
    prefixCls?: string;
    compact?: boolean;
}

const V4InputGroup: React.FC<GroupProps> = (props) => {
    const {getPrefixCls, direction} = useContext(ConfigContext);
    const {prefixCls: customizePrefixCls, className = ''} = props;
    const prefixCls = getPrefixCls('input-group', customizePrefixCls);
    const inputPrefixCls = getPrefixCls('input');
    const [wrapSSR, hashId] = useStyle(inputPrefixCls);
    const cls = classNames(
        prefixCls,
        {
            [`${prefixCls}-lg`]: props.size === 'large',
            [`${prefixCls}-sm`]: props.size === 'small',
            [`${prefixCls}-compact`]: props.compact,
            [`${prefixCls}-rtl`]: direction === 'rtl',
        },
        hashId,
        className,
    );

    const formItemContext = useContext(FormItemInputContext);

    const groupFormItemContext = useMemo<FormItemStatusContextProps>(
        () => ({
            ...formItemContext,
            isFormItemInput: false,
        }),
        [formItemContext],
    );

    return wrapSSR(
        <span className={cls}
              style={props.style}
              onMouseEnter={props.onMouseEnter}
              onMouseLeave={props.onMouseLeave}
              onFocus={props.onFocus}
              onBlur={props.onBlur}>
                <FormItemInputContext.Provider value={groupFormItemContext}>
                {props.children}
                </FormItemInputContext.Provider>
        </span>
    );
}

export default V4InputGroup;
