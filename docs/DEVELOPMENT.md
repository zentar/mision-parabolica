# 🛠️ Guía de Desarrollo - Misión Parabólica

## 🚀 Configuración del Entorno

### **Requisitos**
- Node.js 18+
- npm 9+
- Git
- (Opcional) Docker

### **Instalación Inicial**
```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/mision-parabolica.git
cd mision-parabolica

# Instalar dependencias del backend
cd api
npm install

# Instalar dependencias del frontend
cd ../web
npm install
```

## 🏗️ Estructura del Proyecto

### **Backend (API)**
```
api/
├── src/
│   ├── config/          # Configuración de seguridad
│   ├── database/        # Configuración de BD
│   ├── errors/          # Clases de error
│   ├── middleware/      # Middleware personalizado
│   ├── migrations/      # Scripts de migración
│   ├── routes/          # Rutas de la API
│   ├── tests/           # Tests unitarios
│   └── utils/           # Utilidades
├── data/                # Base de datos SQLite
├── coverage/            # Reportes de cobertura
└── package.json
```

### **Frontend (Web)**
```
web/
├── src/
│   ├── components/      # Componentes React
│   │   ├── common/      # Componentes reutilizables
│   │   ├── teacher/     # Panel docente
│   │   └── team/        # Panel de equipos
│   ├── hooks/           # Custom hooks
│   ├── state/           # Gestión de estado
│   ├── styles/          # Estilos globales
│   └── tests/           # Tests de componentes
├── public/              # Archivos estáticos
└── package.json
```

## 🔧 Scripts de Desarrollo

### **Backend**
```bash
cd api

# Desarrollo
npm run dev              # Servidor con nodemon
npm run start            # Servidor de producción
npm run migrate          # Ejecutar migraciones

# Testing
npm test                 # Ejecutar tests
npm run test:watch       # Modo watch
npm run test:coverage    # Con cobertura
```

### **Frontend**
```bash
cd web

# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build            # Construir para producción
npm run preview          # Preview de producción

# Testing
npm test                 # Ejecutar tests
npm run test:watch       # Modo watch
npm run test:coverage    # Con cobertura
```

## 🧪 Testing

### **Configuración de Tests**

#### **Backend (Jest)**
```javascript
// jest.config.js
export default {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/tests/**',
    '!src/migrations/**'
  ],
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js']
};
```

#### **Frontend (Jest + React Testing Library)**
```javascript
// jest.config.js
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
```

### **Escribir Tests**

#### **Test de Utilidades**
```javascript
// src/tests/math-utils.test.js
import { parseQuadratic, getVertex } from '../math-utils.js';

describe('Math Utils', () => {
  test('should parse quadratic function', () => {
    const result = parseQuadratic('x^2 + 4x + 3');
    expect(result.a).toBeCloseTo(1);
    expect(result.b).toBeCloseTo(4);
    expect(result.c).toBeCloseTo(3);
  });
});
```

#### **Test de Componentes**
```javascript
// src/tests/components/Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../components/common/Button';

describe('Button Component', () => {
  test('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

#### **Test de Integración**
```javascript
// src/tests/routes.test.js
import request from 'supertest';
import { app } from '../index.js';

