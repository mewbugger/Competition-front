<template>
  <div id="teamCardList">
    <van-card v-for="team in props.teamList"  :thumb="ikun" :title="`${team.name}`">
      <template #bottom>
        <div>
          {{ `队伍人数: ${team.hasJoinNum}/${team.maxNum}` }}
        </div>
        <div v-if="team.expireTime">
          {{ '过期时间: ' + team.expireTime }}
        </div>
        <div>
          {{ '创建时间: ' + team.createTime }}
        </div>
      </template>
      <template #footer>
        <van-button size="small" type="primary" v-if="team.userId !== currentUser?.id && !team.hasJoin" plain
          @click="preJoinTeam(team)">
          加入队伍
        </van-button>
        <van-button v-if="team.userId === currentUser?.id" size="small" plain @click="doUpdateTeam(team.id)">更新队伍
        </van-button>
        <!-- 仅加入队伍可见 -->
        <van-button v-if="team.userId !== currentUser?.id && team.hasJoin" size="small" plain
          @click="doQuitTeam(team.id)">退出队伍
        </van-button>
        <van-button v-if="team.userId === currentUser?.id" size="small" type="danger" plain
          @click="doDeleteTeam(team.id)">解散队伍
        </van-button>
      </template>
    </van-card>
    <van-dialog v-model:show="show" title="请输入密码" show-cancel-button @confirm="doJoinTeam" @cancel="doJoinCancel">
      <van-field v-model="password" placeholder="请输入密码" />
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { TeamType } from "../models/team";
import ikun from '../assets/ikun.png';
import myAxios from "../plugins/myAxios";
import { Dialog, Toast } from "vant";
import { onMounted, reactive, ref, watchEffect } from "vue";
import { getCurrentUser } from "../services/user";
import { useRouter } from "vue-router";

interface TeamCardListProps {
  teamList: TeamType[];
}

const props = withDefaults(defineProps<TeamCardListProps>(), {
  // @ts-ignore
  teamList: [] as TeamType[],
});

//const teamList = ref();

const teamList = reactive(props.teamList);
const password = ref('');
const joinTeamId = ref(0);
const currentUser = ref();
const show = ref(false);
const router = useRouter();

onMounted(async () => {
  currentUser.value = await getCurrentUser();
})

const fetchLatestTeamList = async (val = '') => {
  const res = await myAxios.get("/team/list", {
    params: {
      searchText: val,
      pageNum: 1,
    },
  });
  if (res?.code === 0) {
    return res.data;
  } else {
    Toast.fail('加载队伍失败，请刷新重试');
  }
}

// 刷新 teamList
const refreshTeamList = async () => {
  // 执行获取最新 teamList 的操作，比如重新调用接口获取最新的队伍列表数据
  // 更新 props.teamList 的值
  console.log("===================")
  const latestTeamList = await fetchLatestTeamList();
  teamList.splice(0, teamList.length, ...latestTeamList);
  console.log(teamList)
};







const preJoinTeam = (team: TeamType) => {
  joinTeamId.value = team.id;
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
    refreshTeamList();
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
