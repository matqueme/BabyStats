<template>
  <el-card shadow="never">
    <template #header><strong>Historique des matches</strong></template>
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
import { storeToRefs } from 'pinia'
import { useBabyStore } from '../stores/baby'

defineOptions({ name: 'MatchesPage' })

const store = useBabyStore()
const { matches, teams } = storeToRefs(store)

function teamName(id: string) {
  return teams.value.find((t) => t.id === id)?.name || '—'
}
</script>
