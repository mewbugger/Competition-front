<template>
    <div id="competitionCardList">
      <van-card v-for="competition in props.competitionList"  :thumb="ikun" :title="`${competition.name}`">
        <template #bottom>
          <!-- <div>
            {{ `队伍人数: ${team.hasJoinNum}/${team.maxNum}` }}
          </div> -->
          <div v-if="competition.expireTime">
            {{ '过期时间: ' + competition.expireTime }}
          </div>
          <div>
            {{ '创建时间: ' + competition.createTime }}
          </div>
        </template>
        <template #footer>
          <van-button size="small" type="primary"  plain
            @click="preJoinCompetition(competition)">
            参加竞赛
          </van-button>
          <!-- 仅加入队伍可见 -->
          <!-- <van-button v-if="team.userId !== currentUser?.id && team.hasJoin" size="small" plain
            @click="doQuitTeam(team.id)">退出队伍
          </van-button>
          <van-button v-if="team.userId === currentUser?.id" size="small" type="danger" plain
            @click="doDeleteTeam(team.id)">解散队伍
          </van-button> -->
        </template>
      </van-card>
      <!-- <van-dialog v-model:show="show" title="请输入密码" show-cancel-button @confirm="doJoinTeam" @cancel="doJoinCancel">
        <van-field v-model="password" placeholder="请输入密码" />
      </van-dialog> -->
    </div>
  </template>
  
  <script setup lang="ts">
  import { CompetitionType } from "../models/competition";
  import ikun from '../assets/ikun.png';
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
  
  const password = ref('');
  const joinTeamId = ref(0);
  const currentUser = ref();
  const show = ref(false);
  const router = useRouter();
  
  onMounted(async () => {
    currentUser.value = await getCurrentUser();
  })
  
  
  
  
  
  
  const preJoinCompetition = (competition: CompetitionType) => {
    joinTeamId.value = competition.id;
    show.value = true
    //doJoinTeam()
  }
  
  /**
   * 加入成功后把密码框的内容清空
   */
  const doJoinCancel = () => {
    joinTeamId.value = 0;
    password.value = '';
  }
  
  /**
   * 加入队伍
   */
  const doJoinTeam = async () => {
    if (!joinTeamId.value) {
      return;
    }
    const res = await myAxios.post('/team/join', {
      teamId: joinTeamId.value,
      password: password.value
    });
    if (res?.code === 0) {
      Toast.success('加入成功');
      doJoinCancel();
    } else {
      Toast.fail('加入失败');
    }
  }
  
  /**
   * 跳转至更新队伍页
   * @param id
   */
  const doUpdateTeam = (id: number) => {
    router.push({
      path: '/team/update',
      query: {
        id,
      }
    })
  }
  
  /**
   * 退出队伍
   * @param id
   */
  const doQuitTeam = async (id: number) => {
    const res = await myAxios.post('/team/quit', {
      teamId: id
    });
    if (res?.code === 0) {
      Toast.success('操作成功');
      
    } else {
      Toast.fail('操作失败');
    }
  }
  
  /**
   * 解散队伍
   * @param id
   */
  const doDeleteTeam = async (id: number) => {
    const res = await myAxios.post('/team/delete', {
      id,
    });
    if (res?.code === 0) {
      Toast.success('操作成功');
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
  