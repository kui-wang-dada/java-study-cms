<template>
  <div class="container">
    <div class="edit-flex">
      <div class="left">
        <study-tree
          :studyTree="studyTree"
          :defaultExpanded="defaultExpanded"
          @addTree="addTree"
          @delTree="delTree"
          @editTree="editTree"
          @openArticle="openArticle"
        />
      </div>
      <div class="right" v-show="formData.categoryId">
        <div class="top-row">
          <div class="top-left">
            <el-input placeholder="文章标题" v-model="formData.title" disabled>
              <template slot="prepend">
                标题
              </template>
            </el-input>
          </div>
          <div class="top-right">
            <el-button type="primary" size="small" icon="el-icon-circle-check" title="保存文章" @click="saveArticle">保存</el-button>
            <el-button type="danger" icon="el-icon-delete" title="删除文章" @click="deleteArticle" v-if="articleData.id">删除</el-button>
            <el-button type="primary" icon="el-icon-view" title="编辑文章" @click="previewArticle" v-if="webDataString">预览</el-button>
          </div>
        </div>
        <mavon-editor
          v-model="articleContent"
          :ishljs="true"
          :codeStyle="code_style"
          :tabSize="4"
          ref="md"
          @save="handleSaveContent"
          @change="handleChangeContent"
          @imgAdd="handleEditorImgAdd"
          @imgDel="handleEditorImgDel"
        />
      </div>
    </div>

    <el-dialog title="预览markdown" :visible.sync="dialogVisible" width="50%">
      <mavon-editor
        class="md"
        v-model="webDataString"
        :codeStyle="code_style"
        :subfield="false"
        :defaultOpen="'preview'"
        :toolbarsFlag="false"
        :editable="false"
        :boxShadow="false"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import hljs from 'highlight.js'; //导入代码高亮文件
import 'highlight.js/styles/googlecode.css';
async function highlighthandle() {
  await hljs;
  let highlight = document.querySelectorAll('code,pre');
  highlight.forEach(block => {
    hljs.highlightBlock(block);
  });
}
highlighthandle();

