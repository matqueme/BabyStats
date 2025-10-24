<template>
  <el-card shadow="never">
    <template #header
      ><strong><PhTrophy class="icon-left" /> Classement (Elo)</strong></template
    >
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
import { PhTrophy } from '@phosphor-icons/vue'

defineOptions({ name: 'LeaderboardPage' })

const store = useBabyStore()
const rows = computed(() => store.leaderboard)
</script>

<style scoped>
.icon-left {
  margin-right: 6px;
  vertical-align: -2px;
}
</style>
