<!-- 9ff2a28e-44ef-473b-9cc4-126c94f45855 fe8742a6-94ad-41c1-a77d-7bdf3af8a7f4 -->
# Plan: Reconstruir API con fastify-socket.io

## Problema Identificado

El servidor API muestra que está escuchando en el puerto 4000, pero no responde a las peticiones. Esto se debe a:

1. **Conflicto de servidores**: En `api/src/index.js` línea 16, se crea un servidor HTTP envolviendo `app.server` de Fastify
2. **Desconexión de rutas**: Las rutas de Fastify están registradas en `app`, pero el servidor que escucha es `httpServer`
3. **Socket.IO aislado**: Socket.IO está en un servidor diferente al de las rutas HTTP
```javascript:api/src/index.js
// Línea 16 - PROBLEMA
const httpServer = createServer(app.server);

// Línea 44 - Las rutas de Fastify no están en este servidor
httpServer.listen(PORT, '0.0.0.0', () => {
  app.log.info(`API listening on http://localhost:${PORT}`);
});
```


## Solución: Usar fastify-socket.io

Usar el plugin oficial que integra correctamente Socket.IO con Fastify.

## Pasos de Implementación

### 1. Instalar fastify-socket.io

```bash
cd api
npm install fastify-socket.io
```

### 2. Modificar api/src/index.js

Reemplazar la configuración actual con:

```javascript
import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifySocketIO from 'fastify-socket.io';
import sessionsRoutes from './routes/sessions.js';
import teamsRoutes from './routes/teams.js';
import { bus, getSessionState } from './store.js';

const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

const app = Fastify({ logger: true });

// Register CORS
await app.register(cors, { 
  origin: CORS_ORIGIN, 
  credentials: true 
});

// Register Socket.IO
await app.register(fastifySocketIO, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.IO connection handling
app.ready().then(() => {
  app.io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('join-session', (code) => {
      socket.join(code);
      console.log(`Socket ${socket.id} joined session ${code}`);
    });
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
  
  // Broadcast state updates
  bus.on('session:update', (code) => {
    const state = getSessionState(code);
    app.io.to(code).emit('session:state', state);
  });
});

// Register routes
await app.register(sessionsRoutes, { prefix: '/sessions' });
await app.register(teamsRoutes, { prefix: '/teams' });

// Health check
app.get('/health', async () => ({ ok: true, timestamp: Date.now() }));

// Start server
await app.listen({ 
  port: PORT, 
  host: '0.0.0.0' 
});

console.log(`✅ Server listening on http://localhost:${PORT}`);
```

### 3. Actualizar tickSession para usar app.io

En `api/src/store.js`, agregar soporte para broadcast:

```javascript
// Exportar el app instance para que tickSession pueda acceder a io
let appInstance = null;

export function setAppInstance(app) {
  appInstance = app;
}

export function tickSession(code) {
  const timer = setInterval(() => {
    const s = db.sessions.get(code);
    if (!s || s.status !== 'running') return clearInterval(timer);
    
    for (const key of ['m1','m2','m3','final']) {
      if (s.timers[key] > 0) s.timers[key] -= Math.floor(interval/1000);
    }
    
    bus.emit('session:update', code);
  }, interval);
}
```

### 4. Verificar CORS en web

Asegurar que el frontend tenga configurado correctamente:

```bash
# web/.env
VITE_API_URL=http://localhost:4000
```

### 5. Probar la conexión

**Terminal 1 - API:**

```bash
cd api
npm run dev
```

**Terminal 2 - Web:**

```bash
cd web
npm run dev
```

**Terminal 3 - Test:**

```bash
curl http://localhost:4000/health
# Debe responder: {"ok":true,"timestamp":1234567890}
```

## Ventajas de esta Solución

1. **Integración nativa**: Socket.IO y Fastify comparten el mismo servidor
2. **Rutas funcionan**: Todas las rutas HTTP están correctamente conectadas
3. **Socket.IO funcional**: Las conexiones WebSocket funcionan en el mismo puerto
4. **Logging mejorado**: Mensajes de conexión/desconexión para debugging
5. **Configuración simple**: Menos código, más mantenible

## Verificación de Funcionalidad

Después de implementar:

1. ✅ `curl http://localhost:4000/health` debe responder
2. ✅ Frontend debe conectarse sin errores de CORS
3. ✅ Socket.IO debe mostrar "Client connected" en logs
4. ✅ Crear sesión debe funcionar
5. ✅ Unir equipo debe actualizar en tiempo real

## Archivos a Modificar

- `api/package.json` - Agregar dependencia
- `api/src/index.js` - Reescribir configuración completa
- `api/src/store.js` - (Opcional) Mejorar integración con Socket.IO

## Notas Adicionales

- **No tocar**: `store.js`, `routes/`, `validators.js` ya funcionan correctamente
- **Mantener**: Toda la lógica de negocio permanece igual
- **Solo cambiar**: La configuración del servidor y Socket.IO

### To-dos

- [ ] Resolver conflictos de sincronización de OneDrive con node_modules
- [ ] Migrar de almacenamiento en memoria a SQLite usando store-db.js
- [ ] Crear archivo .env en /web/ con configuración de API_URL
- [ ] Verificar y depurar conexión Socket.IO entre frontend y backend
- [ ] Implementar timers persistentes basados en timestamps
- [ ] Decidir entre App.jsx y App-refactored.jsx y usar versión final
- [ ] Implementar manejo de errores robusto en frontend y backend
- [ ] Probar flujo completo: crear sesión, unir equipo, resolver misiones
- [ ] Ejecutar suite de tests existentes y corregir fallos
- [ ] Agregar notificaciones visuales y loading states