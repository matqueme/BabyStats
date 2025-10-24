import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/pages/Dashboard.vue'),
    meta: { title: 'Tableau de bord' },
  },
  {
    path: '/new',
    name: 'new',
    component: () => import('@/pages/NewMatch.vue'),
    meta: { title: 'Nouveau match' },
  },
  {
    path: '/matches',
    name: 'matches',
    component: () => import('@/pages/Matches.vue'),
    meta: { title: 'Matches' },
  },
  {
    path: '/players',
    name: 'players',
    component: () => import('@/pages/Players.vue'),
    meta: { title: 'Joueurs' },
  },
  {
    path: '/teams',
    name: 'teams',
    component: () => import('@/pages/Teams.vue'),
    meta: { title: 'Équipes' },
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: () => import('@/pages/Leaderboard.vue'),
    meta: { title: 'Classement' },
  },
  {
    path: '/stats',
    name: 'stats',
    component: () => import('@/pages/Stats.vue'),
    meta: { title: 'Statistiques' },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/pages/Settings.vue'),
    meta: { title: 'Réglages' },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/pages/Profile.vue'),
    meta: { title: 'Mon profil' },
  },
  {
    path: '/rooms',
    name: 'rooms',
    component: () => import('@/pages/Rooms.vue'),
    meta: { title: 'Mes Rooms' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
