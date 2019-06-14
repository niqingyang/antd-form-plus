import React from 'react';
import {Form as AntdForm} from 'antd';
import createDOMForm from './rc-form/createDOMForm';
import createFormField from './rc-form/createFormField';
import FormItem from './FormItem';
import FormField from './FormField';
import {FIELD_META_PROP, FIELD_DATA_PROP} from './constants';
import styles from 'antd/lib/form/style/index.less';

class Form extends React.PureComponent {
    static defaultProps = AntdForm.defaultProps

    static propTypes = AntdForm.propTypes

    static Item = FormItem;

    static Field = FormField;

    static createFormField = createFormField;

    static create = function (options = {}) {
        return createDOMForm({
            fieldNameProp: 'id',
            ...options,
            fieldMetaProp: FIELD_META_PROP,
            fieldDataProp: FIELD_DATA_PROP,
        });
    };

    render() {
        const {children} = this.props;
        return (
            <AntdForm {...this.props}>{children}</AntdForm>
        );
    }
}

export default Form;