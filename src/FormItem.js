import React from 'react';
import invariant from 'invariant';
import {Form as AntdForm} from 'antd';

const AntdFormItem = AntdForm.Item;

function intersperseSpace(list) {
    return list.reduce((current, item) => [...current, ' ', item], []).slice(1);
}

class FormItem extends React.PureComponent {

    static defaultProps = AntdFormItem.defaultProps

    static propTypes = AntdFormItem.propTypes

    getHelpMessage = (field) => {
        const {help} = this.props;
        if (help === undefined) {
            const {errors} = field;
            if (errors) {
                return intersperseSpace(
                    errors.map((e, index) => {
                        let node = null;

                        if (React.isValidElement(e)) {
                            node = e;
                        } else if (React.isValidElement(e.message)) {
                            node = e.message;
                        }

                        return node ? React.cloneElement(node, {key: index}) : e.message; // eslint-disable-line
                    }),
                );
            }
            return '';
        }
        return help;
    }

    getValidateStatus = (field, fieldMeta) => {
        if (field.validating) {
            return 'validating';
        }
        if (field.errors) {
            return 'error';
        }
        const fieldValue = 'value' in field ? field.value : fieldMeta.initialValue;
        if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
            return 'success';
        }
        return '';
    }

    isRequired = (fieldMeta) => {
        const {required} = this.props;
        if (required !== undefined) {
            return required;
        }
        const meta = fieldMeta || {};
        const validate = meta.validate || [];

        return validate
            .filter((item) => !!item.rules)
            .some((item) => {
                return item.rules.some((rule) => rule.required);
            });
    }

    render() {
        const {children, field: fieldProp} = this.props;

        let resetProps = {};

        if (fieldProp) {

            const {form, name: fieldName} = fieldProp;

            invariant(typeof form.getFieldDecorator === 'function', 'invalid FormItem props field.form');

            const {itemProps, field, fieldMeta} = form.getFormField(fieldName);

            itemProps.help = this.getHelpMessage(field);
            itemProps.required = this.isRequired(fieldMeta);
            itemProps.validateStatus = this.getValidateStatus(field, fieldMeta);

            resetProps = {
                ...itemProps
            };
        }

        resetProps = {
            ...resetProps,
            ...this.props
        }

        return (
            <AntdFormItem {...resetProps}>{children}</AntdFormItem>
        );
    }
}

export default FormItem;