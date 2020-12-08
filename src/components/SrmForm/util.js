const componentMap = {
  input: {
    component: 'el-input',
    attrs: {
      placeholder: '请输入',
      clearable: true
    }
  },
  select: {
    component: 'srm-select', // 自定义组件,为了在el-select添加options能够生成el-options节点
    attrs: {
      placeholder: '请选择',
      clearable: true
    }
  },
  date: {
    component: 'el-date-picker',
    attrs: {
      placeholder: '选择日期',
      clearable: true,
      type: 'date',
      format: 'yyyy/MM/dd',
      'value-format': 'yyyy/MM/dd'
    }
  },
  radio: {
    component: 'srm-radio-group', // 自定义组件,为了在el-radio-group添加options能够生成el-radio节点
    value: [],
    attrs: {
      placeholder: '选择',
      clearable: true
    }
  },
  checkbox: {
    component: 'el-checkbox'
  },
  'checkbox-group': {
    component: 'srm-checkbox-group' // 同上
  },
  cascader: {
    component: 'el-cascader',
    attrs: {
      placeholder: '请选择',
      clearable: true
    }
  },
  textarea: {
    component: 'el-input',
    attrs: {
      type: 'textarea'
    }
  },
  'value-regio': {
    component: 'srm-value-regio'
  },
  'upload': {
    component: 'srm-upload'
  }
}

export function findItem(formItems, key) {
  return formItems.find(
    formItem => formItem.attrs && formItem.attrs.key === key
  )
}

export default componentMap
