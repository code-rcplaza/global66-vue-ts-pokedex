# Pokédex App

Aplicación web para explorar y gestionar Pokémon favoritos, construida con Vue.js 3 y TypeScript.

## 🚀 TL;DR

- Lista infinita con carga bajo demanda
- Búsqueda local + fallback API
- Favoritos persistentes en localStorage
- Detalle de Pokémon con opción de compartir
- Tests unitarios con Vitest
- Buenas prácticas: Result Pattern, early returns, separación dominio/API

## 🛠️ Stack

**Core:** Vue 3.5, TypeScript 5.9, Vite 7, Vue Router 4  
**Estado:** Pinia + pinia-plugin-persistedstate  
**Errores:** oxide.ts (Result Pattern)  
**Testing:** Vitest, Vue Test Utils, happy-dom  
**Runtime:** Bun 1.1+

## ⚡ Cómo correr el proyecto

### Requisitos

- **Bun** 1.1 o superior
- **Node.js** 18+ (solo si quieres ejecutar scripts fuera de Bun)

### Instalación y ejecución

```bash
# Clonar el repositorio
git clone <url-repositorio>
cd pokedex-app

# Instalar dependencias
bun install

# Iniciar en modo desarrollo
bun run dev

# Build de producción
bun run build

# Preview de la build
bun run preview
```

### Testing

```bash
# Ejecutar tests
bun run test

# Ejecutar tests con cobertura
bun run test:coverage
```

## 📁 Estructura

```text
src/
├── components/       # UI
├── composables/      # Lógica reutilizable
├── services/         # API + mappers
├── stores/           # Estado global (favoritos)
├── views/            # Vistas principales
└── main.ts
```

## 🏗️ Decisiones Técnicas

`KISS / DRY / YAGNI` → componentes simples, funciones puras, sin sobre-ingeniería

`Result Pattern (oxide.ts)` → manejo explícito de errores

`Separación dominio vs API` → mappers para desacoplar modelos

`Performance`: lazy loading, infinite scroll, debouncing en loaders

### 📝 Nota

Proyecto desarrollado como prueba técnica para demostrar buenas prácticas de arquitectura, testing y experiencia de usuario.
