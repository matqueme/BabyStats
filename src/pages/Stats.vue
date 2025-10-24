<template>
  <div class="stats-page">
    <el-card shadow="never">
      <template #header><strong>Statistiques générales</strong></template>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">{{ totalMatches }}</div>
          <div class="stat-label">Matches joués</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ totalPlayers }}</div>
          <div class="stat-label">Joueurs actifs</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ totalTeams }}</div>
          <div class="stat-label">Équipes créées</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ totalGoals }}</div>
          <div class="stat-label">Buts marqués</div>
        </div>
      </div>
    </el-card>

    <el-card shadow="never" v-if="topScorer">
      <template #header><strong>Meilleur buteur</strong></template>
      <div class="highlight-stat">
        <PhTrophy :size="32" class="trophy-icon" />
        <div>
          <div class="highlight-name">{{ topScorer.name }}</div>
          <div class="highlight-value">{{ topScorer.goalsFor }} buts</div>
        </div>
      </div>
    </el-card>

    <el-card shadow="never">
      <template #header><strong>Fonctionnalités à venir</strong></template>
      <ul class="coming-soon">
        <li>Graphiques d'évolution du classement Elo</li>
        <li>Statistiques head-to-head entre joueurs</li>
        <li>Séries de victoires/défaites</li>
        <li>Statistiques par position (attaque/défense)</li>
        <li>Heatmap des performances</li>
      </ul>
      <el-button type="primary" @click="$router.push('/leaderboard')" class="action-btn">
        <PhChartLineUp class="icon-left" />
        Voir le classement
      </el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBabyStore } from '../stores/baby'
import { PhTrophy, PhChartLineUp } from '@phosphor-icons/vue'

defineOptions({ name: 'StatsPage' })

const store = useBabyStore()
const players = computed(() => store.currentPlayers)
const teams = computed(() => store.currentTeams)
const matches = computed(() => store.currentMatches)
const leaderboard = computed(() => store.leaderboard)

const totalMatches = computed(() => matches.value.length)
const totalPlayers = computed(() => players.value.length)
const totalTeams = computed(() => teams.value.length)
const totalGoals = computed(() => matches.value.reduce((sum, m) => sum + m.scoreA + m.scoreB, 0))

const topScorer = computed(() => {
  if (leaderboard.value.length === 0) return null
  return leaderboard.value.reduce((best, current) =>
    current.goalsFor > best.goalsFor ? current : best,
  )
})
</script>

<style scoped>
.stats-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}
.stat-item {
  text-align: center;
  padding: 12px;
}
.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--el-color-primary);
}
.stat-label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}
.highlight-stat {
  display: flex;
  align-items: center;
  gap: 16px;
}
.trophy-icon {
  color: var(--el-color-warning);
}
.highlight-name {
  font-size: 18px;
  font-weight: 600;
}
.highlight-value {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}
.coming-soon {
  margin: 16px 0;
  padding-left: 24px;
}
.coming-soon li {
  margin: 8px 0;
  color: var(--el-text-color-secondary);
}
.action-btn {
  width: 100%;
}
.icon-left {
  margin-right: 6px;
  vertical-align: -2px;
}
</style>
