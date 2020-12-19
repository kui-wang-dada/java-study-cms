import { fetchList } from '@/api/label';

export const statusMap = [{ label: '发布', value: 0 }, { label: '禁用', value: 1 }];

export const labelMap = [];

// 获取label
fetchList().then(response => {
  labelMap = response.data.map(item => {
    return {
      label: item.labelName,
      value: item.id
    };
  });
});
