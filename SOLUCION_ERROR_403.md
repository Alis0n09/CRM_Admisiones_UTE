# 🔧 Solución Error 403 "No tienes permisos"

## 🎯 Diagnóstico del Problema

Si recibes **Error 403 "No tienes permisos"**, el problema es que **tu token JWT no tiene roles asignados** o el usuario no tiene los roles necesarios en la base de datos.

## 📋 Pasos para Diagnosticar

### Paso 1: Verificar el Token después del Login

**Opción A: Usar el nuevo endpoint de diagnóstico**

Después de hacer login, usa este endpoint para ver qué contiene tu token:

```bash
GET http://localhost:3000/auth/me
Headers:
  Authorization: Bearer TU_TOKEN_AQUI
```

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

**Si `roles: []` está vacío**, ese es el problema.

**Opción B: Decodificar el token en jwt.io**

1. Ve a https://jwt.io
2. Pega tu token completo
3. Mira la sección **Payload** (segunda parte)
4. Busca el campo `"roles"`

**Token CORRECTO:**
```json
{
  "sub": "id_usuario",
  "email": "asesor@gmail.com",
  "roles": ["ASESOR"],  // ✅ Tiene roles
  ...
}
```

**Token INCORRECTO (el problema):**
```json
{
  "sub": "id_usuario",
  "email": "asesor@gmail.com",
  "roles": [],  // ❌ Vacío - Este es el problema
  ...
}
```

### Paso 2: Verificar en la Consola del Servidor

Cuando hagas login, revisa la consola del servidor. Deberías ver:

```
Usuario encontrado: { email: 'asesor@gmail.com', rolUsuarios_length: 1, ... }
Roles extraídos: ['ASESOR']
Payload JWT: { roles: ['ASESOR'], ... }
```

**Si ves:**
```
rolUsuarios_length: 0
Roles extraídos: []
Payload JWT: { roles: [], ... }
```

Significa que **el usuario NO tiene roles asignados en la base de datos**.

---

## 🔨 Solución: Asignar el Rol ASESOR al Usuario

### Opción 1: SQL Directo (Recomendado)

**1. Obtener el ID del usuario:**
```sql
SELECT id_usuario, email FROM usuarios WHERE email = 'asesor@gmail.com';
```

**2. Obtener el ID del rol ASESOR:**
```sql
SELECT id_rol, nombre FROM roles WHERE nombre = 'ASESOR';
```

**3. Verificar si ya tiene el rol asignado:**
```sql
SELECT 
    u.email,
    r.nombre as rol_nombre
FROM usuarios u
LEFT JOIN rol_usuario ru ON u.id_usuario = ru.id_usuario
LEFT JOIN roles r ON ru.id_rol = r.id_rol
WHERE u.email = 'asesor@gmail.com';
```

**4. Asignar el rol (reemplaza los UUIDs con los valores reales):**
```sql
INSERT INTO rol_usuario (id, id_usuario, id_rol)
VALUES (gen_random_uuid(), 'UUID_USUARIO_AQUI', 'UUID_ROL_ASESOR_AQUI');
```

**Ejemplo completo:**
```sql
-- PostgreSQL
INSERT INTO rol_usuario (id, id_usuario, id_rol)
SELECT 
    gen_random_uuid(),
    u.id_usuario,
    r.id_rol
FROM usuarios u, roles r
WHERE u.email = 'asesor@gmail.com'
  AND r.nombre = 'ASESOR'
  AND NOT EXISTS (
    SELECT 1 FROM rol_usuario ru 
    WHERE ru.id_usuario = u.id_usuario 
    AND ru.id_rol = r.id_rol
  );
```

### Opción 2: Usar el API (si existe endpoint)

Si tienes un endpoint para asignar roles, úsalo:

```bash
POST http://localhost:3000/rol-usuario
Body: {
  "id_usuario": "...",
  "id_rol": "..."
}
```

---

## ✅ Verificar que Funcionó

**1. Haz login NUEVAMENTE** (importante: el token viejo no tiene los roles)

```bash
POST http://localhost:3000/auth/login
Body: {
  "email": "asesor@gmail.com",
  "password": "1234567"
}
```

**2. Verifica el nuevo token con `/auth/me`:**

```bash
GET http://localhost:3000/auth/me
Headers:
  Authorization: Bearer NUEVO_TOKEN_AQUI
```

Ahora deberías ver:
```json
{
  "user": {
    "roles": ["ASESOR"]  // ✅ Ya no está vacío
  }
}
```

**3. Prueba crear un seguimiento:**

```bash
POST http://localhost:3000/seguimiento
Headers:
  Authorization: Bearer NUEVO_TOKEN_AQUI
Body: {
  "id_cliente": "...",
  ...
}
```

Ahora debería funcionar ✅

---

## 🐛 Debug: Logs del Servidor

Si sigues teniendo problemas, revisa los logs del servidor cuando haces una petición:

Deberías ver algo como:
```
🚫 RolesGuard - Acceso denegado: {
  requiredRoles: [ 'ADMIN', 'ASESOR' ],
  userRoles: [],
  userEmail: 'asesor@gmail.com',
  hasRoles: false,
  message: 'El usuario NO tiene roles asignados en el token...'
}
```

---

## 📌 Resumen

1. **Error 403 = Token sin roles** o **Usuario sin roles en BD**
2. **Verifica:** Usa `GET /auth/me` o decodifica el token en jwt.io
3. **Solución:** Asigna el rol ASESOR en la base de datos
4. **Importante:** Haz login NUEVAMENTE después de asignar el rol (el token viejo no sirve)

---

## ⚠️ Nota Importante

**El token JWT se genera con los datos del usuario AL MOMENTO DEL LOGIN.**

- Si asignas el rol después de hacer login, el token viejo **NO tendrá el nuevo rol**
- Debes **hacer login nuevamente** para obtener un token con los roles actualizados
