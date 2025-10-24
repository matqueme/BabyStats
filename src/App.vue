<template>
  <el-container style="min-height: 100vh">
    <el-aside width="220px" class="sidebar">
      <div class="brand">BabyStats</div>
      <el-menu :default-active="route.path" router>
        <el-menu-item index="/">
          <PhHouseSimple class="menu-icon" />
          <span>Tableau de bord</span>
        </el-menu-item>
        <el-menu-item index="/new">
          <PhPlusCircle class="menu-icon" />
          <span>Nouveau match</span>
        </el-menu-item>
        <el-menu-item index="/matches">
          <PhListBullets class="menu-icon" />
          <span>Matches</span>
        </el-menu-item>
        <el-menu-item index="/players">
          <PhUser class="menu-icon" />
          <span>Joueurs</span>
        </el-menu-item>
        <el-menu-item index="/teams">
          <PhUsers class="menu-icon" />
          <span>Équipes</span>
        </el-menu-item>
        <el-menu-item index="/leaderboard">
          <PhTrophy class="menu-icon" />
          <span>Classement</span>
        </el-menu-item>
        <el-menu-item index="/stats">
          <PhChartLineUp class="menu-icon" />
          <span>Stats</span>
        </el-menu-item>
        <el-menu-item index="/settings">
          <PhGearSix class="menu-icon" />
          <span>Réglages</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="title">{{ route.meta?.title || 'BabyStats' }}</div>
        <div class="spacer" />
        <el-tooltip content="Basculer le thème" placement="bottom">
          <el-button @click="toggleTheme" circle>
            <PhMoon v-if="theme === 'dark'" />
            <PhSun v-else />
          </el-button>
        </el-tooltip>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUiStore, type ThemeMode } from './stores/ui'
import {
  PhHouseSimple,
  PhPlusCircle,
  PhListBullets,
  PhUser,
  PhUsers,
  PhTrophy,
  PhChartLineUp,
  PhGearSix,
  PhSun,
  PhMoon,
} from '@phosphor-icons/vue'
const route = useRoute()
const ui = useUiStore()
const theme = computed<ThemeMode>({
  get: () => ui.theme,
  set: (v) => ui.setTheme(v),
})
function toggleTheme() {
  ui.toggleTheme()
}
</script>

<style scoped>
.sidebar {
  border-right: 1px solid var(--el-border-color);
  padding: 12px 0;
}
.brand {
  font-weight: 700;
  font-size: 18px;
  padding: 0 16px 12px;
}
.menu-icon {
  margin-right: 8px;
  font-size: 18px;
}
.header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--el-border-color);
}
.spacer {
  flex: 1;
}
.title {
  font-weight: 600;
}
</style>
