<template>
  <div class="container">
    <div class="top-block">
      <el-button slot="buttons" type="success" icon="el-icon-plus" @click="handleAddTop">添加顶级节点</el-button>
    </div>
    <div class="tree-block">
      <el-tree
        :data="setTree"
        :props="defaultProps"
        node-key="id"
        ref="SlotMenuList"
        :filter-node-method="filterNode"
        :default-expanded-keys="defaultExpanded"
        @node-contextmenu="handleMouseRightClick"
        @node-click="handleNodeClick"
        accordion
      >
        <span class="slot-t-node" slot-scope="{ node, data }">
          <span v-show="!node.isEdit">
            <span v-show="data.children && data.children.length >= 1">
              <i
                :class="{
                  'fa fa-plus-square': !node.expanded,
                  'fa fa-minus-square': node.expanded
                }"
              />
              <span class="el-tree-node__content__label" :class="[data.id >= maxexpandId ? 'slot-t-node--label' : '']">{{ node.label }}</span>
            </span>
            <span v-show="!data.children || data.children.length == 0">
              <!-- <i class="" style="margin-right: 10px"></i> -->
              <span class="el-tree-node__content__label" :class="[data.id >= maxexpandId ? 'slot-t-node--label' : '']">{{ node.label }}</span>
            </span>
          </span>
          <!-- 编辑输入框 -->
          <span v-show="node.isEdit">
            <el-input
              class="slot-t-input"
              size="mini"
              autofocus
              v-model="data.name"
              :ref="'slotTreeInput' + data.id"
              @blur.stop="nodeBlur(node, data)"
              @keyup.enter.native="nodeBlur(node, data)"
            ></el-input>
          </span>
        </span>
      </el-tree>

      <!--鼠标右键点击出现页面-->
      <el-menu
        v-show="menuVisible"
        id="rightClickMenu"
        class="el-menu-vertical"
        @select="handleRightSelect"
        active-text-color="#fff"
        text-color="#fff"
      >
        <el-menu-item index="1" class="menuItem">
          <span slot="title">
            <i class="el-icon-plus"></i>
            <span>添加分类</span>
          </span>
        </el-menu-item>
        <el-menu-item index="2" class="menuItem">
          <span slot="title">
            <i class="el-icon-edit"></i>
            <span>修改分类</span>
          </span>
        </el-menu-item>
        <el-menu-item index="3" class="menuItem">
          <span slot="title">
            <i class="el-icon-delete"></i>
            <span>删除分类</span>
          </span>
        </el-menu-item>
      </el-menu>
    </div>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="80%">
      <mavon-editor
        class="md"
        v-model="webDataString"
        codeStyle="monokai"
        :subfield="false"
        :defaultOpen="'preview'"
        :toolbarsFlag="false"
        :editable="false"
        :scrollStyle="true"
        :boxShadow="false"
        :ishljs="true"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getSelectCategory, insertCategory, deleteCategory } from '@/api/study';
