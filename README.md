# antd-form-plus

简化了一些 antd form 的开发，在兼容 antd form 的同时进行了一些增强

## Installation

```js
npm install --antd-form-plus
```


## Usage

### 支持根据定义好的 fields 进行渲染

定义 fields

- fields 中支持 FormItem 和 getFieldDecorator 的全部属性和参数，具体参数可以参考官方文档：https://ant.design/components/form-cn/#getFieldDecorator(id,-options)
- fields 中支持 errors，可以在初始是直接显示表单项的错误信息，再后面的验证后可以被覆盖
- fields 简化了 mapPropsToFields 的操作，无需通过 Form.createFormField() 对数据进行处理
- fields 支持 props 属性，可以为 FormField 中的表单项组件设置属性，但优先级比表单项组件标签上的属性低
- fields 支持 props 属性不建议设置 value 和 onChange，否则会收到 antd form 的 getFieldDecorator 的无情警告

```js
class demo {
    fields = {
            title: {
                value: '标题的初始值',
                label: intl.formatMessage({id: 'form.title.label'}),
                rules: [
                    {
                        required: true,
                        message: intl.formatMessage({id: 'validation.title.required'}),
                    },
                ],
                errors: [
                    {
                        message: '初始显示的错误信息'
                    }
                ],
                // 不要绑定 value 和 onChange 事件
                props: {
                    placeholder: '给目标起个名称吧'
                }
            },
            date: {
                value: [
                    moment('2019-01-01'),
                    moment('2019-03-01')
                ],
                label: intl.formatMessage({id: 'form.date.label'}),
                rules: [
                    {
                        required: true,
                        message: intl.formatMessage({id: 'validation.date.required'}),
                    }
                ]
            }
    }
}
```

- Form.create() 新增了 fields 参数，类似 mapPropsToFields 的方式从 redux 或 mobx 中获取到 store
- Form.create() 参数中 存在 mapPropsToFields 而不存在 fields 时，会自动根据 mapPropsToFields 的值转化为 fields
- 使用 FormField 替换了 getFieldDecorator()，会在 FormField 中根据其 field 属性去调用 getFieldDecorator 进行渲染
- FormItem 如果定义了 field={form.get(XXX)}，则会根据定义的属性进行渲染，但同时也支持在 FormItem 标签内直接定义属性，并且标签内的属性优先级最高
- FormField 必须指定属性 field={form.get('title')}，组件内部会调用 getFieldDecorator()
- form.get('XXX') 会返回 {form: form, name: 'XXX'} 格式的对象，建议使用 form.get('XXX')
- FormField 中必须并且有仅能有一个表单项，与 getFieldDecorator 的要求一致

```js
import {Form} from 'antd-form-plus'

const FormItem = Form.Item;
const FormField = Form.Field;

@Form.create({
    fields: ({demo}) => demo.fields
})
class BasicForms extends React.Component {
    
    handleSubmit = e => {
        const {dispatch, form} = this.props;
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // submit form
            }
        });
    };
    
    render(){
        
        const {form} = this.props;
        
        return (
            <Form onSubmit={this.handleSubmit} hideRequiredMark style={{marginTop: 8}}>
                <FormItem field={form.get('title')}>
                    <FormField field={form.get('title')} label='我的优先级更高'>
                        <Input placeholder='请输入标题'/>
                    </FormField>
                </FormItem>
                <FormItem field={form.get('date')}>
                    <FormField field={form.get('date')} rules={[{required: true, message: '我的优先级更高'}]}>
                        <RangePicker
                            style={{width: '100%'}}
                            placeholder={[
                                formatMessage({id: 'form.date.placeholder.start'}),
                                formatMessage({id: 'form.date.placeholder.end'}),
                            ]}
                        />
                    </FormField>
                </FormItem>
                <FormItem style={{marginTop: 32}}>
                    <Button type="primary" htmlType="submit">
                        <FormattedMessage id="form.submit"/>
                    </Button>
                    <Button style={{marginLeft: 8}}>
                        <FormattedMessage id="form.save"/>
                    </Button>                                            
                </FormItem>
            </Form>
        );
    }
}
```



## License

[MIT](http://opensource.org/licenses/MIT) Copyright (c) 2018 - forever Naufal Rabbani