describe('API Routes', () => {
  test('POST /sessions - should create session', async () => {
    const response = await request(app.server)
      .post('/sessions')
      .send({ teacherName: 'Test Teacher' })
      .expect(200);
    
    expect(response.body).toHaveProperty('code');
  });
});
```

## 🗄️ Base de Datos

### **Migraciones**
```sql
-- src/migrations/001_initial_schema.sql
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  teacher_name TEXT NOT NULL,
  status TEXT DEFAULT 'running',
  created_at INTEGER NOT NULL,
  timers TEXT NOT NULL,
  rules TEXT NOT NULL,
  missions TEXT NOT NULL,
  final_target TEXT NOT NULL
);
```

### **Queries Preparadas**
```javascript
// src/database/index.js
export const sessionQueries = {
  create: db.prepare(`
    INSERT INTO sessions (code, teacher_name, status, created_at, timers, rules, missions, final_target)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),
  
  getByCode: db.prepare(`
    SELECT * FROM sessions WHERE code = ?
  `)
};
```

## 🔒 Seguridad

### **Rate Limiting**
```javascript
// src/middleware/security.js
export const rateLimitConfig = {
  global: {
    max: 100,
    timeWindow: '1 minute'
  },
  sessions: {
    max: 10,
    timeWindow: '5 minutes'
  }
};
```

### **Validación de Entrada**
```javascript
// src/middleware/security.js
export async function sanitizeInput(request, reply) {
  if (request.body) {
    sanitizeObject(request.body);
  }
}

function sanitizeObject(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = obj[key]
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .trim();
    }
  }
}
```

## 🎨 Frontend

### **Componentes**
```javascript
// src/components/common/Button.jsx
import styled from 'styled-components';

const StyledButton = styled.button`
  background: ${props => props.variant === 'primary' ? '#007bff' : '#6c757d'};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.variant === 'primary' ? '#0056b3' : '#545b62'};
  }
`;

export default function Button({ children, variant = 'primary', ...props }) {
  return (
    <StyledButton variant={variant} {...props}>
      {children}
    </StyledButton>
  );
}
```

### **Hooks Personalizados**
```javascript
// src/hooks/useNotification.js
import { useState, useCallback } from 'react';

export function useNotification() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { id, ...notification }]);
  }, []);

  return { notifications, addNotification };
}
```

## 🚀 Despliegue

### **Desarrollo**
```bash
# Backend
cd api
npm run dev

# Frontend
cd web
npm run dev
```

### **Producción**
```bash
# Backend
cd api
npm run migrate
npm start

# Frontend
cd web
npm run build
npm run preview
```

### **Docker**
```bash
# Construir
docker compose up --build

# Solo backend
docker compose up api

# Solo frontend
docker compose up web
```

## 📝 Estándares de Código

### **ESLint**
```json
{
  "extends": ["eslint:recommended"],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "error"
  }
}
```

### **Prettier**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### **Commits**
```
feat: agregar nueva funcionalidad
fix: corregir bug
docs: actualizar documentación
test: agregar tests
refactor: refactorizar código
```

## 🐛 Debugging

### **Backend**
```javascript
// src/index.js
const app = Fastify({ 
  logger: {
    level: 'debug',
    prettyPrint: process.env.NODE_ENV === 'development'
  }
});
```

### **Frontend**
```javascript
// src/App.jsx
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', state);
}
```

## 📊 Monitoreo

### **Logs**
```javascript
// src/middleware/errorHandler.js
export function logError(error, context = {}) {
  const logData = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...context
  };
  
  console.error('Error occurred:', JSON.stringify(logData, null, 2));
}
```

### **Métricas**
```javascript
// src/middleware/metrics.js
export function trackMetrics(request, reply) {
  const start = Date.now();
  
  reply.addHook('onSend', (request, reply, payload, done) => {
    const duration = Date.now() - start;
    console.log(`Request ${request.method} ${request.url} took ${duration}ms`);
    done();
  });
}
```

## 🤝 Contribución

### **Flujo de Trabajo**
1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Hacer commits descriptivos
4. Push a la rama
5. Crear Pull Request

### **Revisión de Código**
- Tests deben pasar
- Cobertura mínima del 80%
- Código debe seguir estándares
- Documentación actualizada

## 📚 Recursos

### **Documentación**
- [Fastify](https://www.fastify.io/docs/latest/)
- [React](https://react.dev/)
- [Styled Components](https://styled-components.com/)
- [Jest](https://jestjs.io/)
- [SQLite](https://www.sqlite.org/docs.html)

### **Herramientas**
- [Postman](https://www.postman.com/) - Testing de API
- [Insomnia](https://insomnia.rest/) - Cliente HTTP
- [SQLite Browser](https://sqlitebrowser.org/) - Explorador de BD
- [React DevTools](https://react.dev/learn/react-developer-tools) - Debugging


