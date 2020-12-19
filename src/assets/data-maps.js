import { fetchList } from '@/api/label';

export const statusMap = [{ label: '发布', value: 0 }, { label: '禁用', value: 1 }];

export async function  getLabel() {
  let { data } = await fetchList();
  let arr = data.map(item => {
    return {
      label: item.labelName,
      value: item.id
    }
  });
  return arr
}

