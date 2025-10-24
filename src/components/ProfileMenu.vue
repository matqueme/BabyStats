<template>
  <div class="profile-menu">
    <el-dropdown trigger="click" @command="handleCommand">
      <div class="profile-trigger">
        <div class="avatar">
          {{ avatarText }}
        </div>
        <div class="name-wrapper hidden md:block">
          <div class="display-name">{{ displayName }}</div>
          <div class="room-label" v-if="activeRoom">{{ activeRoom.name }}</div>
        </div>
        <PhCaretDown class="caret" />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="profile">
            <PhUser class="menu-icon" />
            Mon profil
          </el-dropdown-item>
          <el-dropdown-item command="rooms" divided>
            <PhDoorOpen class="menu-icon" />
            Gérer les rooms
          </el-dropdown-item>
          <el-dropdown-item command="switchRoom" v-if="hasMultipleRooms">
            <PhSwap class="menu-icon" />
            Changer de room
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProfileStore } from '../stores/profile'
import { PhUser, PhDoorOpen, PhSwap, PhCaretDown } from '@phosphor-icons/vue'

const router = useRouter()
const profileStore = useProfileStore()

const displayName = computed(() => profileStore.displayName)
const activeRoom = computed(() => profileStore.activeRoom)
const hasMultipleRooms = computed(() => profileStore.activeRooms.length > 1)

const avatarText = computed(() => {
  if (profileStore.profile?.avatar) return profileStore.profile.avatar
  const name = displayName.value
  if (name === 'Utilisateur') return '👤'
  const parts = name.split(' ').filter(Boolean)
  if (parts.length >= 2) {
    const first = parts[0]?.[0]
    const second = parts[1]?.[0]
    if (first && second) {
      return (first + second).toUpperCase()
    }
  }
  return name[0]?.toUpperCase() || '👤'
})

function handleCommand(command: string) {
  if (command === 'profile') {
    router.push('/profile')
  } else if (command === 'rooms') {
    router.push('/rooms')
  } else if (command === 'switchRoom') {
    // TODO: Open room switcher modal
    router.push('/rooms')
  }
}
</script>

<style scoped>
.profile-menu {
  display: flex;
  align-items: center;
}
.profile-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s;
}
.profile-trigger:hover {
  background: var(--el-fill-color-light);
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--el-color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}
.name-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
}
.display-name {
  font-size: 14px;
  font-weight: 600;
}
.room-label {
  font-size: 11px;
  color: var(--el-text-color-secondary);
}
.caret {
  font-size: 16px;
  color: var(--el-text-color-secondary);
}
.menu-icon {
  margin-right: 8px;
  vertical-align: -2px;
}
</style>
