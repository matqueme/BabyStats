<template>
  <div class="rooms-page">
    <el-card shadow="never">
      <template #header>
        <div class="header-with-action">
          <strong>Mes Rooms</strong>
          <el-button type="primary" size="small" @click="createDialogVisible = true">
            <PhPlus class="icon-left" />
            Nouvelle room
          </el-button>
        </div>
      </template>

      <div class="room-hint">
        <PhInfo :size="16" class="hint-icon" />
        Les rooms permettent de séparer vos statistiques par contexte (tournoi, saison, équipe,
        etc.)
      </div>

      <div class="rooms-grid">
        <div
          v-for="room in activeRooms"
          :key="room.id"
          class="room-card"
          :class="{ active: room.id === profileStore.activeRoomId }"
          @click="selectRoom(room.id)"
        >
          <div class="room-header">
            <PhDoor :size="24" class="room-icon" />
            <el-dropdown
              trigger="click"
              @click.stop
              @command="(cmd: string) => handleRoomAction(cmd, room.id)"
            >
              <el-button circle size="small" text>
                <PhDotsThreeVertical />
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="edit">
                    <PhPencil class="menu-icon" />
                    Modifier
                  </el-dropdown-item>
                  <el-dropdown-item command="archive" divided>
                    <PhArchive class="menu-icon" />
                    Archiver
                  </el-dropdown-item>
                  <el-dropdown-item command="delete" v-if="activeRooms.length > 1">
                    <PhTrash class="menu-icon" />
                    Supprimer
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="room-name">{{ room.name }}</div>
          <div class="room-description" v-if="room.description">{{ room.description }}</div>
          <div class="room-date">Créée le {{ new Date(room.createdAt).toLocaleDateString() }}</div>
          <div class="active-badge" v-if="room.id === profileStore.activeRoomId">
            <PhCheck :size="14" />
            Active
          </div>
        </div>
      </div>

      <el-divider v-if="archivedRooms.length > 0" />

      <div v-if="archivedRooms.length > 0">
        <h4 class="section-title">Rooms archivées</h4>
        <div class="archived-list">
          <div v-for="room in archivedRooms" :key="room.id" class="archived-item">
            <div class="archived-info">
              <PhArchive class="archived-icon" />
              <div>
                <div class="archived-name">{{ room.name }}</div>
                <div class="archived-date">
                  Archivée le {{ new Date(room.createdAt).toLocaleDateString() }}
                </div>
              </div>
            </div>
            <el-button size="small" @click="unarchiveRoom(room.id)">Restaurer</el-button>
          </div>
        </div>
      </div>
    </el-card>

    <!-- Create/Edit Dialog -->
    <el-dialog
      v-model="createDialogVisible"
      :title="editingRoomId ? 'Modifier la room' : 'Nouvelle room'"
      width="500px"
    >
      <el-form label-width="120px" @submit.prevent>
        <el-form-item label="Nom" required>
          <el-input v-model="roomForm.name" placeholder="Ex: Tournoi 2025, Équipe Bureau..." />
        </el-form-item>
        <el-form-item label="Description">
          <el-input
            v-model="roomForm.description"
            type="textarea"
            :rows="3"
            placeholder="Description optionnelle..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createDialogVisible = false">Annuler</el-button>
        <el-button type="primary" @click="saveRoom">
          {{ editingRoomId ? 'Modifier' : 'Créer' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useProfileStore } from '../stores/profile'
import {
  PhPlus,
  PhDoor,
  PhDotsThreeVertical,
  PhPencil,
  PhArchive,
  PhTrash,
  PhCheck,
  PhInfo,
} from '@phosphor-icons/vue'
import { ElMessage, ElMessageBox } from 'element-plus'

defineOptions({ name: 'RoomsPage' })

const profileStore = useProfileStore()

const activeRooms = computed(() => profileStore.activeRooms)
const archivedRooms = computed(() => profileStore.archivedRooms)

const createDialogVisible = ref(false)
const editingRoomId = ref<string | null>(null)
const roomForm = reactive({
  name: '',
  description: '',
})

function selectRoom(id: string) {
  profileStore.setActiveRoom(id)
  ElMessage.success('Room activée')
}

function handleRoomAction(command: string, roomId: string) {
  if (command === 'edit') {
    const room = profileStore.rooms.find((r) => r.id === roomId)
    if (room) {
      editingRoomId.value = roomId
      roomForm.name = room.name
      roomForm.description = room.description || ''
      createDialogVisible.value = true
    }
  } else if (command === 'archive') {
    profileStore.updateRoom(roomId, { archived: true })
    ElMessage.success('Room archivée')
  } else if (command === 'delete') {
    ElMessageBox.confirm('Supprimer cette room et toutes ses données ?', 'Confirmation', {
      type: 'warning',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    })
      .then(() => {
        profileStore.deleteRoom(roomId)
        ElMessage.success('Room supprimée')
      })
      .catch(() => {})
  }
}

function unarchiveRoom(id: string) {
  profileStore.updateRoom(id, { archived: false })
  ElMessage.success('Room restaurée')
}

function saveRoom() {
  if (!roomForm.name.trim()) {
    ElMessage.warning('Le nom est obligatoire')
    return
  }

  if (editingRoomId.value) {
    profileStore.updateRoom(editingRoomId.value, {
      name: roomForm.name.trim(),
      description: roomForm.description.trim() || undefined,
    })
    ElMessage.success('Room modifiée')
  } else {
    profileStore.createRoom(roomForm.name.trim(), roomForm.description.trim() || undefined)
    ElMessage.success('Room créée')
  }

  createDialogVisible.value = false
  editingRoomId.value = null
  roomForm.name = ''
  roomForm.description = ''
}
</script>

<style scoped>
.rooms-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.header-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.room-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: var(--el-color-info-light-9);
  border-radius: 6px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin-bottom: 16px;
}
.hint-icon {
  color: var(--el-color-info);
}
.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
.room-card {
  border: 2px solid var(--el-border-color);
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}
.room-card:hover {
  border-color: var(--el-color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.room-card.active {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}
.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.room-icon {
  color: var(--el-color-primary);
}
.room-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}
.room-description {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
  line-height: 1.4;
}
.room-date {
  font-size: 12px;
  color: var(--el-text-color-placeholder);
}
.active-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--el-color-primary);
  color: white;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}
.section-title {
  margin: 16px 0 12px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}
.archived-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.archived-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
}
.archived-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.archived-icon {
  color: var(--el-text-color-secondary);
}
.archived-name {
  font-weight: 600;
  font-size: 14px;
}
.archived-date {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.icon-left {
  margin-right: 6px;
  vertical-align: -2px;
}
.menu-icon {
  margin-right: 8px;
  vertical-align: -2px;
}
</style>
