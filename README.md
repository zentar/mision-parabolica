# 🚀 Misión Parabólica - Taller Interactivo de Matemáticas

Una aplicación web moderna para gestionar talleres educativos de parábolas con misiones, pistas y fase final. Diseñada para fomentar el aprendizaje interactivo y la competencia sana entre equipos.

## ✨ Características

### 🎯 **Funcionalidades Principales**
- **Sesiones en Tiempo Real**: Creación de sesiones con códigos únicos
- **Sistema de Equipos**: Múltiples equipos compitiendo simultáneamente
- **Misiones Progresivas**: 3 misiones + fase final con validación matemática
- **Sistema de Pistas**: Pistas con penalización de puntuación
- **Scoreboard en Vivo**: Tablero de puntuación actualizado en tiempo real
- **Exportación de Datos**: Resultados en CSV para análisis posterior

### 🛠️ **Tecnologías**
- **Backend**: Node.js + Fastify + Socket.IO + SQLite
- **Frontend**: React + Vite + Styled Components
- **Base de Datos**: SQLite con migraciones
- **Validación**: Zod + Math.js para expresiones matemáticas
- **Testing**: Jest + React Testing Library
- **Seguridad**: Rate limiting, CORS, sanitización de inputs

## 🚀 Instalación Rápida

### **Requisitos**
- Node.js 18+ y npm
- (Opcional) Docker y Docker Compose

### **Instalación Local**

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/mision-parabolica.git
cd mision-parabolica

# 2. Backend
cd api
npm install
npm run migrate
npm run dev

# 3. Frontend (en otra terminal)
cd ../web
npm install
npm run dev
```

### **Instalación con Docker**

```bash
# Instalación completa
docker compose up --build

# Solo backend
docker compose up api

# Solo frontend
docker compose up web
```

## 📖 Uso

### **Para Docentes**

1. **Crear Sesión**: Accede a la aplicación y crea una nueva sesión
2. **Compartir Código**: Comparte el código de 6 caracteres con los equipos
3. **Monitorear Progreso**: Observa el scoreboard en tiempo real
4. **Exportar Resultados**: Descarga los resultados en CSV al finalizar

### **Para Equipos**

1. **Unirse**: Ingresa el código de sesión y nombre del equipo
2. **Resolver Misiones**: Completa las 3 misiones progresivas
3. **Usar Pistas**: Solicita pistas cuando sea necesario (con penalización)
4. **Fase Final**: Resuelve la ecuación final con justificación

## 🏗️ Arquitectura

### **Backend (API)**
```
api/
├── src/
│   ├── config/          # Configuración de seguridad
│   ├── database/        # Configuración de base de datos
│   ├── errors/           # Clases de error personalizadas
│   ├── middleware/      # Middleware de seguridad y errores
│   ├── migrations/     # Scripts de migración de BD
│   ├── routes/         # Rutas de la API
│   ├── tests/          # Tests unitarios e integración
│   └── utils/          # Utilidades matemáticas
```

### **Frontend (Web)**
```
web/
├── src/
│   ├── components/     # Componentes React
│   │   ├── common/     # Componentes reutilizables
│   │   ├── teacher/    # Componentes del panel docente
│   │   └── team/       # Componentes del panel de equipos
│   ├── hooks/          # Custom hooks
│   ├── state/          # Gestión de estado
│   └── tests/          # Tests de componentes
```

## 🔧 Configuración

### **Variables de Entorno**

Crea un archivo `.env` en la carpeta `api/`:

```env
# Servidor
PORT=4000
CORS_ORIGIN=http://localhost:5173

# Sesiones
SESSION_CODE_LENGTH=6
HINT_PENALTY=1
ALLOW_PARTIAL=true
SYNC_INTERVAL_MS=5000

# Base de Datos
DB_PATH=./data/sessions.db

# Logging
LOG_LEVEL=info
NODE_ENV=development
```

### **Configuración de Seguridad**

El sistema incluye múltiples capas de seguridad:

- **Rate Limiting**: Límites por endpoint y por IP
- **CORS**: Configuración restrictiva de orígenes
- **Sanitización**: Limpieza automática de inputs
- **Validación**: Validación robusta con Zod
- **Headers de Seguridad**: Protección contra XSS, CSRF, etc.

## 🧪 Testing

### **Backend**
```bash
cd api
npm test              # Ejecutar todos los tests
npm run test:watch    # Modo watch
npm run test:coverage # Con cobertura
```

### **Frontend**
```bash
cd web
npm test              # Ejecutar todos los tests
npm run test:watch    # Modo watch
npm run test:coverage # Con cobertura
```

## 📊 Base de Datos

### **Esquema**
- **sessions**: Información de sesiones
- **teams**: Datos de equipos y progreso
- **events**: Log de eventos para auditoría

### **Migraciones**
```bash
# Ejecutar migraciones
npm run migrate

# Crear nueva migración
# (Crear archivo en src/migrations/)
```

## 🚀 Despliegue

### **Producción**

1. **Configurar Variables de Entorno**
2. **Ejecutar Migraciones**: `npm run migrate`
3. **Construir Frontend**: `npm run build`
4. **Iniciar Servidor**: `npm start`

### **Docker**

```bash
# Construir imagen
docker build -t mision-parabolica .

# Ejecutar contenedor
docker run -p 4000:4000 mision-parabolica
```

## 📈 Monitoreo

### **Métricas Disponibles**
- Número de sesiones activas
- Equipos por sesión
- Tiempo promedio de resolución
- Uso de pistas por equipo
- Tasa de éxito por misión

### **Logs**
- Logs estructurados con contexto
- Diferentes niveles (debug, info, warn, error)
- Rotación automática de logs

## 🤝 Contribución

### **Cómo Contribuir**

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### **Estándares de Código**

- **ESLint**: Configuración estricta
- **Prettier**: Formateo automático
- **Tests**: Cobertura mínima del 80%
- **Commits**: Mensajes descriptivos

## 📝 Changelog

### **v2.0.0** - Mejoras Mayores
- ✅ Persistencia de datos con SQLite
- ✅ Parser matemático robusto con Math.js
- ✅ UI moderna con Styled Components
- ✅ Sistema de manejo de errores
- ✅ Tests unitarios y de integración
- ✅ Medidas de seguridad avanzadas

### **v1.0.0** - Versión Inicial
- ✅ Funcionalidad básica
- ✅ Almacenamiento en memoria
- ✅ UI básica

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [tu-github](https://github.com/tu-github)

## 🙏 Agradecimientos

- A la comunidad de desarrolladores de Node.js
- A los contribuidores de las librerías utilizadas
- A los educadores que probaron la aplicación

---

**¿Tienes preguntas?** Abre un [issue](https://github.com/tu-usuario/mision-parabolica/issues) o contacta al equipo de desarrollo.

**¿Te gusta el proyecto?** ⭐ Dale una estrella al repositorio!