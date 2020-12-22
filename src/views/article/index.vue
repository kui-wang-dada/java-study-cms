<template>
  <div>
    <srm-form
      v-model="searchForm"
      form-name="searchForm"
      :inline="true"
      :form-items="queryColumns"
      :show-back="false"
      submit-msg="搜索"
      @submit="refresh"
      @after-reset="refresh"
      class="container"
    />
    <srm-table
      :source-data="tableData"
      :columns="columns"
      :total="total"
      :page-request="listQuery"
      :loading="listLoading"
      :page-sizes="[10, 25, 50]"
      :exportVisible="false"
      @handleBatchDelete="setItem($event, 'delete')"
      @changePage="changePage"
      @changeSize="changeSize"
    >
      <el-button slot="buttons" type="success" icon="el-icon-plus" @click="setItem({}, 'create')">新增</el-button>
      <el-table-column slot="operation" label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="setItem(scope.row, 'delete')">
            删除
          </el-button>
          <el-button type="text" @click="setItem(scope.row, 'edit')">
            编辑
          </el-button>
          <el-button type="text" @click="setItem(scope.row, 'detail')">
            查看
          </el-button>
        </template>
      </el-table-column>
    </srm-table>
    <srm-dialog-check content="确认删除该文章吗？" :current-item.sync="checkDialogItem" @confirmItem="deleteItem" />
  </div>
</template>
<script>
import { fetchList, deleteArticle } from '@/api/article';
import { statusMap } from 'assets/data-maps';
import { formatTimer } from '@/utils';
import pageMixin from '@/mixins/pageMixin';
export default {
  name: 'ArticleList',
  mixins: [pageMixin],
  data() {
    return {
      fetchList,
      deleteVisible: false,
      columns: [
        { type: 'index', label: '序号', width: 50 },
        {
          prop: 'title',
          label: '标题',
          'show-overflow-tooltip': true,
          width: 300
        },
        { prop: 'img1', label: '封面', isImg: true, width: 120 },
        {
          prop: 'url',
          label: '链接',
          width: 300,
          isLink: true
        },
        {
          prop: 'state',
          label: '当前状态',
          isTag: true,
          width: 100
        },
        {
          prop: 'labelList',
          label: '标签',
          isLabel: true,
          width: 200
        },
        {
          prop: 'createTime',
          label: '发布时间',
          formatter: this.createTimeFormat,
          width: 200
        },
        // 没有prop的列不会被导出
        { slot: 'operation', label: '操作' }
      ],
      queryColumns: [
        {
          tag: 'input',
          itemAttrs: {
            label: '文章标题'
          },
          attrs: {
            key: 'title',
            placeholder: '请输入文章标题'
          }
        },
        {
          tag: 'select',
          itemAttrs: {
            label: '文章状态'
          },
          attrs: {
            key: 'state',
            options: statusMap
          }
        }
      ]
    };
  },
  methods: {
    createTimeFormat(row, column, cellvalue) {
      return formatTimer(cellvalue / 1000, true);
    },
    setItem(item, type) {
      switch (type) {
        case 'delete':
          this.checkDialogItem = item;
          break;
        case 'detail':
          this.$router.push({
            name: 'ArticleDetail',
            params: {
              id: item.id
            }
          });
          break;
        case 'edit':
          this.$router.push(`/article/edit/${item.id}`);
          break;
        case 'create':
          this.$router.push('/article/create');
          break;
        default:
          break;
      }
    },
    deleteItem(item) {
      let id;
      if (Array.isArray(item)) {
        id = item.map(v => v.id).join(',');
      } else {
        id = item.id;
      }
      this.mixinHandleItem(deleteArticle, this.getList, id);
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  padding: 0 30px;
}
</style>
