export type Id = string

export type MatchMode = '1v1' | '2v2'

export interface Player {
  id: Id
  name: string
  createdAt: string // ISO
  active: boolean
  roomId?: Id // Added for room filtering
}

export interface Team {
  id: Id
  name: string
  playerIds: Id[] // 1 or 2 players
  createdAt: string
  active: boolean
  roomId?: Id // Added for room filtering
}

export interface GoalEvent {
  id: Id
  matchId: Id
  teamId: Id
  scorerPlayerId: Id
  assistedByPlayerId?: Id
  ownGoal?: boolean
  second?: number
}

export interface Match {
  id: Id
  date: string
  mode: MatchMode
  teamAId: Id
  teamBId: Id
  scoreA: number
  scoreB: number
  goals: GoalEvent[]
  notes?: string
  roomId?: Id // Added for room filtering
}

export interface PlayerStatsRow {
  playerId: Id
  name: string
  elo: number
  wins: number
  losses: number
  winRate: number // 0..1
  goalsFor: number
  goalsAgainst: number
  matches: number
}

export interface NewMatchPayload {
  date?: string
  mode: MatchMode
  teamAId: Id
  teamBId: Id
  scoreA: number
  scoreB: number
  goals?: GoalEvent[]
  notes?: string
}

export interface PersistedState {
  players: Player[]
  teams: Team[]
  matches: Match[]
  ratings: Record<Id, number>
}

export const nowIso = () => new Date().toISOString()
export const uid = () => Math.random().toString(36).slice(2, 10)
