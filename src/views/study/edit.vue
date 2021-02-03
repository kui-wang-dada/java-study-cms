<template>
  <div class="container">
    <div class="tree-block">
      <el-tree
        :data="setTree"
        :props="defaultProps"
        node-key="id"
        ref="SlotMenuList"
        :filter-node-method="filterNode"
        @node-contextmenu="rihgtClick"
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
              <i class="" style="margin-right: 10px"></i>
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
              @blur.stop="NodeBlur(node, data)"
              @keyup.enter.native="NodeBlur(node, data)"
            ></el-input>
          </span>
        </span>
      </el-tree>
      <!--鼠标右键点击出现页面-->
      <div v-show="menuVisible">
        <el-menu id="rightClickMenu" class="el-menu-vertical" @select="handleRightSelect" active-text-color="#fff" text-color="#fff">
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
    </div>

    <!-- <div id="main">
      <mavon-editor
        v-model="value"
        :ishljs="true"
        :codeStyle="code_style"
        :boxShadow="false"
        ref="md"
        @imgAdd="handleEditorImgAdd"
        @imgDel="handleEditorImgDel"
        @save="handleSaveContent"
      />
    </div> -->

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
import { findArticleDownLoadById, updateArticleDownLoad, insertArticleDownLoad } from '@/api/resource';
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
      setTree: [
        {
          id: 1,
          name: 'Java基础',
          ProSort: 1,
          remark: 'Java基础',
          pid: '',
          isEdit: false,
          children: [
            {
              id: 35,
              name: 'Java开发环境基本配置',
              pid: 1,
              remark: '',
              isEdit: false,
              children: []
            },
            {
              id: 36,
              name: '熟练使用IDEA开发工具',
              pid: 1,
              remark: '',
              isEdit: false,
              children: []
            },
            {
              id: 37,
              name: '常用类String、ArrayList等的使用',
              pid: 1,
              remark: '',
              isEdit: false,
              children: []
            },
            {
              id: 38,
              name: '深入理解Java面向对象相关知识点',
              pid: 1,
              remark: '',
              isEdit: false,
              children: []
            },
            {
              id: 39,
              name: '运算符、表达式、流程控制语句、数组等的使用',
              pid: 1,
              remark: '',
              isEdit: false,
              children: []
            },
            {
              id: 40,
              name: 'Java基本面向对象知识',
              pid: 1,
              remark: '',
              isEdit: false,
              children: []
            },
            {
              id: 41,
              name: 'Java异常处理机制，熟悉Java多线程开发',
              pid: 1,
              remark: '',
              isEdit: false,
              children: []
            },
            {
              id: 42,
              name: '熟悉Java11新特性，如Lambda、Stream流等操作',
              pid: 1,
              remark: '',
              isEdit: false,
              children: []
            }
          ]
        },
        {
          id: 2,
          name: 'JavaWeb',
          ProSort: 2,
          remark: 'JavaWeb',
          pid: '',
          isEdit: false,
          children: [
            {
              id: 43,
              name: 'JavaJDBC、连接池操作',
              pid: 2,
              remark: '',
              isEdit: false,
              children: []
            },
            {
              id: 44,
              name: '熟练操作MySQL数据库',
              pid: 2,
              remark: '',
              isEdit: false,
              children: []
            },
            {
              id: 45,
              name: '熟悉Web开发中常用知识如HTML5、CSS3',
              pid: 2,
              remark: '',
              isEdit: false,
              children: []
            },
            {
              id: 46,
              name: 'JavaWeb开发核心技术Servlet、Listener',
              pid: 2,
              remark: '',
              isEdit: false,
              children: []
            },
            {
              id: 47,
              name: '熟悉Web开发中常用知识如HTML5、CSS3',
              pid: 2,
              remark: '',
              isEdit: false,
              children: []
            },
            {
              id: 48,
              name: '熟悉Linux服务器，并安装开发常用软件Tomcat、MySQL、Nginx等',
              pid: 2,
              remark: '',
              isEdit: false,
              children: []
            }
          ]
        }
      ], //节点树数据
      defaultProps: {
        children: 'children',
        label: 'name'
      },
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
    let Arry = [
      {
        children: [{ status: 1, name: '儿子1' }, { status: 1, name: '儿子2' }],
        status: 1,
        name: '爹1'
      },
      {
        children: [{ status: 2, name: '儿子3' }, { status: 1, name: '儿子4' }],
        status: 1,
        name: '爹2'
      },
      {
        children: [{ status: 1, name: '儿子5' }],
        status: 2,
        name: '爹3'
      },
      { status: 1, name: '爹4' },
      { status: 2, name: '爹5' }
    ];

    Arry.forEach(item => {
      if (item.children && item.children.length > 0) {
        item.children = item.children.filter(e => e.status !== 1);
      }
    });

    let newArry = Arry.filter(item => {
      return item.status !== 1 || (item.status === 1 && (item.children && item.children.length > 0));
    });

    let arr = Arry.map(item => {
      if (item.status == 1) {
        item.disabled = true;
      }
      return;
    });

    console.log(newArry);
    // 修改or添加
    this.id = (this.$route.params && this.$route.params.id) || null;
    if (this.id) {
      this.getDetail();
    }
  },
  methods: {
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
      console.log(value);
      console.log(render);
      this.webDataString = render;
      this.dialogVisible = true;
    },

    filterNode(value, data) {
      console.log('value:', value);
      console.log('data:', data);
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    handleRightSelect(key) {
      console.log(key);
      if (key == 1) {
        this.NodeAdd(this.NODE, this.DATA);
        this.menuVisible = false;
      } else if (key == 2) {
        this.NodeEdit(this.NODE, this.DATA);
        this.menuVisible = false;
      } else if (key == 3) {
        this.NodeDel(this.NODE, this.DATA);
        this.menuVisible = false;
      }
    },

    // handleAddTop(){//添加顶级节点
    // 	this.setTree.push({
    // 		id: ++this.maxexpandId,
    // 		name: '新增顶级节点',
    // 		pid: '',
    // 		children: []
    // 	})
    // },

    NodeBlur(n, d) {
      //输入框失焦
      console.log(n, d);
      if (n.isEdit) {
        this.$set(n, 'isEdit', false);
      }
      this.$nextTick(() => {
        this.$refs['slotTreeInput' + d.id].$refs.input.focus();
      });
    },

    NodeEdit(n, d) {
      //编辑节点
      console.log(n, d);
      if (!n.isEdit) {
        //检测isEdit是否存在or是否为false
        this.$set(n, 'isEdit', true);
      }
    },

    NodeDel(n, d) {
      //删除节点
      console.log(n, d);
      let that = this;
      if (d.children && d.children.length !== 0) {
        this.$message.error('此节点有子级，不可删除！');
        return false;
      } else {
        //新增节点可直接删除，已存在的节点要二次确认
        //删除操作
        let DelFun = () => {
          let _list = n.parent.data.children || n.parent.data; //节点同级数据
          let _index = _list.map(c => c.id).indexOf(d.id);
          console.log(_index);
          _list.splice(_index, 1);
          this.$message.success('删除成功！');
        };

        //二次确认
        let ConfirmFun = () => {
          this.$confirm('是否删除此节点？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              DelFun();
            })
            .catch(() => {});
        };

        // 调用
        ConfirmFun();
        //判断是否是新增节点
        // d.id > this.non_maxexpandId ? DelFun() : ConfirmFun();
      }
    },

    NodeAdd(n, d) {
      //新增节点
      console.log(n, d);
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
    },

    rihgtClick(event, object, value, element) {
      if (this.objectID !== object.id) {
        this.objectID = object.id;
        this.menuVisible = true;
        this.DATA = object;
        this.NODE = value;
      } else {
        this.menuVisible = !this.menuVisible;
      }
      document.addEventListener('click', e => {
        this.menuVisible = false;
      });
      let menu = document.querySelector('#rightClickMenu');
      console.log(menu);
      /* 菜单定位基于鼠标点击位置 */
      menu.style.left = event.clientX + 10 + 'px';
      menu.style.top = event.clientY + 10 + 'px';
      menu.style.position = 'absolute'; // 为新创建的DIV指定绝对定位
      menu.style.width = 140 + 'px';
      /*console.log("右键被点击的左侧:",menu.style.left);
        console.log("右键被点击的顶部:",menu.style.top);*/
      //        console.log("右键被点击的event:",event);
      // console.log("右键被点击的object:", object);
      // console.log("右键被点击的value:", value);
      // console.log("右键被点击的element:", element);
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
/*************************标签鼠标右击页面样式******************************/
.el-menu-vertical {
  width: 200px;
  border-radius: 3px;
  z-index: 100;
  background-color: white;
  padding: 10px 0;
  box-shadow: 0px 5px 5px -3px rgb(0, 0, 0 / 20%), 0px 8px 10px 1px rgb(0, 0, 0 / 14%), 0px 3px 14px 2px rgb(0, 0, 0 / 12%);
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
</style>
