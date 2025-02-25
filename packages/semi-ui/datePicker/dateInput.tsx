/* eslint-disable max-lines-per-function */
/* eslint-disable no-unused-vars */
import React from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import DateInputFoundation, {
    DateInputAdapter,
    DateInputFoundationProps,
    RangeType
} from '@douyinfe/semi-foundation/datePicker/inputFoundation';
import { cssClasses, strings } from '@douyinfe/semi-foundation/datePicker/constants';
import { noop } from '@douyinfe/semi-foundation/utils/function';
import isNullOrUndefined from '@douyinfe/semi-foundation/utils/isNullOrUndefined';
import BaseComponent, { BaseProps } from '../_base/baseComponent';
import Input from '../input/index';
import { IconCalendar, IconCalendarClock, IconClear } from '@douyinfe/semi-icons';
import { BaseValueType, ValueType } from '@douyinfe/semi-foundation/datePicker/foundation';

export interface DateInputProps extends DateInputFoundationProps, BaseProps {
    insetLabel?: React.ReactNode;
    prefix?: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
    onChange?: (value: string, e: React.MouseEvent<HTMLInputElement>) => void;
    onEnterPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.MouseEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.MouseEvent<HTMLInputElement>, rangeType?: RangeType) => void;
    onClear?: (e: React.MouseEvent<HTMLDivElement>) => void;
}


// eslint-disable-next-line @typescript-eslint/ban-types
export default class DateInput extends BaseComponent<DateInputProps, {}> {
    static propTypes = {
        onClick: PropTypes.func,
        onChange: PropTypes.func,
        onEnterPress: PropTypes.func,
        onBlur: PropTypes.func,
        onClear: PropTypes.func,
        onFocus: PropTypes.func,
        value: PropTypes.array,
        disabled: PropTypes.bool,
        type: PropTypes.oneOf(strings.TYPE_SET),
        multiple: PropTypes.bool,
        showClear: PropTypes.bool,
        format: PropTypes.string, // Attributes not used
        inputStyle: PropTypes.object,
        inputReadOnly: PropTypes.bool, // Text box can be entered
        insetLabel: PropTypes.node,
        validateStatus: PropTypes.string,
        prefix: PropTypes.node,
        prefixCls: PropTypes.string,
        dateFnsLocale: PropTypes.object.isRequired, // Foundation useful to
        placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        rangeInputFocus: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        rangeInputStartRef: PropTypes.object,
        rangeInputEndRef: PropTypes.object,
        rangeSeparator: PropTypes.string,
    };

    static defaultProps = {
        showClear: true,
        onClick: noop,
        onChange: noop,
        onEnterPress: noop,
        onBlur: noop,
        onClear: noop,
        onFocus: noop,
        multiple: false,
        type: 'date',
        inputStyle: {},
        inputReadOnly: false,
        prefixCls: cssClasses.PREFIX,
        rangeSeparator: strings.DEFAULT_SEPARATOR_RANGE,
    };
    foundation: DateInputFoundation;

    constructor(props: DateInputProps) {
        super(props);
        this.foundation = new DateInputFoundation(this.adapter);
    }

    get adapter(): DateInputAdapter {
        return {
            ...super.adapter,
            updateIsFocusing: isFocusing => this.setState({ isFocusing }),
            notifyClick: (...args) => this.props.onClick(...args),
            notifyChange: (...args) => this.props.onChange(...args),
            notifyEnter: (...args) => this.props.onEnterPress(...args),
            notifyBlur: (...args) => this.props.onBlur(...args),
            notifyClear: (...args) => this.props.onClear(...args),
            notifyFocus: (...args) => this.props.onFocus(...args),
            notifyRangeInputClear: (...args) => this.props.onRangeClear(...args),
            notifyRangeInputFocus: (...args) => this.props.onFocus(...args),
            notifyTabPress: (...args) => this.props.onRangeEndTabPress(...args),
        };
    }

    componentDidMount() {
        this.foundation.init();
    }

    componentWillUnmount() {
        this.foundation.destroy();
    }

    formatText(value: ValueType) {
        // eslint-disable-next-line max-len
        return value && (value as BaseValueType[]).length ? this.foundation.formatShowText(value as BaseValueType[]) : '';
    }

    handleChange = (value: string, e: React.ChangeEvent<HTMLInputElement>) => this.foundation.handleChange(value, e);

    handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => this.foundation.handleInputComplete(e);

