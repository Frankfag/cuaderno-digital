# 🚜 PLAN MAESTRO LA HUERTA

Versión: 3.0  
Última revisión: Julio 2026  
Estado: Activo  
Autor: Alexis

---

# 🌱 FILOSOFÍA DEL PROYECTO

Aplicación agrícola personal para gestionar toda la explotación desde una única plataforma.

Objetivos:

✅ Gestión de cultivos

✅ Gestión de parcelas

✅ Gestión de riegos

✅ Gestión de cosechas

✅ Dashboard de control

✅ Trabajos agrícolas

✅ Cuaderno fitosanitario

✅ Gestión de productos

✅ Compatible con campañas

✅ Compatible con Supabase

✅ Compatible con Dashboard

✅ Preparado para SIEX

✅ Preparado para inspecciones

✅ Escalable para futuras ampliaciones

---

# 🎯 ESTADO ACTUAL DEL PROYECTO

## Módulos terminados

✅ Dashboard

✅ Cultivos

✅ Riegos

✅ Cosechas

✅ Campañas

✅ Sincronización Supabase

✅ Control de riego avanzado

---

## Módulos en planificación

🔲 Trabajos Agrícolas

🔲 Cuaderno Fitosanitario

🔲 Gestión de Productos

🔲 Gestión Operarios

🔲 Informes PDF

🔲 Dashboard Agrícola Avanzado

---

# 🏗️ ARQUITECTURA DEL PROYECTO

Supabase

↓

Sincronización

↓

localStorage

↓

Módulos

↓

Dashboard

---

## Fuente principal de datos

✅ Supabase

## Fuente local de trabajo

✅ localStorage sincronizado

## Dashboard

✅ Visualiza información

✅ No modifica registros

✅ Consume datos ya sincronizados

---

# ⚠️ DECISIONES IMPORTANTES DEL PROYECTO

## Formularios

✅ Todo mediante SELECT

✅ Nada escrito manualmente salvo observaciones

✅ Cultivo automático

✅ Parcela automática

✅ Campaña automática

✅ SIGPAC automático

✅ Productos automáticos desde catálogo

---

## Datos

✅ Supabase es la fuente principal

✅ Compatible con campañas

✅ Compatible con Dashboard

✅ Compatible con futuras estadísticas

---

## Código

✅ HTML independiente

✅ CSS independiente

✅ JS independiente

✅ Comentarios grandes y visibles

✅ Código documentado

✅ Mantener documentación actualizada

---

# 🚫 COSAS QUE NO HACER

❌ Productos escritos manualmente

❌ Cultivos escritos manualmente

❌ Parcelas escritas manualmente

❌ Duplicar información en varias tablas

❌ Crear módulos sin actualizar este documento

❌ Mezclar lógica de distintos módulos

---

# 🗄️ DISEÑO DE TABLAS

## trabajos_agricolas

Estado:

✅ APROBADA

Versión:

1.0

### Tabla oficial

```sql
CREATE TABLE trabajos_agricolas (

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- Control
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Datos generales
    fecha DATE NOT NULL,

    campaña VARCHAR(50) NOT NULL,

    parcela_id BIGINT NOT NULL,

    cultivo_id BIGINT,

    operario_id BIGINT,

    -- Trabajo realizado
    categoria VARCHAR(100) NOT NULL,

    trabajo VARCHAR(150) NOT NULL,

    -- Observaciones
    observaciones TEXT,

    -- Estado
    activo BOOLEAN DEFAULT TRUE

);
```

### Decisiones tomadas

- No guardar nombres de parcela.
- No guardar nombres de cultivo.
- No guardar nombres de operario.
- Se utilizarán IDs para evitar duplicidades.
- Los nombres se obtendrán de sus tablas correspondientes.

### Campos futuros

No implementar todavía:

- horas_trabajadas
- maquinaria
- coste
- estado

### Relación con otros módulos

Esta tabla pertenece exclusivamente a:

🚜 Trabajos Agrícolas

NO será utilizada por:

🧪 Cuaderno Fitosanitario

