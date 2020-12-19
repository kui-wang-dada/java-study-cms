<template>
  <div>
    <srm-form
      v-model="detailForm"
      :rules="rules"
      form-name="detailForm"
      :reset-msg="false"
      :form-items="formItems"
      :inline="false"
      @submit="submit"
    ></srm-form>
  </div>
</template>
<script>
import { insertArticleLabel } from 'api/label';
import detailMixin from '@/mixins/detailMixin';
export default {
  name: 'ArticleEdit',
  components: {},
  mixins: [detailMixin],
  data() {
    return {
      rules: {
        labelName: [{ required: true, message: '标签不能为空', trigger: 'click' }]
      },
      detailForm: {},
      formItems: [
        {
          tag: 'input',
          itemAttrs: {
            label: '文章标签',
            col: 6
          },
          attrs: {
            key: 'labelName',
            placeholder: '请输入文章标签'
          }
        }
      ]
    };
  },
  computed: {
    // submitFn() {
    //   return this.id ? updateArticle : createArticle;
    // }
  },
  mounted() {
    // this.id = this.$route.params && this.$route.params.id || null
    // if (this.id) {
    //   this.getDetail()
    // }
  },
  methods: {
    // async getDetail() {
    //   const { code, data } = await fetchArticle(this.id);
    //   if (code === 20000) {
    //     Object.assign(this.detailForm, data);
    //   } else {
    //     this.$router.back();
    //   }
    // },
    async submit() {
      const data = Object.assign({}, this.detailForm);
      const { code, msg } = await insertArticleLabel(data);
      if (code === 0) {
        this.$message.success(msg);
        this.goListWithRefresh('/article/label');
      }
    }
  }
};
</script>
