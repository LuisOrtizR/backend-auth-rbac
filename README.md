# 🚀 Backend Auth RBAC API

API REST profesional que implementa autenticación segura con JWT y un sistema completo de control de acceso basado en roles y permisos (RBAC).

> Proyecto enfocado en demostrar arquitectura backend escalable, seguridad avanzada y buenas prácticas listas para entornos productivos.

---

## 📌 Problema que Resuelve

En aplicaciones reales (SaaS, dashboards administrativos, ERPs, plataformas internas) no es suficiente autenticar usuarios.

Es necesario:

- Controlar qué usuarios pueden acceder a qué recursos
- Separar roles (admin, manager, user, etc.)
- Definir permisos granulares
- Proteger rutas sensibles
- Gestionar sesiones seguras
- Centralizar manejo de errores

Este backend implementa exactamente ese modelo de seguridad empresarial.

---

## 🏗️ Arquitectura del Proyecto

Estructura modular inspirada en principios de Clean Architecture:

```
src/
│
├── controllers/     → Capa HTTP (entrada de solicitudes)
├── services/        → Lógica de negocio
├── models/          → Acceso a datos
├── middleware/      → Autenticación y autorización
├── validators/      → Validación con Zod
├── utils/           → Manejo de errores y helpers
│
├── app.js           → Configuración de Express
└── server.js        → Punto de entrada
```

### 🔎 Principios aplicados

- Separación clara de responsabilidades
- Desacoplamiento entre capas
- Middleware reusable
- Manejo centralizado de errores
- Código mantenible y escalable

---

## 🔐 Sistema de Autenticación

### 1️⃣ Login
- Generación de Access Token
- Generación de Refresh Token
- Firma con secretos protegidos en variables de entorno

### 2️⃣ Middleware de Autenticación
- Extracción de token del header `Authorization`
- Verificación con `jwt.verify`
- Inyección del usuario autenticado en `req.user`

### 3️⃣ Refresh Token
- Renovación segura de sesión
- Prevención de sesiones inválidas

---

## 🛡️ Sistema RBAC (Role-Based Access Control)

### Modelo Implementado

- Un usuario puede tener múltiples roles
- Un rol puede tener múltiples permisos
- Las rutas pueden requerir roles específicos

### Flujo de autorización

1. El middleware `authenticate` valida el JWT
2. Se obtiene el usuario con sus roles y permisos
3. El middleware `authorizeRoles` valida si el usuario tiene el rol requerido
4. Si cumple → acceso permitido
5. Si no cumple → respuesta 403

Esto permite un control de acceso flexible y escalable.

---

## 🚀 Tecnologías Utilizadas

- Node.js
- Express
- JSON Web Tokens (JWT)
- Zod (validación tipada y segura)
- Arquitectura modular

---

## 📚 Funcionalidades Implementadas

- Registro de usuario
- Login
- Refresh token
- Logout
- Recuperación de contraseña
- Reset de contraseña
- Middleware de autenticación
- Middleware de autorización por roles
- Validación robusta con Zod
- Manejo centralizado de errores

---

## ⚙️ Instalación

Clonar el repositorio:

```bash
git clone https://github.com/LuisOrtizR/backend-auth-rbac.git
cd backend-auth-rbac
```

Instalar dependencias:

```bash
npm install
```

Crear archivo `.env`:

```
PORT=3000
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

Ejecutar en desarrollo:

```bash
npm run dev
```

Servidor disponible en:

```
http://localhost:3000
```

---

## 🧪 Casos de Uso Reales

Este backend puede servir como base para:

- Plataformas SaaS multi-rol
- Sistemas administrativos
- Dashboards empresariales
- APIs con control de acceso avanzado
- Sistemas internos corporativos

---

## 📈 Buenas Prácticas Aplicadas

- Estructura profesional escalable
- Seguridad basada en JWT
- Validación antes de lógica de negocio
- Manejo consistente de errores
- Principios SOLID aplicados
- Código limpio y mantenible

---

## 🧠 Lo que Demuestra este Proyecto

- Diseño de arquitectura backend profesional
- Implementación de seguridad empresarial
- Control de acceso granular (RBAC)
- Manejo correcto de middleware en Express
- Organización modular lista para escalar

---

## 👨‍💻 Autor

Desarrollado como demostración de competencias en:

- Backend Engineering
- Seguridad en APIs
- Arquitectura de software
- Diseño escalable en Node.js

## 📌 API Endpoints

### Auth
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
POST /api/auth/forgot
POST /api/auth/reset

### Users
GET /api/users
GET /api/users/:id
PATCH /api/users/:id
DELETE /api/users/:id

### Roles
GET /api/roles
POST /api/roles
PATCH /api/roles/:id
DELETE /api/roles/:id

## 🏗 Architecture Diagram

```mermaid
flowchart LR
    Client --> Auth
    Auth --> JWT
    JWT --> Middleware
    Middleware --> RBAC
    RBAC --> Controller
    Controller --> Service
    Service --> DB