porque los tratamientos fitosanitarios tendrán tabla propia.


---

# 🗄️ TABLAS SUPABASE

## Existentes

- cultivos_huerta
- riegos_huerta
- cosechas_huerta
- parcelas_huerta

---

## Futuras

- trabajos_agricolas
- fitosanitarios_huerta
- productos_huerta
- operarios_huerta

### Pendiente evaluar

- parcelas_huerta

---

# 🗄️ DISEÑO DE TABLAS

## trabajos_agricolas

Estado:

✅ APROBADA

Versión:

1.0

### Tabla oficial

```sql
CREATE TABLE trabajos_agricolas (

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- Control
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Datos generales
    fecha DATE NOT NULL,

    campaña VARCHAR(50) NOT NULL,

    parcela_id BIGINT NOT NULL,

    cultivo_id BIGINT,

    operario_id BIGINT,

    -- Trabajo realizado
    categoria VARCHAR(100) NOT NULL,

    trabajo VARCHAR(150) NOT NULL,

    -- Observaciones
    observaciones TEXT,

    -- Estado
    activo BOOLEAN DEFAULT TRUE

);


### Decisiones tomadas

- No guardar nombres de parcela.
- No guardar nombres de cultivo.
- No guardar nombres de operario.
- Se utilizarán IDs para evitar duplicidades.
- Los nombres se obtendrán de sus tablas correspondientes.

### Campos futuros

No implementar todavía:

- horas_trabajadas
- maquinaria
- coste
- estado

### Relación con otros módulos

Esta tabla pertenece exclusivamente a:

🚜 Trabajos Agrícolas

NO será utilizada por:

🧪 Cuaderno Fitosanitario

porque los tratamientos fitosanitarios tendrán tabla propia.

---


# 🔗 DEPENDENCIAS IMPORTANTES

## Campañas

- getCampañaHuerta()
- setCampañaHuerta()

---

## Datos

- getData()
- saveData()

---

## Supabase

- supabaseClient

---

## Dashboard

Lee información desde datos sincronizados.

No modifica registros.

---

# ✅ MÓDULOS TERMINADOS

## Dashboard

### Control de riego

- En curso
- Programados
- Completados
- Responsive
- Sincronización Supabase

---

## Cultivos

- Gestión de cultivos
- Historial
- Campañas

---

## Riegos

- Crear riegos
- Iniciar riegos
- Finalizar riegos
- Contador en vivo
- Dashboard integrado
- Sincronización Supabase

---

## Cosechas

- Registro de cosechas
- Kilos recolectados

---

# 🚜 TRABAJOS AGRÍCOLAS

## Estado

Pendiente de desarrollo.

Sustituirá completamente al módulo actual:

📋 Labores

---

## Mantener

✅ Fondo

✅ Logo

✅ Navegación

✅ Scripts comunes

---

## Eliminar

❌ Formulario actual

❌ Tabla actual

❌ Lógica actual

---

## Crear

✅ trabajos-agricolas.html

✅ trabajos-agricolas.css

✅ trabajos-agricolas.js

✅ Tabla Supabase nueva

---

## Datos generales

- Fecha automática
- Campaña automática
- Parcela (select)
- Cultivo (select)
- Operario (select)
- Observaciones

---

## Categorías

### Preparación del terreno

- Limpieza parcela
- Retirar rastrojos
- Labrar
- Airear
- Nivelar terreno
- Mulching

### Siembra y plantación

- Semillero
- Repicado
- Trasplante
- Siembra directa
- Plantación

### Mantenimiento

- Escardado
- Entutorado
- Poda
- Deschuponado
- Aclareo
- Aporcado
- Limpieza

### Cosecha

- Recolección
- Clasificación
- Pesaje

### Postcosecha

- Rotación de cultivos
- Abono verde
- Limpieza parcela

---

## ESTADO DEL MÓDULO

### Decisiones aprobadas

✅ Tabla trabajos_agricolas aprobada

✅ Campaña automática mediante getCampañaHuerta()

✅ Parcela cargada desde datos reales

✅ Cultivo dependiente de la parcela

✅ Operarios definidos:

- Franklin
- Alexis
- Meritxell
- Invitado

✅ Categorías de trabajo definidas

✅ Trabajos dependientes de la categoría

✅ Historial con contador de registros

✅ Filtros preparados:

- Campaña
- Parcela
- Categoría

### Flujo del formulario

Fecha automática
↓
Campaña automática
↓
Parcela
↓
Cultivo
↓
Operario
↓
Categoría
↓
Trabajo
↓
Observaciones
↓
Guardar

### Pendiente

- Crear tabla Supabase
- Implementar JS
- Guardado Supabase
- Historial dinámico
- Integración Dashboard

---

### Arquitectura actual de Parcelas y Cultivos

Tras revisar el código real del proyecto se confirma que actualmente NO existe:

- getParcelasHuerta()
- saveParcelasHuerta()
- tabla independiente parcelas_huerta

Actualmente las parcelas se obtienen desde los cultivos registrados.

Arquitectura actual:

Supabase
↓
cultivos_huerta
↓
cargarCultivosDesdeSupabase()
↓
saveCultivos()
↓
getCultivos()
↓
Módulos de la aplicación

Estructura real de cultivo:

```js
{
  id,
  parcela,
  cultivo,
  cultivoId,
  variedad,
  superficie,
  campaña,
  ...
}
```

### Decisión aprobada

Mientras no exista una tabla independiente de parcelas:

✅ Las parcelas se obtendrán desde getCultivos()

✅ Las parcelas se generarán mediante los cultivos existentes

✅ La relación oficial será:

Parcela
↓
Cultivos de esa parcela

### Evolución futura

Cuando exista una tabla propia:

```sql
parcelas_huerta
```

o funciones:

```js
getParcelasHuerta()
saveParcelasHuerta()
```

se revisará esta arquitectura.

---

# 🚜 ACTUALIZACIÓN PROYECTO LA HUERTA
## Módulo: Trabajos Agrícolas
### Fecha: Julio 2026

---

# ✅ ESTADO GENERAL

Se completa la primera versión funcional del módulo:

🚜 Trabajos Agrícolas

El módulo ya permite:

- Crear registros de trabajos agrícolas.
- Seleccionar parcela.
- Seleccionar cultivo.
- Seleccionar operario.
- Seleccionar categoría.
- Seleccionar trabajo asociado.
- Guardar registros.
- Mostrar historial.
- Mostrar contador de registros.


Módulo Trabajos Agrícolas
Versión: 1.0

Estado:
FUNCIONAL

Formulario:
✅ Operativo

Historial:
✅ Operativo

Contador:
✅ Operativo

Campañas:
✅ Operativo

Parcelas:
✅ Operativo

Cultivos:
✅ Operativo

Operarios:
✅ Operativo

Categorías:
✅ Operativo

Trabajos:
✅ Operativo

Supabase:
🔲 Pendiente integración completa

---

# ✅ DECISIONES IMPORTANTES ADOPTADAS

## 1. Parcelas

### Decisión anterior

Las parcelas se obtenían desde:

```js
getCultivos()


