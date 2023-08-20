<template>
    <div id="teamPage">
      <van-search v-model="searchText" placeholder="搜索队伍" @search="onSearch" />
      <competition-card-list :competitionList = "competitionList" />
      <van-empty v-if="competitionList?.length < 1" description="数据为空"/>
    </div>
  </template>
  
  <script setup lang="ts">
  
  import {useRouter} from "vue-router";
  import CompetitionCardList from "../components/CompetitionCardList.vue";
  import {onMounted, ref} from "vue";
  import myAxios from "../plugins/myAxios";
  import {Toast} from "vant";
  
  const router = useRouter();
  const searchText = ref('');
  
  const competitionList = ref([]);
  
  /**
   * 搜索队伍
   * @param val
   * @returns {Promise<void>}
   */
  const listTeam = async (val = '') => {
    const res = await myAxios.get("/competition/list/my/join", {
      params: {
        searchText: val,
        pageNum: 1,
      },
    });
    if (res?.code === 0) {
      competitionList.value = res.data;
    } else {
      Toast.fail('加载队伍失败，请刷新重试');
    }
  }
  
  
  // 页面加载时只触发一次
  onMounted( () => {
    listTeam();
  })
  
  const onSearch = (val) => {
    listTeam(val);
  };
  
  </script>
  
  <style scoped>
  #teamPage {
  
  }
  </style>
  