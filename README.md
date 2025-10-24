# BabyStats

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

## Mobile

L'application est entièrement responsive avec une expérience optimisée mobile :

### Navigation mobile

- **Barre d'onglets inférieure** : Accès rapide aux 5 sections principales
  - Accueil (Dashboard)
  - Nouveau match
  - Matches
  - Classement
  - Réglages (hub vers toutes les autres pages)

### Architecture de navigation

Toutes les pages sont accessibles via des liens logiques :

- **Dashboard** → Cartes d'accès rapide vers Joueurs, Équipes, Stats
- **Matches** → Bouton "Voir les équipes"
- **Leaderboard** → Bouton "Gérer les joueurs"
- **Teams** → Bouton "Gérer les joueurs"
- **Stats** → Bouton "Voir le classement"
- **Settings** → Hub de navigation avec boutons vers toutes les sections (Profil, Rooms, Joueurs, Équipes, Stats, Classement)

### Fichiers concernés

- `src/App.vue` : Layout responsive
- `src/components/MobileTabBar.vue` : Barre d'onglets mobile (cachée automatiquement sur desktop)
- `src/components/ProfileMenu.vue` : Menu profil dans le header
- `src/pages/*.vue` : Boutons de navigation inter-pages

### Notes techniques

- Le contenu principal a un padding inférieur sur mobile pour ne pas être masqué par la barre d'onglets
- Support du safe-area (iOS) pour la barre d'onglets
- La sidebar desktop reste inchangée (toujours visible sur écrans ≥ 768px)
- La barre mobile est automatiquement cachée sur desktop (≥ 768px) via media query