---

# 🧪 CUADERNO FITOSANITARIO

## Estado

Pendiente de desarrollo.

Módulo independiente.

NO se fusionará con Trabajos Agrícolas.

---

## Objetivo

Cumplir requisitos reales de trazabilidad agrícola.

Preparado para:

✅ Generalitat

✅ SIEX

✅ Cuaderno Digital de Explotación

✅ Inspecciones

---

## Datos obligatorios

### Generales

- Fecha
- Campaña
- Parcela
- Cultivo
- Superficie tratada

---

### Producto

- Categoría
- Producto
- Materia activa

---

### Aplicación

- Plaga o enfermedad
- Dosis
- Volumen de caldo

---

### Aplicador

- Operario
- Nº carnet fitosanitario
- Equipo utilizado

---

### Seguridad

- Plazo de seguridad
- Fecha mínima de cosecha automática

---

### Observaciones

Texto libre.

---

# 🌿 CATÁLOGO DE PRODUCTOS

## Regla principal

Los productos NO se escribirán manualmente.

Siempre mediante SELECT.

---

# 🧪 FITOSANITARIOS

## OSSIRAME 50WP

Tipo:

Fungicida / Bactericida

---

## OLEATBIO

Tipo:

Insecticida

Materia activa:

Jabón potásico

