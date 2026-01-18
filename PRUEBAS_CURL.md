# Comandos cURL para Pruebas - CRM Admisiones UTE

## 🔐 Autenticación

### 1. Login (Obtener Token)
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "asesor@gmail.com",
    "password": "1234567"
  }'
```

**Respuesta esperada:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**⚠️ IMPORTANTE:** Copia el `access_token` y úsalo en las siguientes peticiones reemplazando `TU_TOKEN_AQUI`

### 2. Verificar Token (Diagnóstico) - NUEVO 🔍
```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

**Este endpoint te muestra qué contiene tu token y te ayuda a diagnosticar el error 403.**

**Respuesta esperada:**
```json
{
  "user": {
    "id_usuario": "...",
    "email": "asesor@gmail.com",
    "roles": ["ASESOR"],  // ⚠️ Si está vacío [], ese es el problema
    "id_cliente": null,
    "id_empleado": "..."
  },
  "diagnostic": {
    "hasRoles": true,
    "rolesCount": 1,
    "roles": ["ASESOR"],
    "message": "✅ Token válido con roles asignados"
  }
}
```

**Si `roles: []` está vacío**, ve al archivo `SOLUCION_ERROR_403.md` para solucionarlo.

---

## 📋 SEGUIMIENTOS

### 2. Crear Seguimiento (POST)
```bash
curl -X POST http://localhost:3000/seguimiento \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "id_cliente": "769f222a-9478-4fcf-a341-d37fb4769e23",
    "fecha_contacto": "2025-05-04",
    "medio": "WhatsApp",
    "comentarios": "Cliente interesado en la carrera de desarrollo de Software",
    "proximo_paso": "Enviar precios de la carrera",
    "fecha_proximo_contacto": "2025-12-15"
  }'
```

### 3. Obtener Todos los Seguimientos (GET)
```bash
# Para ADMIN y ASESOR (todos los seguimientos)
curl -X GET "http://localhost:3000/seguimiento?page=1&limit=10" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

```bash
# Con filtros adicionales
curl -X GET "http://localhost:3000/seguimiento?page=1&limit=10&search=WhatsApp" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 4. Obtener Seguimiento por ID (GET)
```bash
curl -X GET http://localhost:3000/seguimiento/ID_SEGUIMIENTO_AQUI \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 5. Actualizar Seguimiento (PUT)
```bash
curl -X PUT http://localhost:3000/seguimiento/ID_SEGUIMIENTO_AQUI \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "id_cliente": "769f222a-9478-4fcf-a341-d37fb4769e23",
    "fecha_contacto": "2025-05-05",
    "medio": "Email",
    "comentarios": "Cliente confirmó interés, enviar información detallada",
    "proximo_paso": "Agendar reunión presencial",
    "fecha_proximo_contacto": "2025-12-20"
  }'
```

### 6. Eliminar Seguimiento (DELETE) - Solo ADMIN
```bash
curl -X DELETE http://localhost:3000/seguimiento/ID_SEGUIMIENTO_AQUI \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## ✅ TAREAS CRM

### 7. Crear Tarea (POST)
```bash
curl -X POST http://localhost:3000/tareas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "id_empleado": "112922ca-b620-4ea8-b57b-03d18c8eb818",
    "id_cliente": "769f222a-9478-4fcf-a341-d37fb4769e23",
    "descripcion": "Llamar al cliente para seguimiento de postulación",
    "fecha_asignacion": "2025-01-15",
    "fecha_vencimiento": "2025-01-20",
    "estado": "Pendiente"
  }'
```

**Nota:** Si eres ASESOR, el `id_empleado` se asigna automáticamente desde tu token, no necesitas enviarlo.

### 8. Obtener Todas las Tareas (GET)
```bash
# Para ADMIN (todas las tareas)
curl -X GET "http://localhost:3000/tareas?page=1&limit=10" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

```bash
# Para ASESOR (solo sus tareas - filtrado automático)
curl -X GET "http://localhost:3000/tareas?page=1&limit=10" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

```bash
# Para ASPIRANTE (solo tareas de su cliente - filtrado automático)
curl -X GET "http://localhost:3000/tareas?page=1&limit=10" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 9. Obtener Tarea por ID (GET)
```bash
curl -X GET http://localhost:3000/tareas/ID_TAREA_AQUI \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 10. Actualizar Tarea (PUT)
```bash
curl -X PUT http://localhost:3000/tareas/ID_TAREA_AQUI \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "id_empleado": "112922ca-b620-4ea8-b57b-03d18c8eb818",
    "id_cliente": "769f222a-9478-4fcf-a341-d37fb4769e23",
    "descripcion": "Tarea completada - Cliente contactado exitosamente",
    "estado": "Completada"
  }'
```

**Nota:** Si eres ASESOR, no puedes cambiar `id_empleado` ni `id_cliente`, solo otros campos.

### 11. Eliminar Tarea (DELETE) - Solo ADMIN
```bash
curl -X DELETE http://localhost:3000/tareas/ID_TAREA_AQUI \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 📝 Ejemplo Completo de Flujo

### Paso 1: Login
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "asesor@gmail.com", "password": "1234567"}' \
  | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

echo "Token obtenido: $TOKEN"
```

### Paso 2: Crear Seguimiento
```bash
curl -X POST http://localhost:3000/seguimiento \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "id_cliente": "769f222a-9478-4fcf-a341-d37fb4769e23",
    "fecha_contacto": "2025-05-04",
    "medio": "WhatsApp",
    "comentarios": "Cliente interesado en la carrera de desarrollo de Software",
    "proximo_paso": "Enviar precios de la carrera",
    "fecha_proximo_contacto": "2025-12-15"
  }'
```

### Paso 3: Listar Seguimientos
```bash
curl -X GET "http://localhost:3000/seguimiento?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔍 Verificar Token JWT

Puedes decodificar el token JWT en [jwt.io](https://jwt.io) para verificar que contiene los roles correctos.

El payload debería verse así:
```json
{
  "sub": "id_usuario",
  "email": "asesor@gmail.com",
  "roles": ["ASESOR"],  // ⚠️ Debe tener al menos un rol
  "id_cliente": null,
  "id_empleado": "112922ca-b620-4ea8-b57b-03d18c8eb818",
  "iat": 1768713397,
  "exp": 1768716997
}
```

---

## ⚠️ Solución de Problemas

### Error 403 "No tienes permisos"
1. Verifica que el token tenga roles: `"roles": ["ASESOR"]` o `"roles": ["ADMIN"]`
2. Si `"roles": []` está vacío, el usuario no tiene roles asignados en la BD
3. Asigna el rol manualmente en la base de datos

### Error 401 "No autenticado"
- Verifica que el token no haya expirado
- Asegúrate de incluir `Authorization: Bearer TOKEN` en el header
- Verifica que el token sea válido

### Error 404 "No encontrado"
- Verifica que los IDs (UUIDs) sean correctos
- Asegúrate de que el recurso exista en la base de datos

---

## 📌 Notas Importantes

1. **Reemplaza `TU_TOKEN_AQUI`** con el token obtenido del login
2. **Reemplaza los UUIDs** (`ID_SEGUIMIENTO_AQUI`, `ID_TAREA_AQUI`, etc.) con IDs reales
3. **Para ASESOR:** El `id_empleado` se asigna automáticamente, no es necesario enviarlo en POST
4. **Para ASPIRANTE:** Solo puede ver/editar sus propios recursos (filtrado automático)
5. **Paginación:** Usa `?page=1&limit=10` para paginar resultados
