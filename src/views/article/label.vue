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
      class="search"
    />
    <srm-table
      :source-data="tableData"
      :columns="columns"
      :total="total"
      :page-request="listQuery"
      :loading="listLoading"
      :exportVisible="false"
      :page-sizes="[10, 25, 50]"
      @handleBatchDelete="setItem($event, 'delete')"
      @changePage="changePage"
      @changeSize="changeSize"
    >
      <el-button
        slot="buttons"
        type="success"
        icon="el-icon-plus"
        @click="setItem({}, 'create')"
        >新增</el-button
      >
      <el-table-column slot="operation" label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="setItem(scope.row, 'delete')">
            删除
          </el-button>
          <el-button type="text" @click="setItem(scope.row, 'edit')">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </srm-table>
    <srm-dialog-check
      content="确认删除该文章吗？"
      :current-item.sync="checkDialogItem"
      @confirmItem="deleteItem"
    />
  </div>
</template>
<script>
import { fetchList, deleteArticle } from "@/api/article";
import { statusMap } from "assets/data-maps";
import pageMixin from "@/mixins/pageMixin";
export default {
  name: "ArticleList",
  mixins: [pageMixin],
  data() {
    return {
      fetchList,
      deleteVisible: false,
      columns: [
        { type: "index", label: "序号", width: 100 },
        {
          prop: "label",
          label: "标签名称",
          isLabel: true
        },
        { prop: "display_time", label: "创建时间" },
        // 没有prop的列不会被导出
        { slot: "operation", label: "操作" }
      ],
      queryColumns: [
        {
          tag: "input",
          itemAttrs: {
            label: "搜索"
          },
          attrs: {
            key: "title",
            placeholder: "请输入标签名称关键字搜索"
          }
        }
      ]
    };
  },
  methods: {
    statusFormat(row, column, cellvalue) {
      return statusMap.find(item => item.value === cellvalue).label;
    },
    setItem(item, type) {
      switch (type) {
        case "delete":
          this.checkDialogItem = item;
          break;
        case "detail":
          this.$router.push({
            name: "ArticleDetail",
            params: {
              id: item.id
            }
          });
          break;
        case "edit":
          this.$router.push(`/article/edit/${item.id}`);
          break;
        case "create":
          this.$router.push("/article/labelEdit");
          break;
        default:
          break;
      }
    },
    deleteItem(item) {
      let id;
      if (Array.isArray(item)) {
        id = item.map(v => v.id);
      } else {
        id = item.id;
      }
      this.mixinHandleItem(deleteArticle, this.getList, id);
    }
  }
};
</script>
<style lang="scss" scoped>
.search {
  padding: 0 30px;
}
</style>