Uso habitual:

- Pulgón
- Mosca blanca

---

## CARNADINE

Tipo:

Insecticida

Materia activa:

Acetamiprid

---

## INTRUDER 360

Tipo:

Herbicida

---

## U-46 D COMPLET

Tipo:

Herbicida

---

# 🌱 NUTRICIÓN Y CORRECTORES

## Bayfolan Aktivator

Tipo:

Bioestimulante

---

## DREFEN BORO

Tipo:

Corrector nutricional

Elemento:

Boro etanolamina

---

## WELGRO POTASIO

Tipo:

Corrector nutricional

Elemento:

Potasio

---

## Glucosei

Tipo:

Corrector nutricional

---

## Platinum 10

Tipo:

Nutriente

---

# 🌍 SIGPAC

## Municipio

REUS

## Polígono

73

## Parcela

62

---

## Recintos

| Recinto | Superficie |
|----------|-----------|
| 1 | 0,10 ha |
| 2 | 0,55 ha |
| 3 | 0,01 ha |
| 4 | 0,02 ha |
| 5 | 0,08 ha |
| 6 | 0,09 ha |
| 8 | 1,47 ha |

---

## Futuro

Las parcelas deberán almacenar:

- Municipio
- Polígono
- Parcela SIGPAC
- Recinto SIGPAC
- Superficie

Y mostrarse automáticamente en el Cuaderno Fitosanitario.

---

# 📊 DASHBOARD FUTURO

## Trabajos

- Última labor
- Última poda
- Última cosecha

---

## Fitosanitario

- Último tratamiento
- Último abonado
- Próximo plazo de seguridad

---

## Productos

- Producto más usado
- Historial de aplicaciones

---

## Parcelas

- Actividad por parcela
- Historial por parcela

---

# 📝 LISTA DE DESARROLLO

## FASE 1

- [x] Diseño tabla trabajos_agricolas
- [ ] Crear tabla Supabase
- [ ] Diseñar HTML
- [ ] Diseñar CSS
- [ ] Implementar JS
- [ ] Historial
- [ ] Integración DashboardTrabajos

---

### Estado actual

Tabla trabajos_agricolas aprobada.

Pendiente implementación.

---

## FASE 2

- [ ] Crear Cuaderno Fitosanitario
- [ ] Crear tabla Supabase Fitosanitarios

---

## FASE 3

- [ ] Crear catálogo de productos
- [ ] Vincular productos a fitosanitarios

---

## FASE 4

- [ ] Añadir SIGPAC completo
- [ ] Vincular parcelas a SIGPAC

---

## FASE 5

- [ ] Informes PDF

---

## FASE 6

- [ ] Dashboard Agrícola Avanzado

---

# 🎯 SIGUIENTE OBJETIVO DEL PROYECTO

Crear:

🚜 Trabajos Agrícolas

Orden recomendado:

1. Diseñar tabla Supabase
2. Diseñar estructura HTML
3. Diseñar CSS
4. Implementar JS
5. Historial
6. Integración Dashboard

---

# ⚠️ REGLA DE ORO

Antes de crear nuevas funciones:

1. Actualizar este documento.
2. Añadir tareas nuevas.
3. Marcar tareas completadas.
4. Revisar decisiones ya tomadas.
5. No improvisar estructuras nuevas sin revisar este plan.

---

# 📒 NOTA PARA FUTURAS CONVERSACIONES

Cuando se retome el proyecto:

1. Leer primero este documento.
2. Resumir estado actual.
3. Identificar tarea pendiente.
4. Proponer solución.
5. No escribir código hasta revisar el plan.

---

FIN DEL DOCUMENTO MAESTRO
Versión 3.0