# ¿Puedo usar GitHub Actions gratis con mi cuenta free?

## 1. ¿Tiene costo usar GitHub Actions?

Depende de dos cosas: si tu repositorio es público o privado, y cuántos minutos de ejecución uses.

- **Repositorios públicos**
  - **Sí, puedes usar GitHub Actions totalmente gratis**.
  - GitHub ofrece **minutos ilimitados** para repos públicos en cuentas gratuitas.
  - Puedes crear tu archivo YAML (por ejemplo, en `.github/workflows/ci.yml`) y correr pipelines sin preocuparte por facturación, mientras uses *GitHub-hosted runners* estándar.

- **Repositorios privados**
  - Tu cuenta free viene con una **cantidad limitada de minutos gratis al mes** para Actions (para repos privados).
  - Cuando superas ese cupo, los minutos adicionales **sí se cobran** según la tabla de precios oficial.
  - Para un uso “pequeño” (tests básicos, builds ocasionales), normalmente **te alcanza el cupo gratuito** si no estás ejecutando pipelines continuamente.
  - Puedes ver los detalles actualizados en la sección de billing de GitHub (`Settings > Billing & plans > Actions`).

- **Runners auto-hosteados (self-hosted)**
  - Si montas tus propios runners en tu servidor/PC, GitHub no cobra por los minutos de esos runners (aunque sí por algunas otras características si aplican).
  - El costo en este caso sería el de tu propia infraestructura, no de GitHub.

## 2. Ejemplo mínimo de workflow YAML

Si ya subiste tu proyecto a GitHub, puedes empezar con algo así (por ejemplo, en `SmartC-Frontend`):

Ruta del archivo:

- `.github/workflows/ci.yml`

Contenido de ejemplo (para un proyecto Node/React típico):

name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install
        working-directory: SmartC-Frontend

      - name: Run tests
        run: npm test
        working-directory: SmartC-Frontend