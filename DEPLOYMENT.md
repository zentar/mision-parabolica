# 🚀 Guía de Despliegue en Render

## Configuración Completada

### ✅ Cambios Implementados

1. **Backend configurado para servir frontend estático**
   - Agregado `@fastify/static` para servir archivos estáticos
   - Configurado fallback para React Router (SPA)
   - Rutas API tienen prioridad sobre rutas del frontend

2. **Scripts de build unificado**
   - `package.json` raíz con scripts `build` y `start`
   - Build del frontend se copia a `api/dist/`
   - Instalación automática de dependencias

3. **Configuración de producción**
   - Frontend usa URL dinámica (mismo servicio)
   - Variables de entorno configuradas
   - CORS configurado para Render

4. **Archivos de configuración**
   - `render.yaml` con configuración del servicio
   - `api/env.example` con variables de entorno
   - `.gitignore` actualizado para producción

## Pasos para Desplegar

### 1. Preparar el Repositorio
```bash
# Asegurar que todos los cambios estén committeados
git add .
git commit -m "feat: Configurar para despliegue en Render"
git push origin main
```

### 2. Crear Cuenta en Render
1. Ir a [render.com](https://render.com)
2. Registrarse con GitHub
3. Conectar el repositorio

### 3. Crear Web Service
1. Click en "New +" → "Web Service"
2. Conectar repositorio GitHub
3. Configurar:
   - **Name**: `mision-parabolica`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

### 4. Configurar Variables de Entorno
En el dashboard de Render, agregar:
- `NODE_ENV`: `production`
- `CORS_ORIGIN`: `https://mision-parabolica.onrender.com` (se actualiza después del primer deploy)

### 5. Desplegar
1. Click en "Create Web Service"
2. Esperar a que termine el build (5-10 minutos)
3. Copiar la URL generada (ej: `https://mision-parabolica-xyz.onrender.com`)

### 6. Actualizar CORS (Importante)
1. Una vez desplegado, copiar la URL real del servicio
2. En el dashboard de Render, ir a "Environment"
3. Actualizar `CORS_ORIGIN` con la URL real
4. Hacer "Manual Deploy" para aplicar cambios

## Verificación

### ✅ Checklist de Despliegue
- [ ] Build exitoso sin errores
- [ ] Servicio accesible en la URL de Render
- [ ] Frontend carga correctamente
- [ ] API responde en `/health`
- [ ] CORS configurado correctamente
- [ ] Variables de entorno configuradas

### 🔧 Troubleshooting

**Error: "Cannot find module"**
- Verificar que `npm install` se ejecutó correctamente
- Revisar que todas las dependencias estén en `package.json`

**Error: "Static files not found"**
- Verificar que `api/dist/` existe y tiene contenido
- Revisar que el build del frontend se ejecutó correctamente

**Error: "CORS policy"**
- Actualizar `CORS_ORIGIN` con la URL real de Render
- Hacer redeploy después de cambiar variables de entorno

## Limitaciones del Tier Gratuito

- **750 horas/mes** de tiempo de ejecución
- **Sleep mode**: El servicio se duerme después de 15 minutos de inactividad
- **Cold start**: Primera petición después de dormir toma ~30 segundos
- **Sin persistencia**: Los datos se pierden al reiniciar (por diseño)

## Monitoreo

- **Logs**: Disponibles en el dashboard de Render
- **Métricas**: Uso de CPU y memoria
- **Uptime**: Estado del servicio

## Actualizaciones

Para actualizar el servicio:
1. Hacer push de cambios al repositorio
2. Render detectará automáticamente los cambios
3. Ejecutará nuevo build y deploy automáticamente

---

**¿Problemas?** Revisar los logs en el dashboard de Render para más detalles.
