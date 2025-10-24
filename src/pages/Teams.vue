<template>
  <el-card shadow="never">
    <template #header>
      <div class="header-with-action">
        <strong>Équipes</strong>
        <el-button size="small" @click="$router.push('/players')">
          <PhUser class="icon-left" />
          Gérer les joueurs
        </el-button>
      </div>
    </template>
    <p class="info-text">
      Les équipes sont créées automatiquement lors de l'enregistrement des matches.
    </p>
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
import { computed } from 'vue'
import { useBabyStore } from '../stores/baby'
import type { Team } from '../stores/types'
import { PhUser } from '@phosphor-icons/vue'

defineOptions({ name: 'TeamsPage' })

const store = useBabyStore()
const teams = computed(() => store.currentTeams)
const players = computed(() => store.currentPlayers)

function playerName(id: string) {
  return players.value.find((p) => p.id === id)?.name || '—'
}

function teamPlayersNames(team: Team) {
  return team.playerIds.map((id: string) => playerName(id)).join(' & ')
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
.info-text {
  color: var(--el-text-color-secondary);
  font-size: 13px;
  margin-bottom: 12px;
}
.icon-left {
  margin-right: 6px;
  vertical-align: -2px;
}
</style>
