<template>
  <div class="dashboard">
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
      <el-button type="primary" @click="$router.push('/new')" class="main-action">
        <PhPlusCircle class="icon-left" />
        Enregistrer un match
      </el-button>
    </el-card>

    <el-card shadow="never">
      <template #header>
        <strong>Classement (Top 5)</strong>
      </template>
      <el-table
        :data="leaderboard.slice(0, 5)"
        size="small"
        v-loading="loading"
        empty-text="Aucun joueur"
      >
        <el-table-column label="#" type="index" width="50" />
        <el-table-column prop="name" label="Joueur" />
        <el-table-column prop="elo" label="Elo" width="100" />
        <el-table-column prop="winRate" label="Win%" width="100">
          <template #default="{ row }">{{ (row.winRate * 100).toFixed(0) }}%</template>
        </el-table-column>
      </el-table>
      <div class="card-footer">
        <el-button text @click="$router.push('/leaderboard')">
          Voir le classement complet
          <PhArrowRight class="icon-right" />
        </el-button>
      </div>
    </el-card>

    <!-- Quick access cards -->
    <div class="quick-links">
      <el-card shadow="hover" class="quick-card" @click="$router.push('/players')">
        <div class="quick-icon">
          <PhUsers :size="32" />
        </div>
        <div class="quick-label">Gérer les joueurs</div>
        <div class="quick-count">{{ totalPlayers }} joueur(s)</div>
      </el-card>

      <el-card shadow="hover" class="quick-card" @click="$router.push('/teams')">
        <div class="quick-icon">
          <PhUsersFour :size="32" />
        </div>
        <div class="quick-label">Voir les équipes</div>
        <div class="quick-count">{{ totalTeams }} équipe(s)</div>
      </el-card>

      <el-card shadow="hover" class="quick-card" @click="$router.push('/stats')">
        <div class="quick-icon">
          <PhChartLine :size="32" />
        </div>
        <div class="quick-label">Statistiques</div>
        <div class="quick-count">Analyses détaillées</div>
      </el-card>
    </div>

    <p v-if="!totalMatches" class="hint">
      Aucun match pour l'instant — commence par créer des joueurs et enregistrer un match.
    </p>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useBabyStore } from '@/stores/baby'
import { computed, onMounted, ref } from 'vue'
import { PhPlusCircle, PhUsers, PhUsersFour, PhChartLine, PhArrowRight } from '@phosphor-icons/vue'

defineOptions({ name: 'DashboardPage' })

const store = useBabyStore()
const { leaderboard } = storeToRefs(store)
const totalPlayers = computed(() => store.currentPlayers.length)
const totalTeams = computed(() => store.currentTeams.length)
const totalMatches = computed(() => store.currentMatches.length)
const loading = ref(false)

onMounted(() => {
  store.initFromStorage()
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.kpis {
  display: flex;
  gap: 24px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.kpi .label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.kpi .value {
  font-size: 20px;
  font-weight: 700;
}
.main-action {
  width: 100%;
}
.card-footer {
  margin-top: 12px;
  text-align: center;
}
.quick-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}
.quick-card {
  cursor: pointer;
  text-align: center;
  padding: 16px;
  transition: transform 0.2s;
}
.quick-card:hover {
  transform: translateY(-2px);
}
.quick-icon {
  color: var(--el-color-primary);
  margin-bottom: 8px;
}
.quick-label {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}
.quick-count {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.icon-left {
  margin-right: 6px;
  vertical-align: -2px;
}
.icon-right {
  margin-left: 6px;
  vertical-align: -2px;
}
.hint {
  color: var(--el-text-color-secondary);
  text-align: center;
  padding: 20px;
}
</style>
