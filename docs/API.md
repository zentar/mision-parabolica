# 📚 API Documentation - Misión Parabólica

## 🚀 Endpoints

### **Sesiones**

#### `POST /sessions`
Crea una nueva sesión de juego.

**Request Body:**
```json
{
  "teacherName": "Profesor García",
  "timers": {
    "m1": 600,
    "m2": 600,
    "m3": 600,
    "final": 480
  },
  "allowPartial": true,
  "hintPenalty": 1
}
```

**Response:**
```json
{
  "code": "ABC123",
  "state": {
    "code": "ABC123",
    "status": "running",
    "timers": { "m1": 600, "m2": 600, "m3": 600, "final": 480 },
    "teams": [],
    "scoreboard": []
  }
}
```

#### `GET /sessions/:code/state`
Obtiene el estado actual de una sesión.

**Response:**
```json
{
  "code": "ABC123",
  "status": "running",
  "timers": { "m1": 580, "m2": 600, "m3": 600, "final": 480 },
  "teams": [
    {
      "id": "ABC123:1",
      "name": "Equipo 1",
      "score": 8,
      "progress": {
        "m1": { "isCorrect": true, "hints": 1, "attempts": 2 },
        "m2": { "isCorrect": true, "hints": 0, "attempts": 1 },
        "m3": { "isCorrect": false, "hints": 2, "attempts": 3 },
        "final": { "isCorrect": false }
      }
    }
  ],
  "scoreboard": [
    { "id": "ABC123:1", "name": "Equipo 1", "score": 8 }
  ]
}
```

### **Equipos**

#### `POST /teams/:code/join`
Permite que un equipo se una a una sesión.

**Request Body:**
```json
{
  "teamName": "Equipo 1"
}
```

**Response:**
```json
{
  "team": {
    "id": "ABC123:1",
    "name": "Equipo 1",
    "score": 0,
    "progress": {
      "m1": { "isCorrect": false, "hints": 0, "attempts": 0 },
      "m2": { "isCorrect": false, "hints": 0, "attempts": 0 },
      "m3": { "isCorrect": false, "hints": 0, "attempts": 0 },
      "final": { "isCorrect": false }
    }
  }
}
```

#### `POST /teams/:teamId/submit/:missionKey`
Envía una respuesta para una misión específica.

**Request Body:**
```json
{
  "vertex": { "x": -2, "y": -1 },
  "yIntercept": 3,
  "roots": [-1, -3],
  "concavity": "up",
  "axis": -2,
  "range": [-1, null]
}
```

**Response:**
```json
{
  "ok": true,
  "details": {
    "vertex": { "ok": true, "expected": { "x": -2, "y": -1 } },
    "yIntercept": { "ok": true, "expected": 3 },
    "roots": { "ok": true, "expected": [-1, -3] },
    "concavity": { "ok": true, "expected": "up" },
    "axis": { "ok": true, "expected": -2 },
    "range": { "ok": true, "expected": [-1, null] }
  },
  "score": 3
}
```

#### `POST /teams/:teamId/hint/:missionKey`
Solicita una pista para una misión.

**Response:**
```json
{
  "hints": 1,
  "score": 2
}
```

#### `POST /teams/:teamId/final`
Envía la respuesta final.

**Request Body:**
```json
{
  "equation": "(x-2)^2",
  "justification": "Trinomio cuadrado perfecto, raíz doble"
}
```

**Response:**
```json
{
  "ok": true,
  "eqOk": true,
  "justificationOk": true,
  "score": 6
}
```

## 🔒 Seguridad

### **Rate Limiting**
- **Global**: 100 requests/minuto
- **Sesiones**: 10 creaciones/5 minutos
- **Equipos**: 20 operaciones/minuto
- **Envíos**: 50 envíos/minuto

### **Validación de Entrada**
- Sanitización automática de strings
- Validación de tipos de datos
- Límites de tamaño de request
- Validación de formatos (códigos, IDs)

### **CORS**
- Orígenes permitidos configurados
- Credenciales habilitadas
- Headers personalizados

## 📊 WebSocket Events

### **Cliente → Servidor**
- `join-session`: Unirse a una sesión
- `leave-session`: Salir de una sesión

### **Servidor → Cliente**
- `session:state`: Actualización del estado de la sesión
- `session:error`: Error en la sesión
- `team:update`: Actualización de un equipo específico

## 🧪 Testing

### **Ejecutar Tests**
```bash
# Backend
cd api
npm test

# Frontend
cd web
npm test
```

### **Cobertura**
```bash
# Backend
npm run test:coverage

# Frontend
npm run test:coverage
```

## 📝 Logs

### **Niveles de Log**
- `debug`: Información detallada de desarrollo
- `info`: Información general
- `warn`: Advertencias
- `error`: Errores

### **Formato de Logs**
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": "Session created",
  "sessionCode": "ABC123",
  "teacherName": "Profesor García"
}
```

## 🔧 Configuración

### **Variables de Entorno**
```env
PORT=4000
CORS_ORIGIN=http://localhost:5173
SESSION_CODE_LENGTH=6
HINT_PENALTY=1
ALLOW_PARTIAL=true
SYNC_INTERVAL_MS=5000
DB_PATH=./data/sessions.db
LOG_LEVEL=info
NODE_ENV=development
```

### **Configuración de Base de Datos**
- **SQLite**: Base de datos embebida
- **Migraciones**: Scripts automáticos
- **Índices**: Optimización de consultas
- **Foreign Keys**: Integridad referencial

## 🚨 Manejo de Errores

### **Códigos de Error**
- `400`: Bad Request - Datos inválidos
- `401`: Unauthorized - No autorizado
- `403`: Forbidden - Prohibido
- `404`: Not Found - Recurso no encontrado
- `429`: Too Many Requests - Rate limit excedido
- `500`: Internal Server Error - Error del servidor

### **Formato de Error**
```json
{
  "error": true,
  "message": "Session not found",
  "type": "SESSION_NOT_FOUND",
  "code": "ABC123",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 📈 Métricas

### **Métricas Disponibles**
- Sesiones activas
- Equipos por sesión
- Tiempo promedio de resolución
- Uso de pistas
- Tasa de éxito por misión

### **Exportación**
- CSV con resultados detallados
- Métricas por equipo
- Análisis de rendimiento


