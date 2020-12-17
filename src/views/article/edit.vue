<template>
  <div class="container">
    <srm-form
      v-model="detailForm"
      form-name="detailForm"
      class="my-form"
      :reset-msg="false"
      :form-items="formItems"
      :inline="false"
      @submit="submit"
    >
    </srm-form>
  </div>
</template>
<script>
import { fetchArticle, updateArticle, createArticle } from "api/article";
import { statusMap, labelMap } from "assets/data-maps";
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
            label: "文章标题",
            col: 18
          },
          attrs: {
            key: "title",
            placeholder: "请输入标题"
          }
        },
        {
          tag: "input",
          itemAttrs: {
            label: "文章链接",
            col: 18
          },
          attrs: {
            key: "url",
            placeholder: "请输入文章链接"
          }
        },
        {
          tag: "select",
          itemAttrs: {
            label: "文章状态",
            col: 18
          },
          attrs: {
            key: "state",
            options: statusMap,
            placeholder: "请选择文章状态"
          }
        },
        {
          tag: "select",
          itemAttrs: {
            label: "文章标签",
            col: 18
          },
          attrs: {
            key: "label",
            options: labelMap,
            placeholder: "请选择文章标签",
            multiple: true
          }
        },
        {
          tag: "switch",
          itemAttrs: {
            label: "是否置顶"
          },
          attrs: {
            key: "isTop"
          }
        },
        {
          tag: "upload",
          itemAttrs: {
            label: "文章封面"
          },
          attrs: {
            key: "img"
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
    this.id = (this.$route.params && this.$route.params.id) || null;
    if (this.id) {
      this.getDetail();
    }
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
      data.label = data.label.join(",");
      data.isTop = data.isTop ? 1 : 0;
      console.log(data);
      return;
      if (this.id) {
        data.id = this.id;
        msg = "创建文章成功";
      }
      const { code } = await this.submitFn(data);
      if (code === 20000) {
        this.$message.success(msg);
        this.goListWithRefresh("/article/list");
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
}
</style>
