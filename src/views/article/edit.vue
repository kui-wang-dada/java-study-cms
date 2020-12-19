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
import { fetchArticle, updateArticle, createArticle } from 'api/article';
import { fetchList } from '@/api/label';
import { statusMap } from 'assets/data-maps';
import detailMixin from '@/mixins/detailMixin';
export default {
  name: 'ArticleEdit',
  components: {},
  mixins: [detailMixin],
  data() {
    const labelMap = [];
    return {
      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'click' }],
        url: [{ required: true, message: '链接不能为空', trigger: 'click' }],
        state: [{ required: true, message: '请选择状态', trigger: 'click' }],
        label: [{ required: true, message: '请选择标签', trigger: 'click' }]
      },
      detailForm: {},
      formItems: [
        {
          tag: 'input',
          itemAttrs: {
            label: '文章标题',
            col: 18
          },
          attrs: {
            key: 'title',
            placeholder: '请输入标题'
          }
        },
        {
          tag: 'input',
          itemAttrs: {
            label: '文章链接',
            col: 18
          },
          attrs: {
            key: 'url',
            placeholder: '请输入文章链接'
          }
        },
        {
          tag: 'select',
          itemAttrs: {
            label: '文章状态',
            col: 18
          },
          attrs: {
            key: 'state',
            options: statusMap,
            placeholder: '请选择文章状态'
          }
        },
        {
          tag: 'select',
          itemAttrs: {
            label: '文章标签',
            col: 18
          },
          attrs: {
            key: 'label',
            options: labelMap,
            placeholder: '请选择文章标签',
            multiple: true
          }
        },
        {
          tag: 'switch',
          itemAttrs: {
            label: '是否置顶'
          },
          attrs: {
            key: 'isTop'
          }
        },
        {
          tag: 'upload',
          itemAttrs: {
            label: '文章封面'
          },
          attrs: {
            key: 'img'
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
    async getLabel() {
      // 获取label
      const { data } = await fetchList();
      data.map(item => {
        return {
          label: item.labelName,
          value: item.id
        };
      });
    },

    async getDetail() {
      const { code, data } = await fetchArticle(this.id);
      if (code === 20000) {
        Object.assign(this.detailForm, data);
      } else {
        this.$router.back();
      }
    },
    async submit() {
      let msg = '文章更新成功';
      const data = Object.assign({}, this.detailForm);
      data.label = data.label.join(',');
      data.isTop = data.isTop ? 1 : 0;
      console.log(data);
      return;
      if (this.id) {
        data.id = this.id;
        msg = '创建文章成功';
      }
      const { code } = await this.submitFn(data);
      if (code === 20000) {
        this.$message.success(msg);
        this.goListWithRefresh('/article/list');
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
