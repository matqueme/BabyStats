import { defineStore } from 'pinia'
import type { GoalEvent, Id, Match, NewMatchPayload, Player, PlayerStatsRow, Team } from './types'
import { nowIso, uid } from './types'
import { useProfileStore } from './profile'

const STORAGE_KEY = 'babystats:v1'

function kFactor(matches: number) {
  if (matches < 10) return 40
  if (matches < 30) return 32
  return 24
}

function expectedScore(rA: number, rB: number) {
  return 1 / (1 + Math.pow(10, (rB - rA) / 400))
}

export const useBabyStore = defineStore('baby', {
  state: () => ({
    players: [] as Player[],
    teams: [] as Team[],
    matches: [] as Match[],
    ratings: {} as Record<Id, number>, // ratings for players by id
    // transient cache
    _matchesByPlayer: {} as Record<Id, Match[]>,
  }),
  getters: {
    // Filtered by active room
    currentPlayers(state): Player[] {
      const profileStore = useProfileStore()
      const roomId = profileStore.activeRoomId
      if (!roomId) return state.players
      return state.players.filter((p) => !p.roomId || p.roomId === roomId)
    },
    currentTeams(state): Team[] {
      const profileStore = useProfileStore()
      const roomId = profileStore.activeRoomId
      if (!roomId) return state.teams
      return state.teams.filter((t) => !t.roomId || t.roomId === roomId)
    },
    currentMatches(state): Match[] {
      const profileStore = useProfileStore()
      const roomId = profileStore.activeRoomId
      if (!roomId) return state.matches
      return state.matches.filter((m) => !m.roomId || m.roomId === roomId)
    },
    leaderboard(state): PlayerStatsRow[] {
      const profileStore = useProfileStore()
      const roomId = profileStore.activeRoomId

      // Filter by room
      const players = state.players.filter((p) => !p.roomId || p.roomId === roomId)
      const teams = state.teams.filter((t) => !t.roomId || t.roomId === roomId)
      const matches = state.matches.filter((m) => !m.roomId || m.roomId === roomId)

      const teamHasPlayer = (teamId: Id, playerId: Id) => {
        const t = teams.find((t) => t.id === teamId)
        return !!t?.playerIds.includes(playerId)
      }
      const matchesByPlayer = (playerId: Id) =>
        matches.filter(
          (m) => teamHasPlayer(m.teamAId, playerId) || teamHasPlayer(m.teamBId, playerId),
        )

      const rows: PlayerStatsRow[] = players.map((p) => {
        const m = matchesByPlayer(p.id)
        let wins = 0,
          losses = 0,
          gf = 0,
          ga = 0
        for (const match of m) {
          const isA = teamHasPlayer(match.teamAId, p.id)
          const forGoals = isA ? match.scoreA : match.scoreB
          const agGoals = isA ? match.scoreB : match.scoreA
          gf += forGoals
          ga += agGoals
          if (forGoals > agGoals) wins++
          else if (forGoals < agGoals) losses++
        }
        const matches = m.length
        const winRate = matches ? wins / matches : 0
        const elo = state.ratings[p.id] ?? 1000
        return {
          playerId: p.id,
          name: p.name,
          elo,
          wins,
          losses,
          winRate,
          goalsFor: gf,
          goalsAgainst: ga,
          matches,
        }
      })
      return rows.sort((a, b) => b.elo - a.elo)
    },
  },
  actions: {
    initFromStorage() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw)
          this.players = parsed.players ?? []
          this.teams = parsed.teams ?? []
          this.matches = parsed.matches ?? []
          this.ratings = parsed.ratings ?? {}
        }
      } catch (e) {
        console.warn('Storage init failed', e)
      }
    },
    persist() {
      const payload = {
        players: this.players,
        teams: this.teams,
        matches: this.matches,
        ratings: this.ratings,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    },
    addPlayer(name: string) {
      const profileStore = useProfileStore()
      const p: Player = {
        id: uid(),
        name: name.trim(),
        createdAt: nowIso(),
        active: true,
        roomId: profileStore.activeRoomId || undefined,
      }
      this.players.push(p)
      if (!(p.id in this.ratings)) this.ratings[p.id] = 1000
      this.persist()
      return p
    },
    addTeam(playerIds: Id[], name?: string) {
      const profileStore = useProfileStore()
      const nm =
        name?.trim() ||
        playerIds.map((id) => this.players.find((p) => p.id === id)?.name || '??').join(' & ')
      const t: Team = {
        id: uid(),
        name: nm,
        playerIds: [...playerIds],
        createdAt: nowIso(),
        active: true,
        roomId: profileStore.activeRoomId || undefined,
      }
      this.teams.push(t)
      this.persist()
      return t
    },
    teamContains(teamId: Id, playerId: Id) {
      const team = this.teams.find((t) => t.id === teamId)
      return !!team?.playerIds.includes(playerId)
    },
    matchesByPlayer(playerId: Id) {
      // simple on-the-fly filter; could cache if needed
      return this.matches.filter(
        (m) => this.teamContains(m.teamAId, playerId) || this.teamContains(m.teamBId, playerId),
      )
    },
    ensureTeamForPlayers(players: Id[]): Team {
      const existing = this.teams.find(
        (t) =>
          players.length === t.playerIds.length && players.every((id) => t.playerIds.includes(id)),
      )
      if (existing) return existing
      return this.addTeam(players)
    },
    recordMatch(input: NewMatchPayload) {
      const profileStore = useProfileStore()
      const match: Match = {
        id: uid(),
        date: input.date ?? nowIso(),
        mode: input.mode,
        teamAId: input.teamAId,
        teamBId: input.teamBId,
        scoreA: input.scoreA,
        scoreB: input.scoreB,
        goals: (input.goals ?? []).map((g) => ({ ...g, id: uid() }) as GoalEvent),
        notes: input.notes,
        roomId: profileStore.activeRoomId || undefined,
      }

      this.matches.unshift(match)

      // Update ELO for all players involved
      const teamAPlayers = this.teams.find((t) => t.id === match.teamAId)?.playerIds ?? []
      const teamBPlayers = this.teams.find((t) => t.id === match.teamBId)?.playerIds ?? []
      const avgElo = (ids: Id[]) =>
        ids.reduce((s, id) => s + (this.ratings[id] ?? 1000), 0) / (ids.length || 1)
      const rA = avgElo(teamAPlayers)
      const rB = avgElo(teamBPlayers)

      const sA = match.scoreA === match.scoreB ? 0.5 : match.scoreA > match.scoreB ? 1 : 0
      const sB = 1 - sA
      const eA = expectedScore(rA, rB)
      const eB = 1 - eA

      const playersAPlayed = teamAPlayers
      const playersBPlayed = teamBPlayers

      const matchesByPlayerCount: Record<Id, number> = {}
      for (const p of [...playersAPlayed, ...playersBPlayed]) {
        matchesByPlayerCount[p] = this.matchesByPlayer(p).length
      }

      for (const p of playersAPlayed) {
        const current = this.ratings[p] ?? 1000
        const K = kFactor(matchesByPlayerCount[p] ?? 0)
        this.ratings[p] = Math.round(current + K * (sA - eA))
      }
      for (const p of playersBPlayed) {
        const current = this.ratings[p] ?? 1000
        const K = kFactor(matchesByPlayerCount[p] ?? 0)
        this.ratings[p] = Math.round(current + K * (sB - eB))
      }

      this.persist()
      return match
    },
  },
})
