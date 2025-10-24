<template>
  <nav class="mobile-tabbar">
    <RouterLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="tab-item"
      :class="{ active: isActive(item.to) }"
      :aria-label="item.label"
    >
      <component :is="item.icon" class="icon" />
      <span class="label">{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useRoute } from 'vue-router'
import {
  PhHouseSimple,
  PhPlusCircle,
  PhListBullets,
  PhTrophy,
  PhGearSix,
} from '@phosphor-icons/vue'

const route = useRoute()

interface Item {
  to: string
  label: string
  icon: Component
}

const items = computed<Item[]>(() => [
  { to: '/', label: 'Accueil', icon: PhHouseSimple },
  { to: '/new', label: 'Nouveau', icon: PhPlusCircle },
  { to: '/matches', label: 'Matches', icon: PhListBullets },
  { to: '/leaderboard', label: 'Classement', icon: PhTrophy },
  { to: '/settings', label: 'Réglages', icon: PhGearSix },
])

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<style scoped>
.mobile-tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(56px + env(safe-area-inset-bottom, 0px));
  display: flex;
  border-top: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
  z-index: 50;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
@media (min-width: 768px) {
  .mobile-tabbar {
    display: none;
  }
}
.tab-item {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: var(--el-text-color-regular);
  text-decoration: none;
  position: relative;
}
.tab-item .icon {
  font-size: 20px;
}
.tab-item .label {
  font-size: 10px;
  line-height: 1;
}
.tab-item.active {
  color: var(--el-color-primary);
  font-weight: 600;
}
.tab-item.active::before {
  content: '';
  position: absolute;
  top: 0;
  height: 2px;
  width: 24px;
  background: var(--el-color-primary);
  border-radius: 2px;
}
</style>
