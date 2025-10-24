<template>
  <el-card shadow="never">
    <template #header><strong>Équipes</strong></template>
    <el-table :data="teams" size="small" empty-text="Aucune équipe">
      <el-table-column type="index" width="50" />
      <el-table-column prop="name" label="Nom" />
      <el-table-column label="Joueurs">
        <template #default="{ row }">{{ teamPlayersNames(row) }}</template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBabyStore } from '../stores/baby'
import type { Team } from '../stores/types'

defineOptions({ name: 'TeamsPage' })

const store = useBabyStore()
const { teams, players } = storeToRefs(store)

function playerName(id: string) {
  return players.value.find((p) => p.id === id)?.name || '—'
}

function teamPlayersNames(team: Team) {
  return team.playerIds.map((id: string) => playerName(id)).join(' & ')
}
</script>
