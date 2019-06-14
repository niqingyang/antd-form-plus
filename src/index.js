import Form from './Form';
import FormItem from './FormItem';
import FormField from './FormField';

export {createFormField, formShape, createForm} from './rc-form';

export const FormProps = Form.propTypes;
export const FormItemProps = FormItem.propTypes;
export const FormFieldProps = FormField.propTypes;

export {FormComponentProps, FormCreateOption, ValidateCallback, ValidationRule} from 'antd/lib/form';

export default Form;