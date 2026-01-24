# CRM + Sistema de Admisiones UTE

Backend desarrollado en NestJS para la gestión de un CRM y el proceso de admisiones universitarias.  
El sistema permite administrar usuarios, roles, contactos, aspirantes, postulaciones, exámenes de admisión, resultados, matrículas y becas, integrando autenticación mediante token JWT y CRUD completo.  
El proyecto está organizado por módulos y fue probado mediante Postman.

---

## Características principales

- CRUD completo por módulos
- Autenticación con JWT (Login → Token)
- Gestión de usuarios y roles
- Relaciones entre entidades (Contacto ↔ Aspirante, Postulación ↔ Carrera, etc.)
- Auditoría de acciones
- Subida de foto de perfil para usuarios (multipart/form-data)
- Pruebas de endpoints mediante Postman

---

## Módulos del proyecto (estructura en src/)

- usuario – gestión de usuarios y perfil
- rol – roles del sistema
- asesor – módulo asesor
- contacto – gestión de contactos CRM
- contacto_aspirante – vínculo contacto ↔ aspirante
- seguimiento – seguimiento del CRM
- tarea_crm – tareas del CRM
- aspirante – gestión de aspirantes
- carrera – carreras universitarias
- postulacion – postulaciones a carreras
- documento_postulacion – documentos de postulaciones
- examen_admision – exámenes de admisión
- resultado_examen – resultados de exámenes
- matricula – matrículas
- beca – becas
- beca_estudiante – relación beca ↔ estudiante
- requisito_beca – requisitos de becas
- auditoria – auditoría de acciones
- mail – envío de correos
- common – utilidades compartidas

---

## Tecnologías utilizadas

- Node.js
- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- MongoDB (auditoría)
- JWT (autenticación)
- Multer (upload de archivos)
- Postman (pruebas de API)

---

## Requisitos previos

- Node.js (v18 o superior)
- PostgreSQL
- MongoDB (si se utiliza auditoría)
- npm
- Gestor de base de datos (pgAdmin o DBeaver)
- Postman

---

## Instalación del proyecto

Clonar el repositorio:

```bash 
git clone https://github.com/Alis0n09/CRM_Admisiones_UTE.git
```

---
## Instalación del proyecto

PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=TU_PASSWORD
DB_NAME=crm_admisiones_ute

JWT_SECRET=TU_SECRETO
JWT_EXPIRES_IN=1d
MONGO_URI=mongodb://localhost:27017/ 
MAIL_USER=tu_correo@gmail.com  
MAIL_PASS=tu_app_password      


---

## Documentación de la API, Endopoints del sistema


• Usuarios:  
  /usuario (GET, POST)  
  /usuario/:id (GET, PUT/PATCH, DELETE)

• Roles:  
  /rol (GET, POST)  
  /rol/:id (GET, PUT/PATCH, DELETE)

• Asesores:  
  /asesor (GET, POST)  
  /asesor/:id (GET, PUT/PATCH, DELETE)

• Contactos:  
  /contacto (GET, POST)  
  /contacto/:id (GET, PUT/PATCH, DELETE)

• Contacto – Aspirante (vínculo):  
  /contacto-aspirante (GET, POST)  
  /contacto-aspirante/:id (GET, PUT/PATCH, DELETE)

• Seguimiento CRM:  
  /seguimiento (GET, POST)  
  /seguimiento/:id (GET, PUT/PATCH, DELETE)

• Tareas CRM:  
  /tarea-crm (GET, POST)  
  /tarea-crm/:id (GET, PUT/PATCH, DELETE)

• Aspirantes:  
  /aspirante (GET, POST)  
  /aspirante/:id (GET, PUT/PATCH, DELETE)

• Carreras:  
  /carrera (GET, POST)  
  /carrera/:id (GET, PUT/PATCH, DELETE)

• Postulaciones:  
  /postulacion (GET, POST)  
  /postulacion/:id (GET, PUT/PATCH, DELETE)

• Documentos de Postulación:  
  /documento-postulacion (GET, POST)  
  /documento-postulacion/:id (GET, PUT/PATCH, DELETE)

• Exámenes de Admisión:  
  /examen-admision (GET, POST)  
  /examen-admision/:id (GET, PUT/PATCH, DELETE)

• Resultados de Examen:  
  /resultado-examen (GET, POST)  
  /resultado-examen/:id (GET, PUT/PATCH, DELETE)

• Matrículas:  
  /matricula (GET, POST)  
  /matricula/:id (GET, PUT/PATCH, DELETE)

• Becas:  
  /beca (GET, POST)  
  /beca/:id (GET, PUT/PATCH, DELETE)

• Becas – Estudiantes:  
  /beca-estudiante (GET, POST)  
  /beca-estudiante/:id (GET, PUT/PATCH, DELETE)

• Requisitos de Beca:  
  /requisito-beca (GET, POST)  
  /requisito-beca/:id (GET, PUT/PATCH, DELETE)

• Auditoría:  
  /auditoria (GET)  
  /auditoria/:id (GET)

• Mail (notificaciones):  
  /mail/send (POST)

• Autenticación:  
  /auth/login (POST)

• Upload foto de perfil:  
  /usuario/:id/profile (PUT)

---

## Colección en Postman:

https://aliliseth2006-8d60d7d5-7752191.postman.co/workspace/CRM_Automatizacion_UTE~d14e8385-e225-4a5b-9ee0-d48ca7c308d4/collection/50759713-7af8f12f-5129-4717-9c59-55967b3059a3?action=share&creator=49903762

---

## Autores
Alison Venegas
Victoria Chicaiza
Victoria Solórzano

Universidad UTE

Tecnología en Desarrollo de Software