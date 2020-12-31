<template>
  <div>
    <el-card>
      <div slot="header">{{ detailForm.title }}</div>
      <el-row>
        <el-col :span="24" class="flex-align mb-8">
          <span>资料链接：</span>
          <el-link type="primary" target="_blank">{{ detailForm.articleUrl }}</el-link>
        </el-col>
        <el-col :span="24" class="flex-align mb-8">
          <span>资料状态：</span>
          <el-tag v-if="detailForm.state" :type="detailForm.state | statusTag">{{ detailForm.state | statusName }}</el-tag>
        </el-col>
        <el-col :span="24" class="flex-align mb-8">
          <span>发布时间：{{ detailForm.createTime | createTimeFormat }}</span>
        </el-col>
        <el-col :span="24" class="flex-align mb-8">
          <span>点赞数量：{{ detailForm.inspireNum }}</span>
        </el-col>
        <el-col :span="24" class="flex-align mb-8">
          <span>下载数量：{{ detailForm.downloadNum }}</span>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <!-- <div slot="header">文章封面</div>
      <div>
        <el-image
          class="srm-table_img"
          :style="{
            width: '200px',
            height: 'auto'
          }"
          :src="detailForm.img1"
          :preview-src-list="[detailForm.img1]"
        />
      </div> -->
    </el-card>
    <div class="h15" />
    <el-button type="primary" @click="back">返回</el-button>
  </div>
</template>
<script>
import detailMixin from '@/mixins/detailMixin';
import { findArticleDownLoadById } from 'api/resource';
import { statusMap } from 'assets/data-maps';
import { formatTimer } from '@/utils';
export default {
  name: 'ArticleDetail',
  filters: {
    // tag类型
    statusTag(status) {
      return ['danger', 'success'][parseInt(status)];
    },

    // 文章状态
    statusName(status) {
      return statusMap.find(item => item.value === parseInt(status)).label;
    },

    // 格式化时间
    createTimeFormat(cellvalue) {
      return formatTimer(cellvalue / 1000, true);
    }
  },
  mixins: [detailMixin],
  data() {
    return {
      titleById: false,
      detailForm: {
        title: '1234'
      }
    };
  },
  mounted() {
    this.id = (this.$route.params && this.$route.params.id) || null;
    if (this.id) {
      this.getDetail();
    }
  },
  methods: {
    async getDetail() {
      const { code, data } = await findArticleDownLoadById({ id: this.id });
      if (code === 0) {
        this.detailForm = data;
        this.setTitle(this.detailForm.title);
      } else {
        this.$router.back();
      }
    },
    back() {
      this.$router.back();
    }
  }
};
</script>

<style lang="scss" scoped>
.srm-table_img {
  cursor: pointer;
}

.label-tag {
  margin: 2px;
}
</style>
