<template>
  <div class="container">
    <div class="edit-flex">
      <div class="left">
        <study-tree :studyTree="studyTree" :defaultExpanded="defaultExpanded" @addTree="addTree" @delTree="delTree" @editTree="editTree" />
      </div>
      <div class="right">
        <!-- <div> -->
        <mavon-editor
          v-model="essayContent"
          :ishljs="true"
          :codeStyle="code_style"
          :tabSize="4"
          ref="md"
          @save="handleSaveContent"
          @imgAdd="handleEditorImgAdd"
          @imgDel="handleEditorImgDel"
        />
        <!-- </div> -->
      </div>
    </div>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="80%">
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
import { getSelectCategory, insertCategory, deleteCategory } from '@/api/study';
import detailMixin from '@/mixins/detailMixin';
import { uploadAction } from 'api/upload';
export default {
  name: 'ResourceEdit',
  components: { StudyTree },
  mixins: [detailMixin],
  data() {
    return {
      dialogVisible: false,
      webDataString: '',
      essayContent: '', // 文章内容
      img_file: {}, // 图片保存
      code_style: 'atelier-lakeside-dark',
      code_styles: ['qtcreator-light', 'atelier-lakeside-dark'],
      action: uploadAction,
      prefix: 'http://121.196.189.114:8020', // 图片前缀域名
      studyTree: [], // 数据
      defaultExpanded: [] // 默认展开节点id数组
    };
  },
  computed: {
    submitFn() {
      return this.id ? updateArticleDownLoad : insertArticleDownLoad;
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
        let isChildren = item.children && item.children.length > 0;
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
      });
    },

    // 删除markdown编辑器里面的图片
    handleEditorImgDel(pos) {
      delete this.img_file[pos];
    },

    // 保存markdown编辑器内容
    handleSaveContent(value, render) {
      this.webDataString = render;
      this.dialogVisible = true;
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
    margin-right: 10px;
    height: 100%;
  }

  .right {
    flex: 1;
    background-color: #fafafa;
    height: 100%;

    .v-note-wrapper {
      height: 90%;
    }
  }
}
</style>
