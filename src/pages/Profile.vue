<template>
  <div class="profile-page">
    <el-card shadow="never">
      <template #header><strong>Mon profil</strong></template>
      <el-form label-width="120px" @submit.prevent>
        <el-form-item label="Prénom">
          <el-input v-model="form.firstName" placeholder="Votre prénom" />
        </el-form-item>
        <el-form-item label="Nom">
          <el-input v-model="form.lastName" placeholder="Votre nom" />
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="form.email" type="email" placeholder="email@exemple.com" />
        </el-form-item>
        <el-form-item label="Avatar">
          <div class="avatar-selector">
            <div
              v-for="emoji in avatarOptions"
              :key="emoji"
              class="avatar-option"
              :class="{ selected: form.avatar === emoji }"
              @click="form.avatar = emoji"
            >
              {{ emoji }}
            </div>
          </div>
          <el-input
            v-model="customAvatar"
            placeholder="Ou entrez votre emoji favori"
            style="margin-top: 12px; max-width: 200px"
            @input="form.avatar = customAvatar"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">
            <PhFloppyDisk class="icon-left" />
            Enregistrer
          </el-button>
          <el-button @click="$router.back()">Annuler</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" v-if="profileStore.profile">
      <template #header><strong>Informations</strong></template>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Membre depuis</div>
          <div class="info-value">
            {{ new Date(profileStore.profile.createdAt).toLocaleDateString() }}
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useProfileStore } from '../stores/profile'
import { PhFloppyDisk } from '@phosphor-icons/vue'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'ProfilePage' })

const profileStore = useProfileStore()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  avatar: '👤',
})

const customAvatar = ref('')

const avatarOptions = ['👤', '😎', '🎮', '⚽', '🏆', '🎯', '🔥', '⭐', '💪', '🎲']

onMounted(() => {
  if (profileStore.profile) {
    form.firstName = profileStore.profile.firstName
    form.lastName = profileStore.profile.lastName
    form.email = profileStore.profile.email || ''
    form.avatar = profileStore.profile.avatar || '👤'
  }
})

function save() {
  profileStore.setProfile({
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim() || undefined,
    avatar: form.avatar || '👤',
  })
  ElMessage.success('Profil mis à jour')
}
</script>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.avatar-selector {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.avatar-option {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border: 2px solid var(--el-border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.avatar-option:hover {
  border-color: var(--el-color-primary);
  transform: scale(1.1);
}
.avatar-option.selected {
  border-color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}
.info-grid {
  display: grid;
  gap: 12px;
}
.info-item {
  display: flex;
  flex-direction: column;
}
.info-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.info-value {
  font-size: 14px;
  font-weight: 600;
}
.icon-left {
  margin-right: 6px;
  vertical-align: -2px;
}
</style>
