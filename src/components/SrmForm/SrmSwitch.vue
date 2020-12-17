<template>
  <el-switch v-bind="$attrs" v-model="value" v-on="$listeners"></el-switch>
</template>
<script>
export default {
  name: "SrmSelect",
  props: {
    value: {
      type: [Boolean],
      default: false
    }
  }
};
</script>