    handleInputClear = (e: React.MouseEvent<HTMLDivElement>) => this.foundation.handleInputClear(e);

    handleRangeInputChange = (rangeStart: string, rangeEnd: string, e: React.ChangeEvent) => {
        const rangeInputValue = this.getRangeInputValue(rangeStart, rangeEnd);
        this.foundation.handleChange(rangeInputValue, e);
    };

    handleRangeInputClear: React.MouseEventHandler<HTMLDivElement> = e => {
        this.foundation.handleRangeInputClear(e);
    };

    handleRangeInputEnterPress = (e: React.KeyboardEvent<HTMLInputElement>, rangeStart: string, rangeEnd: string) => {
        const rangeInputValue = this.getRangeInputValue(rangeStart, rangeEnd);
        this.foundation.handleRangeInputEnterPress(e, rangeInputValue);
    };

    handleRangeInputEndKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        this.foundation.handleRangeInputEndKeyPress(e);
    };

    handleRangeInputFocus = (e: React.MouseEvent<HTMLElement>, rangeType: RangeType) => {
        this.foundation.handleRangeInputFocus(e, rangeType);
    };

    handleRangeStartFocus: React.MouseEventHandler<HTMLElement> = e => {
        this.handleRangeInputFocus(e, 'rangeStart');
    };

    getRangeInputValue = (rangeStart: string, rangeEnd: string) => {
        const { rangeSeparator } = this.props;
        const rangeInputValue = `${rangeStart}${rangeSeparator}${rangeEnd}`;
        return rangeInputValue;
    };

    renderRangePrefix() {
        const { prefix, insetLabel, prefixCls, disabled, rangeInputFocus } = this.props;
        const labelNode = prefix || insetLabel;
        return labelNode ? (
            <div
                className={`${prefixCls}-range-input-prefix`}
                onClick={e => !disabled && !rangeInputFocus && this.handleRangeStartFocus(e)}
            >
                {labelNode}
            </div>
        ) : null;
    }

    renderRangeSeparator(rangeStart: string, rangeEnd: string) {
        const { disabled, rangeSeparator } = this.props;
        const separatorCls = cls({
            [`${cssClasses.PREFIX}-range-input-separator`]: true,
            [`${cssClasses.PREFIX}-range-input-separator-active`]: (rangeStart || rangeEnd) && !disabled,
        });
        return (
            <span onClick={e => !disabled && this.handleRangeStartFocus(e)} className={separatorCls}>
                {rangeSeparator}
            </span>
        );
    }

    renderRangeClearBtn(rangeStart: string, rangeEnd: string) {
        const { showClear, prefixCls, disabled } = this.props;
        const allowClear = (rangeStart || rangeEnd) && showClear;
        return allowClear && !disabled ? (
            <div
                className={`${prefixCls}-range-input-clearbtn`}
                onMouseDown={e => !disabled && this.handleRangeInputClear(e)}>
                <IconClear />
            </div>
        ) : null;
    }

    renderRangeSuffix(suffix: React.ReactNode) {
        const { prefixCls, disabled, rangeInputFocus } = this.props;
        const rangeSuffix = suffix ? (
            <div
                className={`${prefixCls}-range-input-suffix`}
                onClick={e => !disabled && !rangeInputFocus && this.handleRangeStartFocus(e)}
            >
                {suffix}
            </div>
        ) : null;
        return rangeSuffix;
    }

    renderRangeInput(rangeProps: DateInputProps) {
        const {
            // this.props
            placeholder,
            inputStyle,
            disabled,
            inputReadOnly,
            autofocus,
            size,
            // compute props
            text,
            suffix,
            inputCls,
            // range only props
            rangeInputStartRef,
            rangeInputEndRef,
            rangeInputFocus,
            prefixCls,
            rangeSeparator,
        } = rangeProps;

        const [rangeStart, rangeEnd = ''] = text.split(rangeSeparator) || [];
        const rangeSize = size === 'large' ? 'default' : 'small';
        const rangePlaceholder = Array.isArray(placeholder) ? placeholder : [placeholder, placeholder];
        const [rangeStartPlaceholder, rangeEndPlaceholder] = rangePlaceholder;
        const inputLeftWrapperCls = cls(`${prefixCls}-range-input-wrapper-start`, `${prefixCls}-range-input-wrapper`, {
            [`${prefixCls}-range-input-wrapper-active`]: rangeInputFocus === 'rangeStart',
            [`${prefixCls}-range-input-wrapper-start-with-prefix`]: this.props.prefix || this.props.insetLabel
        });
        const inputRightWrapperCls = cls(`${prefixCls}-range-input-wrapper-end`, `${prefixCls}-range-input-wrapper`, {
            [`${prefixCls}-range-input-wrapper-active`]: rangeInputFocus === 'rangeEnd'
        });
        return (
            <>
                {this.renderRangePrefix()}
                <div
                    onClick={e => !disabled && this.handleRangeInputFocus(e, 'rangeStart')}
                    className={`${inputCls} ${inputLeftWrapperCls}`}
                >
                    <Input
                        size={rangeSize}
                        style={inputStyle}
                        disabled={disabled}
                        readonly={inputReadOnly}
                        placeholder={rangeStartPlaceholder}
                        value={rangeStart}
                        // range input onBlur function is called when panel is closed
                        // onBlur={noop}
                        onChange={(rangeStartValue, e) => this.handleRangeInputChange(rangeStartValue, rangeEnd, e)}
                        onEnterPress={e => this.handleRangeInputEnterPress(e, rangeStart, rangeEnd)}
                        onFocus={e => this.handleRangeInputFocus(e as any, 'rangeStart')}
                        autofocus={autofocus} // autofocus moved to range start
                        ref={rangeInputStartRef}
                    />
                </div>
                {this.renderRangeSeparator(rangeStart, rangeEnd)}
                <div
                    className={`${inputCls} ${inputRightWrapperCls}`}
                    onClick={e => !disabled && this.handleRangeInputFocus(e, 'rangeEnd')}
                >
                    <Input
                        size={rangeSize}
                        style={inputStyle}
                        disabled={disabled}
                        readonly={inputReadOnly}
                        placeholder={rangeEndPlaceholder}
                        value={rangeEnd}
                        // range input onBlur function is called when panel is closed
                        // onBlur={noop}
                        onChange={(rangeEndValue, e) => this.handleRangeInputChange(rangeStart, rangeEndValue, e)}
                        onEnterPress={e => this.handleRangeInputEnterPress(e, rangeStart, rangeEnd)}
                        onFocus={e => this.handleRangeInputFocus(e as any, 'rangeEnd')}
                        onKeyDown={this.handleRangeInputEndKeyPress} // only monitor tab button on range end
                        ref={rangeInputEndRef}
                    />
                </div>
                {this.renderRangeClearBtn(rangeStart, rangeEnd)}
                {this.renderRangeSuffix(suffix)}
            </>
        );
    }

    render() {
        const {
            placeholder,
            type,
            value,
            inputValue,
            inputStyle,
            disabled,
            showClear,
            inputReadOnly,
            insetLabel,
            validateStatus,
            block,
            prefixCls,
            dateFnsLocale, // No need to pass to input
            onBlur,
            onClear,
            onFocus,
            prefix,
            autofocus,
            size,
            // range input support props, no need passing to not range type
            rangeInputStartRef,
            rangeInputEndRef,
            onRangeClear,
            onRangeBlur,
            onRangeEndTabPress,
            rangeInputFocus,
            rangeSeparator,
            ...rest
        } = this.props;
        const dateIcon = <IconCalendar />;
        const dateTimeIcon = <IconCalendarClock />;
        const suffix = type.includes('Time') ? dateTimeIcon : dateIcon;
        let text = '';

        if (!isNullOrUndefined(inputValue)) {
            text = inputValue;
        } else if (value) {
            text = this.formatText(value);
        }

        const inputCls = cls({
            [`${prefixCls}-input-readonly`]: inputReadOnly,
        });

        const isRangeType = /range/i.test(type);
        const rangeProps = { ...this.props, text, suffix, inputCls };

        return isRangeType ? (
            this.renderRangeInput(rangeProps)
        ) : (
            <Input
                {...rest}
                insetLabel={insetLabel}
                disabled={disabled}
                readonly={inputReadOnly}
                className={inputCls}
                style={inputStyle}
                hideSuffix={showClear}
                placeholder={placeholder}
                onEnterPress={this.handleEnterPress}
                onChange={this.handleChange}
                onClear={this.handleInputClear}
                suffix={suffix}
                showClear={showClear}
                value={text}
                validateStatus={validateStatus}
                prefix={prefix}
                autofocus={autofocus}
                size={size}
                onBlur={onBlur as any}
                onFocus={onFocus as any}
            />
        );
    }
}
