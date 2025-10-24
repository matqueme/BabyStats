<template>
  <el-card shadow="never">
    <template #header>
      <div class="header-with-action">
        <strong><PhTrophy class="icon-left" /> Classement (Elo)</strong>
        <el-button size="small" @click="$router.push('/players')">
          <PhUser class="icon-left" />
          Gérer les joueurs
        </el-button>
      </div>
    </template>
    <el-table :data="rows" size="small" empty-text="Aucun joueur">
      <el-table-column label="#" type="index" width="50" />
      <el-table-column prop="name" label="Joueur" />
      <el-table-column prop="elo" label="Elo" width="100" />
      <el-table-column label="Win%" width="100">
        <template #default="{ row }">{{ (row.winRate * 100).toFixed(0) }}%</template>
      </el-table-column>
      <el-table-column prop="matches" label="Matches" width="100" />
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBabyStore } from '../stores/baby'
import { PhTrophy, PhUser } from '@phosphor-icons/vue'

defineOptions({ name: 'LeaderboardPage' })

const store = useBabyStore()
const rows = computed(() => store.leaderboard)
</script>

<style scoped>
.header-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.icon-left {
  margin-right: 6px;
  vertical-align: -2px;
}
</style>
