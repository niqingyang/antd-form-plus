import React from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import omit from 'lodash/omit';
import get from 'lodash/get';
import has from 'lodash/has';
import {FIELD_META_PROP, FIELD_DATA_PROP} from './constants';

class FormField extends React.PureComponent {

    static propTypes = {
        field: PropTypes.shape({
            form: PropTypes.object.isRequired,
            name: PropTypes.string.isRequired
        }).isRequired
    }

    getOnlyControl = () => {
        const {children} = this.props;
        return children;
    }

    getChildProp = (prop) => {
        const child = this.getOnlyControl();
        return child && child.props && child.props[prop];
    }

    getId = () => {
        return this.getChildProp('id');
    }

    getMeta = () => {
        return this.getChildProp(FIELD_META_PROP);
    }

    getField = () => {
        return this.getChildProp(FIELD_DATA_PROP);
    }

    render() {
        const {children, field: fieldProp} = this.props;

        invariant(fieldProp, 'FormField props field must be set');

        const {form, name: fieldName} = fieldProp;

        invariant(typeof form.getFieldDecorator === 'function', 'invalid FormField props field.form');

        const {fieldMeta} = form.getFormField(fieldName);

        const resetProps = {
            ...fieldMeta,
            ...omit(this.props, ['field'])
        }

        if (has(fieldMeta, 'props')) {
            children.props = {
                ...get(fieldMeta, 'props', {}),
                ...children.props
            }
        }

        return form.getFieldDecorator(fieldName, {
            ...resetProps,
        })(children);
    }
}

export default FormField;