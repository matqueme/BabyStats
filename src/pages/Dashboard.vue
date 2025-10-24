<template>
  <div class="grid">
    <el-card shadow="never">
      <template #header>
        <strong>Résumé</strong>
      </template>
      <div class="kpis">
        <div class="kpi">
          <div class="label">Matches</div>
          <div class="value">{{ totalMatches }}</div>
        </div>
        <div class="kpi">
          <div class="label">Joueurs</div>
          <div class="value">{{ totalPlayers }}</div>
        </div>
        <div class="kpi">
          <div class="label">Équipes</div>
          <div class="value">{{ totalTeams }}</div>
        </div>
      </div>
      <el-button type="primary" @click="$router.push('/new')">
        <PhPlusCircle class="icon-left" />
        Enregistrer un match
      </el-button>
    </el-card>
    <el-card shadow="never">
      <template #header>
        <strong>Classement (Top 5)</strong>
      </template>
      <el-table :data="leaderboard.slice(0, 5)" size="small" v-loading="loading">
        <el-table-column label="#" type="index" width="50" />
        <el-table-column prop="name" label="Joueur" />
        <el-table-column prop="elo" label="Elo" width="100" />
        <el-table-column prop="winRate" label="Win%" width="100">
          <template #default="{ row }">{{ (row.winRate * 100).toFixed(0) }}%</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
  <p v-if="!totalMatches" class="hint">
    Aucun match pour l'instant — commence par créer des joueurs et enregistrer un match.
  </p>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBabyStore } from '@/stores/baby'
import { computed, onMounted, ref } from 'vue'
import { PhPlusCircle } from '@phosphor-icons/vue'

defineOptions({ name: 'DashboardPage' })

const store = useBabyStore()
const { players, teams, matches, leaderboard } = storeToRefs(store)
const totalPlayers = computed(() => players.value.length)
const totalTeams = computed(() => teams.value.length)
const totalMatches = computed(() => matches.value.length)
const loading = ref(false)

onMounted(() => {
  store.initFromStorage()
})
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
.kpis {
  display: flex;
  gap: 24px;
  margin-bottom: 12px;
}
.kpi .label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.kpi .value {
  font-size: 20px;
  font-weight: 700;
}
.icon-left {
  margin-right: 6px;
  vertical-align: -2px;
}
.hint {
  color: var(--el-text-color-secondary);
}
@media (min-width: 900px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
