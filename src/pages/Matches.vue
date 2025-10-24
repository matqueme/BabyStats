<template>
  <el-card shadow="never">
    <template #header>
      <div class="header-with-action">
        <strong>Historique des matches</strong>
        <el-button size="small" @click="$router.push('/teams')">
          <PhUsers class="icon-left" />
          Voir les équipes
        </el-button>
      </div>
    </template>
    <el-table :data="matches" size="small" v-loading="false" empty-text="Aucun match">
      <el-table-column type="index" width="50" />
      <el-table-column label="Date" width="180">
        <template #default="{ row }">{{ new Date(row.date).toLocaleString() }}</template>
      </el-table-column>
      <el-table-column label="Équipe A">
        <template #default="{ row }">{{ teamName(row.teamAId) }} ({{ row.scoreA }})</template>
      </el-table-column>
      <el-table-column label="Équipe B">
        <template #default="{ row }">{{ teamName(row.teamBId) }} ({{ row.scoreB }})</template>
      </el-table-column>
      <el-table-column prop="mode" label="Mode" width="100" />
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBabyStore } from '../stores/baby'
import { PhUsers } from '@phosphor-icons/vue'

defineOptions({ name: 'MatchesPage' })

const store = useBabyStore()
const matches = computed(() => store.currentMatches)
const teams = computed(() => store.currentTeams)

function teamName(id: string) {
  return teams.value.find((t) => t.id === id)?.name || '—'
}
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
