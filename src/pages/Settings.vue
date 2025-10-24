<template>
  <div class="settings-page">
    <el-card shadow="never">
      <template #header><strong>Navigation rapide</strong></template>
      <div class="nav-grid">
        <el-button @click="$router.push('/profile')" class="nav-btn">
          <PhUser class="icon-left" />
          Mon profil
        </el-button>
        <el-button @click="$router.push('/rooms')" class="nav-btn">
          <PhDoorOpen class="icon-left" />
          Mes Rooms
        </el-button>
        <el-button @click="$router.push('/players')" class="nav-btn">
          <PhUsers class="icon-left" />
          Gérer les joueurs
        </el-button>
        <el-button @click="$router.push('/teams')" class="nav-btn">
          <PhUsersFour class="icon-left" />
          Voir les équipes
        </el-button>
        <el-button @click="$router.push('/stats')" class="nav-btn">
          <PhChartLineUp class="icon-left" />
          Statistiques
        </el-button>
        <el-button @click="$router.push('/leaderboard')" class="nav-btn">
          <PhTrophy class="icon-left" />
          Classement
        </el-button>
      </div>
    </el-card>

    <el-card shadow="never">
      <template #header><strong>Données</strong></template>
      <div class="actions">
        <el-button type="warning" @click="backup">
          <PhArrowSquareOut class="icon-left" />
          Exporter les données
        </el-button>
        <el-upload :auto-upload="false" :on-change="importFile" accept="application/json">
          <el-button>
            <PhUploadSimple class="icon-left" />
            Importer un fichier JSON
          </el-button>
        </el-upload>
      </div>
      <el-divider />
      <el-button type="danger" plain @click="clearAll">
        <PhTrash class="icon-left" />
        Vider toutes les données
      </el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useBabyStore } from '../stores/baby'
import type { UploadFile } from 'element-plus'
import {
  PhArrowSquareOut,
  PhUploadSimple,
  PhTrash,
  PhUser,
  PhUsers,
  PhUsersFour,
  PhChartLineUp,
  PhTrophy,
  PhDoorOpen,
} from '@phosphor-icons/vue'

defineOptions({ name: 'SettingsPage' })

const store = useBabyStore()

function backup() {
  const data = localStorage.getItem('babystats:v1') ?? '{}'
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `babystats-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

async function importFile(file: UploadFile) {
  const f: File = file.raw as File
  const text = await f.text()
  localStorage.setItem('babystats:v1', text)
  store.initFromStorage()
}

function clearAll() {
  localStorage.removeItem('babystats:v1')
  store.initFromStorage()
}
</script>

<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}
.nav-btn {
  width: 100%;
  justify-content: flex-start;
}
.actions {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
.icon-left {
  margin-right: 6px;
  vertical-align: -2px;
}
</style>
