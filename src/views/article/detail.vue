<template>
  <div>
    <el-card>
      <div slot="header">{{ detailForm.title }}</div>
      <el-row>
        <el-col :span="24" class="flex-align mb-8">
          <span>文章链接：</span>
          <el-link :href="detailForm.url" type="primary" target="_blank">{{ detailForm.url }}</el-link>
        </el-col>
        <el-col :span="24" class="flex-align mb-8">
          <span>文章状态：</span>
          <el-tag v-if="detailForm.state" :type="detailForm.state | statusTag">{{ detailForm.state | statusName }}</el-tag>
        </el-col>
        <el-col :span="24" class="flex-align mb-8">
          <span>文章标签：</span>
          <el-tag v-for="tag in detailForm.labelList" :key="tag.id" class="label-tag">
            {{ tag.labelName }}
          </el-tag>
        </el-col>
        <el-col :span="24" class="flex-align mb-8">
          <span>是否置顶：</span>
          <el-switch v-model="detailForm.isTop" disabled></el-switch>
        </el-col>
        <el-col :span="24" class="flex-align mb-8">
          <span>发布时间：{{ detailForm.createTime | createTimeFormat }}</span>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <div slot="header">文章封面</div>
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
      </div>
    </el-card>
    <div class="h15" />
    <el-button type="primary" @click="back">返回</el-button>
  </div>
</template>
<script>
import detailMixin from '@/mixins/detailMixin';
import { fetchArticle } from 'api/article';
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
      const { code, data } = await fetchArticle({ id: this.id });
      if (code === 0) {
        this.detailForm = data;
        this.detailForm.isTop = parseInt(data.isTop) ? true : false;
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
