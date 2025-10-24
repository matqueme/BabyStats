<template>
  <el-card shadow="never">
    <template #header><strong>Joueurs</strong></template>
    <div class="actions">
      <el-input
        v-model="newName"
        placeholder="Nom du joueur"
        style="max-width: 260px"
        @keyup.enter="create"
      >
        <template #prefix>
          <PhUser />
        </template>
      </el-input>
      <el-button type="primary" @click="create" :disabled="!newName.trim()">
        <PhPlusCircle class="icon-left" />
        Ajouter
      </el-button>
    </div>
    <el-table :data="rows" size="small" empty-text="Aucun joueur">
      <el-table-column label="#" type="index" width="50" />
      <el-table-column prop="name" label="Nom" />
      <el-table-column prop="elo" label="Elo" width="100" />
      <el-table-column label="Win%" width="100">
        <template #default="{ row }">{{ (row.winRate * 100).toFixed(0) }}%</template>
      </el-table-column>
      <el-table-column label="Matches" width="100">
        <template #default="{ row }">{{ row.matches }}</template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBabyStore } from '../stores/baby'
import { PhUser, PhPlusCircle } from '@phosphor-icons/vue'

defineOptions({ name: 'PlayersPage' })

const store = useBabyStore()
const rows = computed(() => store.leaderboard)
const newName = ref('')

function create() {
  const name = newName.value.trim()
  if (!name) return
  store.addPlayer(name)
  newName.value = ''
}
</script>

<style scoped>
.actions {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.icon-left {
  margin-right: 6px;
  vertical-align: -2px;
}
</style>
