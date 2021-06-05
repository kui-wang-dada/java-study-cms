<template>
  <div class="tree-container">
    <div class="top-block">
      <el-button slot="buttons" type="primary" icon="el-icon-plus" @click="handleAddTop">新增顶级目录</el-button>
    </div>

    <div class="tree-block">
      <div class="tree-title">
        <h6>目录</h6>
      </div>
      <el-tree
        :data="studyTree"
        :props="defaultProps"
        node-key="id"
        ref="SlotMenuList"
        :filter-node-method="filterNode"
        :default-expanded-keys="defaultExpanded"
        :highlight-current="true"
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
            <span v-show="!data.children || data.children.length === 0">
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
            <span>添加目录</span>
          </span>
        </el-menu-item>
        <el-menu-item index="2" class="menuItem">
          <span slot="title">
            <i class="el-icon-edit"></i>
            <span>修改目录</span>
          </span>
        </el-menu-item>
        <el-menu-item index="3" class="menuItem">
          <span slot="title">
            <i class="el-icon-delete"></i>
            <span>删除目录</span>
          </span>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>
<script>
export default {
  name: 'StudyTree',
  props: {
    // 数据列表
    studyTree: {
      type: Array,
      default: []
    },
    // 默认展开节点id数组
    defaultExpanded: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      DATA: null,
      NODE: null,
      maxexpandId: 95, //新增节点开始id
      non_maxexpandId: 95, //新增节点开始id(不更改)
      isLoadingTree: true, //是否加载节点树
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      menuVisible: false,
      objectID: null
    };
  },
  methods: {
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

    // 节点点击事件
    handleNodeClick() {
      this.menuVisible = false;
    },

    // 过滤显示不了的节点
    filterNode(value, data) {
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

    //输入框失焦
    nodeBlur(n, d) {
      if (n.isEdit) {
        this.$set(n, 'isEdit', false);

        // 判断是否有id
        if (d.id) {
          const params = {
            name: d.name,
            id: d.id,
            pid: d.pid
          };
          this.$emit('editTree', { params });
        }
      }
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
        this.$message.error('此目录有子目录，不可删除！');
        return;
      }

      //删除操作
      let DelFun = async () => {
        let _list = n.parent.data.children || n.parent.data; //节点同级数据
        let _index = _list.map(c => c.id).indexOf(d.id);
        _list.splice(_index, 1);

        this.$emit('delTree', { id: d.id });
      };

      //二次确认
      let ConfirmFun = () => {
        this.$confirm('是否删除此目录？', '提示', {
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

    // 新增顶级节点
    handleAddTop() {
      const proSortArr = this.studyTree.map(item => Number(item.ProSort));
      let maxProSort = Math.max(...proSortArr);

      const params = {
        isEdit: false,
        name: '顶级目录',
        pid: 0,
        proSort: ++maxProSort
      };
      this.$emit('addTree', { params });
    },

    // 新增节点
    nodeAdd(n, d) {
      // 判断层级
      if (n.level >= 3) {
        this.$message.error('最多只支持三级！');
        return false;
      }

      const params = {
        isEdit: false,
        name: '新增目录',
        pid: d.id,
        proSort: d.proSort
      };
      this.$emit('addTree', { params, id: d.id });
    },

    // 处理鼠标右键点击事件
    handleMouseRightClick(event, object, value) {
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
    }
  }
};
</script>
<style lang="scss" scoped>
.tree-container {
  width: 300px;
  height: 100%;
  background-color: #fcfcfc;

  .tree-block {
    position: relative;
    width: 300px;
    padding: 20px 0;
  }

  .top-block {
    margin-bottom: 10px;
  }

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
    font-size: 14px;
    color: #8c8c8c;
  }

  /deep/ .el-tree-node {
    white-space: nowrap;
    outline: none;
    padding: 3px 0;
  }

  /deep/ .el-tree {
    position: relative;
    cursor: default;
    color: #8c8c8c;
    background-color: #fcfcfc;
    height: 100%;
  }

  .tree-title {
    h6 {
      font-size: 16px;
      font-weight: 500;
      color: #262626;
      padding: 0 16px 10px 16px;
      margin: 0;
    }
  }
}
</style>
