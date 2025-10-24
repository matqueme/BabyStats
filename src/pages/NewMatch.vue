<template>
  <el-card shadow="never">
    <template #header><strong>Nouveau match</strong></template>
    <el-form label-width="140px" @submit.prevent>
      <el-form-item label="Mode">
        <el-select v-model="mode" style="width: 200px">
          <el-option label="1 vs 1" value="1v1" />
          <el-option label="2 vs 2" value="2v2" />
        </el-select>
      </el-form-item>
      <el-form-item label="Joueurs / Équipes">
        <div class="teams">
          <div class="team">
            <div class="label"><PhUsersFour class="icon-left" /> Équipe A</div>
            <div class="players">
              <el-select
                v-for="i in teamSize"
                :key="'A' + i"
                v-model="teamA[i - 1]"
                filterable
                allow-create
                default-first-option
                placeholder="Choisir ou créer"
                style="min-width: 220px"
              >
                <el-option v-for="p in players" :key="p.id" :label="p.name" :value="p.id" />
              </el-select>
            </div>
          </div>
          <div class="team">
            <div class="label"><PhUsersFour class="icon-left" /> Équipe B</div>
            <div class="players">
              <el-select
                v-for="i in teamSize"
                :key="'B' + i"
                v-model="teamB[i - 1]"
                filterable
                allow-create
                default-first-option
                placeholder="Choisir ou créer"
                style="min-width: 220px"
              >
                <el-option v-for="p in players" :key="p.id" :label="p.name" :value="p.id" />
              </el-select>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="Score">
        <el-input-number v-model="scoreA" :min="0" />
        <span style="margin: 0 8px">-</span>
        <el-input-number v-model="scoreB" :min="0" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="!canSave" @click="save">
          <PhFloppyDisk class="icon-left" />
          Enregistrer
        </el-button>
        <el-button @click="reset">
          <PhArrowCounterClockwise class="icon-left" />
          Réinitialiser
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useBabyStore } from '../stores/baby'
import { PhUsersFour, PhFloppyDisk, PhArrowCounterClockwise } from '@phosphor-icons/vue'

defineOptions({ name: 'NewMatchPage' })

const store = useBabyStore()
const { players } = storeToRefs(store)

const mode = ref<'1v1' | '2v2'>('1v1')
const teamSize = computed(() => (mode.value === '1v1' ? 1 : 2))
const teamA = ref<string[]>([])
const teamB = ref<string[]>([])
const scoreA = ref(0)
const scoreB = ref(0)

watch(mode, () => {
  teamA.value = []
  teamB.value = []
})

function ensurePlayers(ids: string[]) {
  // For allow-create, if id not found as existing player id, treat it as a name and create
  return ids.map((val) => {
    const exists = players.value.find((p) => p.id === val)
    if (exists) return exists.id
    const created = store.addPlayer(val)
    return created.id
  })
}

const canSave = computed(
  () =>
    teamA.value.length === teamSize.value &&
    teamB.value.length === teamSize.value &&
    teamA.value.every(Boolean) &&
    teamB.value.every(Boolean),
)

function reset() {
  teamA.value = []
  teamB.value = []
  scoreA.value = 0
  scoreB.value = 0
}

function save() {
  const pA = ensurePlayers(teamA.value)
  const pB = ensurePlayers(teamB.value)
  const tA = store.ensureTeamForPlayers(pA)
  const tB = store.ensureTeamForPlayers(pB)
  store.recordMatch({
    mode: mode.value,
    teamAId: tA.id,
    teamBId: tB.id,
    scoreA: scoreA.value,
    scoreB: scoreB.value,
  })
  reset()
}
</script>

<style scoped>
.teams {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
.team .label {
  font-weight: 600;
  margin-bottom: 6px;
}
.players {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.icon-left {
  margin-right: 6px;
  vertical-align: -2px;
}
@media (min-width: 900px) {
  .teams {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
