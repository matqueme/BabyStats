import { defineStore } from 'pinia'

export interface UserProfile {
  firstName: string
  lastName: string
  email?: string
  avatar?: string // URL or emoji
  createdAt: string
}

export interface Room {
  id: string
  name: string
  description?: string
  createdAt: string
  archived: boolean
}

const PROFILE_KEY = 'babystats:profile'
const ROOMS_KEY = 'babystats:rooms'
const ACTIVE_ROOM_KEY = 'babystats:activeRoom'

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: null as UserProfile | null,
    rooms: [] as Room[],
    activeRoomId: null as string | null,
  }),
  getters: {
    activeRoom(state): Room | null {
      if (!state.activeRoomId) return null
      return state.rooms.find((r) => r.id === state.activeRoomId) || null
    },
    activeRooms(state): Room[] {
      return state.rooms.filter((r) => !r.archived)
    },
    archivedRooms(state): Room[] {
      return state.rooms.filter((r) => r.archived)
    },
    hasProfile(state): boolean {
      return !!state.profile
    },
    displayName(state): string {
      if (!state.profile) return 'Utilisateur'
      const { firstName, lastName } = state.profile
      if (firstName && lastName) return `${firstName} ${lastName}`
      if (firstName) return firstName
      if (lastName) return lastName
      return 'Utilisateur'
    },
  },
  actions: {
    initFromStorage() {
      try {
        const profileRaw = localStorage.getItem(PROFILE_KEY)
        if (profileRaw) {
          this.profile = JSON.parse(profileRaw)
        }
        const roomsRaw = localStorage.getItem(ROOMS_KEY)
        if (roomsRaw) {
          this.rooms = JSON.parse(roomsRaw)
        }
        const activeRoomRaw = localStorage.getItem(ACTIVE_ROOM_KEY)
        if (activeRoomRaw) {
          this.activeRoomId = activeRoomRaw
        }

        // Create default room if none exists
        if (this.rooms.length === 0) {
          const defaultRoom = this.createRoom('Partie principale', 'Statistiques générales')
          this.activeRoomId = defaultRoom.id
        }
      } catch (e) {
        console.warn('Profile/Rooms init failed', e)
      }
    },

    setProfile(profile: Partial<UserProfile>) {
      if (!this.profile) {
        this.profile = {
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.email,
          avatar: profile.avatar,
          createdAt: new Date().toISOString(),
        }
      } else {
        this.profile = { ...this.profile, ...profile }
      }
      localStorage.setItem(PROFILE_KEY, JSON.stringify(this.profile))
    },

    createRoom(name: string, description?: string): Room {
      const room: Room = {
        id: uid(),
        name,
        description,
        createdAt: new Date().toISOString(),
        archived: false,
      }
      this.rooms.push(room)
      this.persistRooms()
      return room
    },

    updateRoom(id: string, updates: Partial<Omit<Room, 'id' | 'createdAt'>>) {
      const room = this.rooms.find((r) => r.id === id)
      if (room) {
        Object.assign(room, updates)
        this.persistRooms()
      }
    },

    deleteRoom(id: string) {
      const index = this.rooms.findIndex((r) => r.id === id)
      if (index >= 0) {
        this.rooms.splice(index, 1)
        if (this.activeRoomId === id) {
          this.activeRoomId = this.rooms[0]?.id || null
          localStorage.setItem(ACTIVE_ROOM_KEY, this.activeRoomId || '')
        }
        this.persistRooms()
      }
    },

    setActiveRoom(id: string) {
      const room = this.rooms.find((r) => r.id === id)
      if (room) {
        this.activeRoomId = id
        localStorage.setItem(ACTIVE_ROOM_KEY, id)
      }
    },

    persistRooms() {
      localStorage.setItem(ROOMS_KEY, JSON.stringify(this.rooms))
    },
  },
})