import StudyTree from '@/components/StudyTree';
import {
  getSelectCategory,
  insertCategory,
  deleteCategory,
  insertArticleLearn,
  selectArticleLearnList,
  deleteArticleLearn,
  updateArticleLearn
} from '@/api/study';
import detailMixin from '@/mixins/detailMixin';
import { uploadAction } from 'api/upload';
export default {
  name: 'ResourceEdit',
  components: { StudyTree },
  mixins: [detailMixin],
  data() {
    return {
      dialogVisible: false,
      webDataString: '', // 预览内容
      articleContent: '', // 文章内容
      img_file: {}, // 图片保存
      code_style: 'atelier-lakeside-dark',
      code_styles: ['qtcreator-light', 'atelier-lakeside-dark'],
      action: uploadAction,
      prefix: 'http://121.196.189.114:8020', // 图片前缀域名
      studyTree: [], // 数据
      defaultExpanded: [], // 默认展开节点id数组
      // 创建文章参数
      formData: {
        categoryId: null,
        content: '',
        contentText: '',
        title: '',
        userId: '1234321',
        id: ''
      },
      articleData: {} // 文章数据
    };
  },
  computed: {
    submitFn() {
      const { id } = this.articleData;
      return id ? updateArticleLearn : insertArticleLearn;
    }
  },
  mounted() {
    this.getSelectCategory([]);
  },
  methods: {
    // 获取数据
    async getSelectCategory(defaultExpanded) {
      const { code, data } = await getSelectCategory();
      if (code === 0) {
        this.studyTree = this.handleTreeData(data);
        this.defaultExpanded = defaultExpanded;
        console.log(this.studyTree);
      }
    },

    // 处理数据
    handleTreeData(list) {
      let tree = list.map(item => {
        const isChildren = item.children && item.children.length > 0;
        return {
          id: item.id,
          name: item.name,
          ProSort: item.proSort,
          remark: item.remark,
          pid: item.pid,
          isEdit: item.edit,
          children: isChildren ? this.handleTreeData(item.children) : [],
          codes: item.codes
        };
      });
      return tree;
    },

    // 新增节点
    async addTree({ params, id }) {
      const { code } = await insertCategory(params);
      if (code === 0) {
        this.getSelectCategory([id]);
      }
    },

    // 删除节点
    async delTree({ id }) {
      const { code, msg } = await deleteCategory({ id });
      if (code === 0) {
        this.$message.success(msg);
      }
    },

    // 修改节点名称
    async editTree({ params }) {
      const { code } = await insertCategory(params);
      if (code === 0) {
        this.$message.success('修改成功');
      }
    },

    // 点击查看文章
    openArticle({ node, data }) {
      // 判断当前点击的节点是否已打开
      const { categoryId } = this.articleData;
      if (data.id !== categoryId) {
        this.reset();
        this.getSelectArticleLearnList(data);
      }
    },

    // 编写文章
    addArticle({ node, data }) {
      // 判断当前点击的节点是否已打开
      const { categoryId } = this.articleData;
      if (data.id !== categoryId) {
        this.reset();
        this.getSelectArticleLearnList(data);
      }
    },

    // 重置数据
    reset() {
      this.formData = {
        categoryId: null,
        content: '',
        contentText: '',
        title: '',
        userId: '1234321',
        id: ''
      };
      this.articleData = {};
      this.articleContent = '';
      this.webDataString = '';
    },

    // 根据目录id查询文章
    async getSelectArticleLearnList(Data) {
      let { code, data } = await selectArticleLearnList({ categoryId: Data.id });
      if (code === 0 && data) {
        this.formData = {
          categoryId: data.categoryId,
          content: data.content,
          contentText: data.contentText,
          title: data.title,
          userId: '1234321',
          id: data.id
        };
        this.articleData = data;
        this.articleContent = data.contentText;
        this.webDataString = data.content;
      } else {
        this.formData.categoryId = Data.id;
        this.formData.title = Data.name;
      }
    },

    // 创建 or 编辑文章
    async saveArticle() {
      const data = this.formData;
      if (!data.content) {
        this.$message.warning('请先保存或编写markdown编辑器内容');
        return;
      }

      // 请求
      const { code, msg } = await this.submitFn(data);
      if (code === 0) {
        this.$message.success(msg);
        this.reset();
        this.getSelectArticleLearnList({ id: data.categoryId });
      }
    },

    // 根据id删除文章
    deleteArticle() {
      const { id, categoryId } = this.articleData;
      this.$confirm('是否删除此文章？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { code } = await deleteArticleLearn({ id });
        if (code === 0) {
          this.$message.success('删除成功');
          this.reset();
          this.getSelectCategory([categoryId]);
        }
      });
    },

    // 上传markdown编辑器里面的图片
    handleEditorImgAdd(pos, $file) {
      // 第一步.将图片上传到服务器.
      let formdata = new FormData();
      formdata.append('img', $file);
      this.img_file[pos] = $file;
      this.$axios({
        url: uploadAction,
        method: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(res => {
        let _res = res.data;
        // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
        this.$refs.md.$img2Url(pos, `${this.prefix}${_res.data}`);
        console.log(this.$refs.md);
      });
    },

    // 删除markdown编辑器里面的图片
    handleEditorImgDel(pos) {
      delete this.img_file[pos];
    },

    // 预览markdown效果
    previewArticle() {
      this.dialogVisible = true;
    },

    // markdown编辑器Change事件
    handleChangeContent(value, render) {
      this.formData.content = render;
      this.formData.contentText = value;
      this.webDataString = render;
    },

    // 保存markdown编辑器内容
    handleSaveContent(value, render) {
      this.formData.content = render;
      this.formData.contentText = value;
      this.$message.success('内容已保存!');
    }
  }
};
</script>
<style lang="scss" scoped>
.edit-flex {
  display: flex;
  justify-content: space-between;
  height: 100vh;

  .left {
    width: 300px;
    margin-right: 20px;
    height: 100%;
  }

  .right {
    flex: 1;
    background: #fff;
    border-bottom: 1px solid #fafafa;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 0 3px 0 rgba(0, 0, 0, 0.02);
    height: 100%;
    padding: 10px;
    position: relative;

    .v-note-wrapper {
      height: 90%;
    }

    .top-row {
      background-color: #fff;
      padding: 8px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .top-left {
        flex: 1;
        margin-right: 20px;
        /deep/ .el-input--small .el-input__inner {
          height: 38px;
          line-height: 38px;
          font-weight: 550;
          color: #333;
        }
      }
    }
  }
}

/deep/ .fa-mavon-floppy-o {
  color: #46a6ff !important;
}

/deep/ .v-show-content {
  background-color: #fff !important;
}
</style>
