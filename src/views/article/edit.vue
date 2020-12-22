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
import { statusMap, getLabel } from 'assets/data-maps';
import detailMixin from '@/mixins/detailMixin';
export default {
  name: 'ArticleEdit',
  components: {},
  mixins: [detailMixin],
  data() {
    return {
      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'click' }],
        url: [{ required: true, message: '链接不能为空', trigger: 'click' }],
        state: [{ required: true, message: '请选择状态', trigger: 'click' }],
        label: [{ required: true, message: '请选择标签', trigger: 'click' }],
        img: [{ required: true, message: '请上传封面', trigger: 'click' }]
      },
      detailForm: {
        title: null,
        url: null,
        state: null,
        label: null,
        isTop: null,
        img: null
      },
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
            options: [],
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
    // label文章标签
    getLabel().then(res => {
      this.formItems[3].attrs.options = res;
    });

    // 修改or添加
    this.id = (this.$route.params && this.$route.params.id) || null;
    if (this.id) {
      this.getDetail();
    }
  },
  methods: {
    async getDetail() {
      const { code, data } = await fetchArticle({ articleId: this.id });
      if (code === 0) {
        Object.assign(this.detailForm, {
          title: data.title,
          url: data.url,
          state: parseInt(data.state),
          label: data.label.split(','),
          isTop: data.isTop ? true : false,
          img: data.img1
        });
      } else {
        this.$router.back();
      }
    },
    async submit() {
      const data = Object.assign({}, this.detailForm);
      data.label = data.label.join(',');
      data.isTop = data.isTop ? 1 : 0;
      if (this.id) {
        data.id = this.id;
      }
      const { code, msg } = await this.submitFn(data);
      if (code === 0) {
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
