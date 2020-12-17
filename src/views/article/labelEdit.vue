<template>
  <div>
    <srm-form
      v-model="detailForm"
      form-name="detailForm"
      :reset-msg="false"
      :form-items="formItems"
      :inline="false"
      @submit="submit"
    >
    </srm-form>
  </div>
</template>
<script>
import { insertArticleLabel } from "api/label";
import { statusMap } from "assets/data-maps";
import detailMixin from "@/mixins/detailMixin";
export default {
  name: "ArticleEdit",
  components: {},
  mixins: [detailMixin],
  data() {
    return {
      detailForm: {},
      formItems: [
        {
          tag: "input",
          itemAttrs: {
            label: "文章标签",
            col: 6
          },
          attrs: {
            key: "author",
            placeholder: "请输入文章标签"
          }
        }
      ]
    };
  },
  computed: {
    submitFn() {
      return this.id ? updateArticle : createArticle;
    }
  },
  mounted() {
    // this.id = this.$route.params && this.$route.params.id || null
    // if (this.id) {
    //   this.getDetail()
    // }
  },
  methods: {
    async getDetail() {
      const { code, data } = await fetchArticle(this.id);
      if (code === 20000) {
        Object.assign(this.detailForm, data);
      } else {
        this.$router.back();
      }
    },
    async submit() {
      let msg = "文章更新成功";
      const data = Object.assign({}, this.detailForm);
      if (this.id) {
        data.id = this.id;
        msg = "创建文章成功";
      }
      const { code } = await insertArticleLabel(data);
      console.log(code);
      // if (code === 20000) {
      //   this.$message.success(msg)
      //   this.goListWithRefresh('/article/list')
      // }
    }
  }
};
</script>