import { statusMap } from 'assets/data-maps';
import detailMixin from '@/mixins/detailMixin';
import { uploadAction } from 'api/upload';
export default {
  name: 'ResourceEdit',
  components: {},
  mixins: [detailMixin],
  data() {
    return {
      dialogVisible: false,
      webDataString: '',
      value: '',
      img_file: {},
      code_style: 'monokai',
      action: uploadAction,
      prefix: 'http://121.196.189.114:8020', // 图片前缀域名
      DATA: null,
      NODE: null,
      dialogNewFormVisible: false,
      dialogFormVisible: false,
      dialogClassifyVisible: false,
      maxexpandId: 95, //新增节点开始id
      non_maxexpandId: 95, //新增节点开始id(不更改)
      isLoadingTree: true, //是否加载节点树
      setTree: [], // 树形结构数据
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultExpanded: [], // 默认展开的节点

      filterText: '',
      input: '',
      input2: '',
      currentPage4: 4,
      editObj: {},
      menuVisible: false,
      objectID: null,
      /*分类修改*/
      menuVisible2: false,
      objectID2: null
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
      // this.getDetail();
    }
    this.getSelectCategory();
  },
  methods: {
    async getSelectCategory() {
      const res = await getSelectCategory();
      const treeData = this.handleTreeData(res.data);
      this.setTree = treeData;
      console.log(treeData);
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

    // 点击节点事件
    handleNodeClick() {
      this.menuVisible = false;
    },

    // 绑定@imgAdd event
    handleEditorImgAdd(pos, $file) {
      // 第一步.将图片上传到服务器.
      var formdata = new FormData();
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

    // 删除图片
    handleEditorImgDel(pos) {
      delete this.img_file[pos];
    },

    handleSaveContent(value, render) {
      this.webDataString = render;
      this.dialogVisible = true;
    },

    filterNode(value, data) {
      console.log('value:', value);
      console.log('data:', data);
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    // 点击menu菜单
    handleRightSelect(key) {
      if (key == 1) {
        this.nodeAdd(this.NODE, this.DATA);
        this.menuVisible = false;
      } else if (key == 2) {
        this.nodeEdit(this.NODE, this.DATA);
        this.menuVisible = false;
      } else if (key == 3) {
        this.nodeDel(this.NODE, this.DATA);
        this.menuVisible = false;
      }
    },

    //添加顶级节点
    async handleAddTop() {
      const proSortArr = this.setTree.map(item => Number(item.ProSort));
      let maxProSort = Math.max(...proSortArr);

      // 请求添加
      let params = {
        isEdit: false,
        name: '新增顶级节点',
        pid: 0,
        proSort: ++maxProSort
      };
      const { code } = await insertCategory(params);
      if (code === 0) {
        this.getSelectCategory();
      }
    },

    //输入框失焦
    async nodeBlur(n, d) {
      if (n.isEdit) {
        this.$set(n, 'isEdit', false);

        // 有id就请求修改
        if (d.id) {
          let params = {
            name: d.name,
            id: d.id,
            pid: d.pid
          };
          await insertCategory(params);
        }
      }

      this.$nextTick(() => {
        this.$refs['slotTreeInput' + d.id].$refs.input.focus();
      });
    },

    //编辑节点
    nodeEdit(n, d) {
      if (!n.isEdit) {
        this.$set(n, 'isEdit', true);

        // 获取当前节点焦点
        this.$nextTick(() => {
          this.$refs['slotTreeInput' + d.id].$refs.input.focus();
        });
      }
    },

    //删除节点
    nodeDel(n, d) {
      // 判断是否有子节点
      if (d.children && d.children.length !== 0) {
        this.$message.error('此节点有子级，不可删除！');
        return;
      }

      //删除操作
      let DelFun = async () => {
        let _list = n.parent.data.children || n.parent.data; //节点同级数据
        let _index = _list.map(c => c.id).indexOf(d.id);
        _list.splice(_index, 1);

        // 请求删除
        const { code, msg } = await deleteCategory({ id: d.id });
        if (code === 0) {
          this.$message.success(msg);
        }
      };

      //二次确认
      let ConfirmFun = () => {
        this.$confirm('是否删除此节点？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          DelFun();
        });
      };

      // 调用
      ConfirmFun();
    },

    //新增节点
    async nodeAdd(n, d) {
      //判断层级
      if (n.level >= 3) {
        this.$message.error('最多只支持三级！');
        return false;
      }

      //新增数据
      d.children.push({
        id: ++this.maxexpandId,
        name: '新增节点',
        pid: d.id,
        children: []
      });

      //同时展开节点
      if (!n.expanded) {
        n.expanded = true;
      }

      // 请求添加
      let params = {
        isEdit: false,
        name: '新增节点',
        pid: d.id,
        proSort: d.proSort
      };
      const { code } = await insertCategory(params);
      if (code === 0) {
        this.getSelectCategory();
        this.defaultExpanded = [d.id]; // 默认展开新增的节点
      }
    },

    // 处理鼠标右键点击事件
    handleMouseRightClick(event, object, value) {
      console.log(event);
      if (this.objectID !== object.id) {
        this.objectID = object.id;
        this.menuVisible = true;
        this.DATA = object;
        this.NODE = value;
      } else {
        this.menuVisible = !this.menuVisible;
      }

      // 给document绑定点击事件，点击就关闭menu
      document.addEventListener('click', e => {
        this.menuVisible = false;
      });

      let menu = document.querySelector('#rightClickMenu');

      menu.style.left = event.layerX + 10 + 'px';
      menu.style.top = event.layerY + 10 + 'px';
      menu.style.position = 'absolute'; // 为新创建的DIV指定绝对定位
      menu.style.width = 140 + 'px';
    },

    dialogNewFormConfirm() {
      (this.dialogNewFormVisible = false),
        this.$message({
          type: 'success',
          message: '新建成功!'
        });
    },

    handleNew() {
      this.dialogNewFormVisible = true;
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

.tree-block {
  position: relative;
  width: 300px;
  height: 80vh;
  background-color: #fafafa;
}

.top-block {
  margin-bottom: 10px;
}

/*************************标签鼠标右击页面样式******************************/
.el-menu-vertical {
  width: 200px;
  border-radius: 3px;
  z-index: 100;
  background-color: white;
  padding: 10px 0;
  box-shadow: 0 8px 12px #e1e2e4;
}

.menuItem {
  height: 34px;
  line-height: 34px;
  color: #554c4c !important;
  font-size: 14px;
  border-radius: 3px;
}

.menuItem i {
  color: #554c4c !important;
  font-size: 14px;
  margin-right: 0 !important;
}

.menuItem:hover {
  background-color: #f1efef;
}

/deep/ .el-tree-node__content {
  padding: 2px 0;
}

/deep/ .el-tree-node__content:hover {
  background-color: #f0f7ff;
}

.el-tree-node__content__label {
  font-size: 16px;
  color: #655757;
}

/deep/ .el-tree-node {
  white-space: nowrap;
  outline: none;
  padding: 3px 0;
}

/deep/ .el-tree {
  position: relative;
  cursor: default;
  color: #606266;
  background-color: #fafafa;
  height: 100%;
}
</style>
