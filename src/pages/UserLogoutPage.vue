<template>
    <div class="logout-page">
      <van-button type="danger" round block @click="handleLogout">
        退出登录
      </van-button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from "vue-router";
  import { ref } from "vue";
  import myAxios from "../plugins/myAxios";
  import { Toast } from "vant";
  import { getCurrentUser } from "../services/user";
  
  const router = useRouter();
  
  const handleLogout = async () => {
    const currentUser = await getCurrentUser();
  
    if (!currentUser) {
      Toast.fail('用户未登录');
      return;
    }
  
    // 在这里添加退出登录的逻辑，比如发送一个退出登录的请求
  
    // 假设退出登录的接口为 '/user/logout'
    const res = await myAxios.post('/user/logout', {
      'id': currentUser.id,
    });
  
    console.log(res, '退出登录请求');
    if (res?.code === 0) {
      Toast.success('退出登录成功');
      // 在退出登录成功后，可以重定向到登录页或其他需要的页面
      router.push('/user/login');
    } else {
      Toast.fail('退出登录失败');
    }
  };
  </script>
  
  <style scoped>
  .logout-page {
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  </style>
  