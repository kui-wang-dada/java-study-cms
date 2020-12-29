<template>
  <div class="container">
    <srm-form
      v-model="detailForm"
      form-name="detailForm"
      :rules="rules"
      :reset-msg="false"
      :form-items="formItems"
      :inline="false"
      @submit="submit"
      class="my-form"
    ></srm-form>
  </div>
</template>
<script>
import { findArticleDownLoadById, updateArticleDownLoad, insertArticleDownLoad } from '@/api/resource';
import { statusMap } from 'assets/data-maps';
import detailMixin from '@/mixins/detailMixin';
export default {
  name: 'ResourceEdit',
  components: {},
  mixins: [detailMixin],
  data() {
    return {
      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'click' }],
        url: [{ required: true, message: '链接不能为空', trigger: 'click' }],
        state: [{ required: true, message: '请选择状态', trigger: 'click' }]
      },
      detailForm: {
        title: '',
        url: '',
        state: '',
        img: ''
      },
      formItems: [
        {
          tag: 'input',
          itemAttrs: {
            label: '资料标题',
            col: 18
          },
          attrs: {
            key: 'title',
            placeholder: '请输入标题'
          }
        },
        {
          tag: 'textarea',
          itemAttrs: {
            label: '资料链接',
            col: 18
          },
          attrs: {
            key: 'url',
            placeholder: '请输入资料链接'
          }
        },
        {
          tag: 'select',
          itemAttrs: {
            label: '资料状态',
            col: 18
          },
          attrs: {
            key: 'state',
            options: statusMap,
            placeholder: '请选择资料状态'
          }
        }
      ]
    };
  },
  computed: {
    submitFn() {
      return this.id ? updateArticleDownLoad : insertArticleDownLoad;
    }
  },
  mounted() {
    // 修改or添加
    this.id = (this.$route.params && this.$route.params.id) || null;
    if (this.id) {
      this.getDetail();
    }
  },
  methods: {
    async getDetail() {
      const { code, data } = await findArticleDownLoadById({ id: this.id });
      if (code === 0) {
        this.$set(this.detailForm, 'title', data.title);
        this.$set(this.detailForm, 'url', data.articleUrl);
        this.$set(this.detailForm, 'state', parseInt(data.state));
      } else {
        this.$router.back();
      }
    },
    async submit() {
      const data = Object.assign({}, this.detailForm);
      if (this.id) {
        data.id = this.id;
      }
      data.userId = '1338689902408613888';
      console.log(data, '----');
      const { code, msg } = await this.submitFn(data);
      if (code === 0) {
        this.$message.success(msg);
        this.goListWithRefresh('/resource/list');
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  .my-form {
    width: 650px;
  }

  /deep/ .el-textarea__inner {
    height: 85px;
    resize: none;
  }
}
</style>
