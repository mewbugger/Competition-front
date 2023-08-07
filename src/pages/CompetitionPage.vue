<template>
    <div id="competitionPage">
      <van-search v-model="searchText" placeholder="搜索竞赛" @search="onSearch" />
      <div style="margin-bottom: 16px" />
      <!-- <van-button class="add-button" type="primary" icon="plus" @click="toAddTeam" /> -->
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
  // const active = ref('public')
  const router = useRouter();
  const searchText = ref('');
  
  /**
   * 切换查询状态
   * @param name
   */
  // const onTabChange = (name) => {
  //   // 查公开
  //   if (name === 'public') {
  //     listTeam(searchText.value, 0);
  //   } else {
  //     // 查加密
  //     listTeam(searchText.value, 2);
  //   }
  // }
  
  // 跳转到创建队伍页
//   const toAddTeam = () => {
//     router.push({
//       path: "/team/add"
//     })
//   }
  
  const competitionList = ref([]);
  
  /**
   * 搜索竞赛
   * @param val
   * @param status
   * @returns {Promise<void>}
   */
  const listCompetition = async (val = '') => {
    const res = await myAxios.get("/competition/list", {
      params: {
        searchText: val,
        pageNum: 1,
      },
    });
    if (res?.code === 0) {
        competitionList.value = res.data;
    } else {
      Toast.fail('加载竞赛失败，请刷新重试');
    }
  }
  
  // 页面加载时只触发一次
  onMounted( () => {
    listCompetition();
  })
  
  const onSearch = (val) => {
    listCompetition(val);
  };
  
  </script>
  
  <style scoped>
  #competitionPage {
  
  }
  </style>
  