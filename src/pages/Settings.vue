<template>
  <el-card shadow="never">
    <template #header><strong>Réglages</strong></template>
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
</template>

<script setup lang="ts">
import { useBabyStore } from '../stores/baby'
import type { UploadFile } from 'element-plus'
import { PhArrowSquareOut, PhUploadSimple, PhTrash } from '@phosphor-icons/vue'

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
