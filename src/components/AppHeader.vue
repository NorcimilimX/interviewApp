<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ComputedRef} from 'vue'
import { useUserStore } from '@/stores/userStore'
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

interface IMenuItem {
  label: string,
  icon: string,
  path: string
  show: ComputedRef<boolean>
}

const menuItems = ref<IMenuItem[]>([
  {
    label: 'Interview list',
    icon: 'pi pi-list',
    path: '/list',
    show: computed((): boolean => !!userStore.userId)
  },
  {
    label: 'Add interview',
    icon: 'pi pi-plus',
    path: '/',
    show: computed((): boolean => !!userStore.userId)
  },
  {
    label: 'Statistics',
    icon: 'pi pi-chart-pie',
    path: '/chart',
    show: computed((): boolean => !!userStore.userId)
  },
  {
    label: 'Auth',
    icon: 'pi pi-user',
    path: '/auth',
    show: computed((): boolean => !userStore.userId)
  }
])

const signOutMethod = async (): Promise<void> => {
  await signOut(getAuth())
  router.push('/auth')
}
</script>

<template>
  <interview-menu :model="menuItems" class="menu">
    <template #item="{ item, props }">
      <template v-if="item.show">
        <router-link :to="item.path" class="flex align-items-center font-medium" v-bind="props.action">
          <span :class="item.icon" class="p-menuitem-icon"></span>
          <span>{{ item.label }}</span>
        </router-link>
      </template>
    </template>
    <template #end>
      <span v-if="userStore.userId" @click="signOutMethod" class="flex align-items-center menu-exit">
        <span class="pi pi-sign-out p-menuitem-icon"></span>
        <span class="ml-2 font-medium">Logout</span>
      </span>
    </template>
  </interview-menu>
</template>

<style>
.p-menubar {
  background-color: var(--app-main-color);
  margin-bottom: 30px;
}

.menu-exit {
  padding: 0.75rem 1rem;

  &:hover {
    background: var(--app-menu-item-hover-color);
    cursor: pointer;
  }
}
</style>
