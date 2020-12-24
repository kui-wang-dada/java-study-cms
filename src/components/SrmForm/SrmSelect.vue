<template>
  <el-select v-bind="$attrs" :value="value" v-on="$listeners" :multiple="$attrs.multiple" :multiple-limit="5" filterable>
    <el-option v-for="item in $attrs.options" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>
<script>
export default {
  name: 'SrmSelect',
  props: {
    value: {
      type: [Number, String, Array],
      default: ''
    }
  }
};
</script>
