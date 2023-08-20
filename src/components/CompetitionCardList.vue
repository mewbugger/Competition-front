<template>
    <div id="competitionCardList">
      <van-card v-for="competition in props.competitionList"  :thumb="logo" :title="`${competition.name}`">
        <template #bottom>
          <div>
            {{ `竞赛等级:` + competition.level }}
          </div>
          <div v-if="competition.expireTime">
            {{ '过期时间: ' + competition.expireTime }}
          </div>
          <div>
            {{ '创建时间: ' + competition.createTime }}
          </div>
        </template>
        <template #footer>
          <van-button v-if="!competition.hasJoin && !competition.leader" size="small" type="primary"  plain
            @click="preJoinCompetition(competition)">
            参加竞赛
          </van-button>
          <!-- 仅加入队伍可见 -->
          <van-button v-if="competition.hasJoin && competition.leader" size="small" plain
            @click="preQuitCompetition(competition)">
            退出竞赛
          </van-button>
          
        </template>
      </van-card>
      <van-dialog v-model:show="show" title="请输入队伍名称" show-cancel-button @confirm="doJoinCompetition" @cancel="doJoinCancel">
        <van-field v-model="teamName" placeholder="请输入队伍名称" />
      </van-dialog>
      <van-dialog v-model:show="show1" title="请输入队伍名称" show-cancel-button @confirm="doQuitCompetition" @cancel="doQuitCancel">
        <van-field v-model="teamName" placeholder="请输入队伍名称" />
      </van-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import { CompetitionType } from "../models/competition";
  import logo from '../assets/logo.png';
  import myAxios from "../plugins/myAxios";
  import { Dialog, Toast } from "vant";
  import { onMounted,  ref } from "vue";
  import { getCurrentUser } from "../services/user";
  import { useRouter } from "vue-router";
  
  interface CompetitionCardListProps {
    competitionList: CompetitionType[];
  }
  
  const props = withDefaults(defineProps<CompetitionCardListProps>(), {
    // @ts-ignore
    competitionList: [] as CompetitionType[],
  });
  
  //const teamList = ref();
  
  const teamName = ref('');
  const joinCompetitionId = ref(0);
  const quitCompetitionId = ref(0);
  const currentUser = ref();
  const show = ref(false);
  const show1 = ref(false);
  const router = useRouter();
  
  onMounted(async () => {
    currentUser.value = await getCurrentUser();
  })
  
  
  
  
  const preJoinCompetition = (competition: CompetitionType) => {
    joinCompetitionId.value = competition.competitionId;
    show.value = true
  }

  const preQuitCompetition = (competition: CompetitionType) => {
    quitCompetitionId.value = competition.competitionId;
    show1.value = true
  }
  
  /**
   * 加入成功后把输入框的内容清空
   */
  const doJoinCancel = () => {
    joinCompetitionId.value = 0;
    teamName.value = '';
  }

  /**
   * 退出成功后把输入框的内容清空
   */
  const doQuitCancel = () => {
    quitCompetitionId.value = 0;
    teamName.value = '';
  }
  
  /**
   * 加入竞赛
   */
  const doJoinCompetition = async () => {
    if (!joinCompetitionId.value) {
      return;
    }
    const res = await myAxios.post('/competition/join', {
      competitionId: joinCompetitionId.value,
      teamName: teamName.value
    });
    if (res?.code === 0) {
      Toast.success('加入成功');
      doJoinCancel();
    } else {
      Toast.fail('加入失败');
    }
  }
  
  
  /**
   * 退出队伍
   * @param id
   */
  const doQuitCompetition = async (competitionId: number) => {
    if(!quitCompetitionId.value){
      return;
    }
    const res = await myAxios.post('/competition/quit', {
      competitionId: quitCompetitionId.value,
      teamName: teamName.value
    });
    if (res?.code === 0) {
      Toast.success('操作成功');
      doQuitCancel();
    } else {
      Toast.fail('操作失败');
    }
  }
  
  
  
  </script>
  
  <style scoped>
  #teamCardList :deep(.van-image__img) {
    height: 128px;
    object-fit: unset;
  }
  </style>
  