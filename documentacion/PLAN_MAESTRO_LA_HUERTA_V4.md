# 🚜 PLAN MAESTRO LA HUERTA
## Versión 4.0
### Última revisión: Julio 2026
### Estado: ACTIVO
### Autor: Alexis

---

# 🌱 FILOSOFÍA DEL PROYECTO

La Huerta es una aplicación agrícola personal diseñada para gestionar toda la explotación desde una única plataforma.

Objetivos:

✅ Gestión de Cultivos

✅ Calendario de Cultivos

✅ Gestión de Parcelas

✅ Gestión de Riegos

✅ Gestión de Cosechas

✅ Trabajos Agrícolas

✅ Cuaderno Fitosanitario

✅ Gestión de Productos

✅ Gestión de Operarios

✅ Dashboard Agrícola

✅ Gestión Olivar

✅ Compatible con campañas

✅ Compatible con Supabase

✅ Compatible con SIEX

✅ Compatible con inspecciones

✅ Compatible con PDF

✅ Escalable

---

# 🏗️ ARQUITECTURA GENERAL

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

# ☁️ SUPABASE

## Tablas activas

✅ cultivos_huerta

✅ riegos_huerta

✅ cosechas_huerta

---

## Tablas futuras

🔲 trabajos_agricolas

🔲 productos_huerta

🔲 fitosanitarios_huerta

🔲 operarios_huerta

---

# 🎯 CAMPAÑAS

## Regla oficial

La campaña es GLOBAL.

Todos los módulos utilizarán:

```js
getCampañaHuerta()
setCampañaHuerta()
```

---

## Prohibido

❌ Crear campañas locales

❌ Crear selectores de campaña independientes

❌ Gestionar campañas diferentes en cada módulo

---

# ✅ MÓDULOS TERMINADOS

## Dashboard

✅ Responsive

✅ Control de riegos

✅ Panel rápido

✅ Resumen de campaña

✅ Integración con módulos existentes

---

## Calendario de Cultivos

✅ Selector por temporada

✅ Selector por mes

✅ Fichas de cultivos

✅ Checklist

✅ Lista de compra

✅ Impresión

✅ Responsive

✅ Vista PC

---

## Cultivos

✅ Gestión completa

✅ Histórico

✅ Campañas

✅ Integración Dashboard

✅ Supabase

---

## Riegos

✅ Crear

✅ Iniciar

✅ Finalizar

✅ Tiempo restante

✅ Dashboard

✅ Notificaciones

✅ Reset

✅ Responsive

✅ Supabase

---

## Cosechas

✅ Registro de cosechas

✅ Kilos recolectados

✅ Dashboard

✅ Supabase

---

## Trabajos Agrícolas

### Estado

✅ COMPLETADO

### Versión

✅ 1.0 ESTABLE


## 🌳 OLIVAR

### Estado

✅ POR HACER

##  🌳Olivar

🔲 Pendiente implementación


### Versión

✅ 1.0 ESTABLE

### Funcionalidades

✅ Crear

✅ Editar

✅ Eliminar

✅ Reset

✅ Historial

✅ Contador

✅ Filtro campaña

✅ Filtro parcela

✅ Filtro categoría

✅ Observaciones visibles

✅ Responsive móvil

✅ Vista PC optimizada

✅ Campaña global

### Datos

✅ Fecha automática

✅ Campaña automática

✅ Parcela

✅ Cultivo

✅ Operario

✅ Categoría

✅ Trabajo

✅ Observaciones

### Operarios

✅ Franklin

✅ Alexis

✅ Meritxell

✅ Invitado

### Pendiente

🔲 Tabla Supabase

🔲 Sincronización Supabase

🔲 Resumen Dashboard

---

# 🚧 MÓDULOS EN DESARROLLO

## 🌿 Gestión de Productos

Estado:

🔲 Pendiente

---

## 🧪 Cuaderno Fitosanitario

Estado:

🔲 Pendiente

---

## 👷 Operarios

Estado:

🔲 Pendiente

---

## 📄 PDF e Informes

Estado:

🔲 Pendiente

---

## 📊 Dashboard Agrícola Avanzado

Estado:

🔲 Pendiente

---

# 🌿 GESTIÓN DE PRODUCTOS

## Objetivo

Gestionar todos los productos desde un catálogo centralizado.

---

## Regla principal

Los productos NO se escribirán manualmente.

Siempre mediante SELECT.

---

## Datos del producto

- Nombre comercial
- Nombre oficial
- Categoría
- Materia activa
- Plazo de seguridad
- Observaciones

---

## Funciones obligatorias

✅ Crear

✅ Editar

✅ Eliminar

✅ Historial

✅ Reset

✅ Imprimir

✅ Descargar

---

## Tabla futura

productos_huerta

---

# 🧪 CUADERNO FITOSANITARIO

## Estado

Pendiente

---

## Objetivo

Cumplir requisitos de:

✅ Generalitat

✅ SIEX

✅ Cuaderno Digital de Explotación

✅ Inspecciones

---

## Datos generales

- Fecha
- Campaña
- Parcela
- Cultivo
- Superficie tratada

---

## Producto

- Categoría
- Producto
- Materia activa

---

## Aplicación

- Plaga o enfermedad
- Dosis
- Volumen de caldo

---

## Aplicador

- Operario
- Carnet fitosanitario
- Equipo utilizado

---

## Seguridad

- Plazo de seguridad
- Fecha mínima de cosecha

---

## Observaciones

Texto libre

---

## Funciones obligatorias

✅ Crear

✅ Editar

✅ Eliminar

✅ Historial

✅ Filtro campaña

✅ Filtro parcela

✅ Reset

✅ Imprimir

✅ Descargar

---

## Tabla futura

fitosanitarios_huerta

---

# 🌿 CATÁLOGO INICIAL DE PRODUCTOS

## Fitosanitarios

### OSSIRAME 50WP

Tipo:

Fungicida / Bactericida

---

### OLEATBIO

Tipo:

Insecticida

Materia activa:

Jabón potásico

---

### CARNADINE

Tipo:

Insecticida

Materia activa:

Acetamiprid

---

### INTRUDER 360

Tipo:

Herbicida

---

### U-46 D COMPLET

Tipo:

Herbicida

---

# 🌱 NUTRICIÓN Y CORRECTORES

### Bayfolan Aktivator

Bioestimulante

---

### DREFEN BORO

Corrector nutricional

---

### WELGRO POTASIO

Corrector nutricional

---

### Glucosei

Corrector nutricional

---

### Platinum 10

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
|----------|------------|
| 1 | 0,10 ha |
| 2 | 0,55 ha |
| 3 | 0,01 ha |
| 4 | 0,02 ha |
| 5 | 0,08 ha |
| 6 | 0,09 ha |
| 8 | 1,47 ha |

---

## Futuro

Las parcelas deberán guardar:

- Municipio
- Polígono
- Parcela
- Recinto
- Superficie

---

# 📊 DASHBOARD FUTURO

## Riegos

- En curso
- Programados
- Completados

---

## Trabajos Agrícolas

- Últimos trabajos
- Última labor
- Última poda

---

## Fitosanitario

- Último tratamiento
- Último abonado
- Próximo plazo seguridad

---

## Productos

- Producto más usado
- Historial de aplicaciones

---

## Parcelas

- Historial por parcela
- Actividad por parcela

---

# 🌳 SISTEMA OLIVAR REUS

## Estado

🔲 Pendiente de desarrollo

## Objetivo

Gestionar de forma integral el olivar de Reus.

## Datos principales

- 400 olivos
- 100 olivos centenarios
- 300 olivos de 25 años
- Zona: Reus (Tarragona)

## Producción

Última campaña:

- 9.000 kg

Objetivo anual:

- 9.000 a 10.000 kg

Techo potencial:

- 14.000 kg

Rendimiento graso registrado:

- 15,82 %

---

## Principales módulos previstos

### 📦 Inventario

Control de:

- Abono grano
- Cobre líquido
- Potasio
- Jabón potásico
- Nutrientes
- Carnadine

Funciones:

✅ Stock actual

✅ Stock mínimo

✅ Consumo anual

✅ Proveedor

✅ Ubicación

✅ Lista de compra automática

---

### 🚜 Tratamientos

Calendario anual:

- Abono fondo
- Cobre
- Jabón potásico
- Nutrición 1
- Nutrición 2
- Carnadine

---

### 🚨 Alertas Predictivas

El sistema deberá comparar:

Stock actual

VS

Consumo previsto

y generar avisos automáticos.

---

### 🤖 Telegram

Funciones previstas:

/registrar

/lista_compra

/alertas

---

### 📈 Rendimiento

Registro obligatorio:

- Rendimiento graso
- Producción anual
- Histórico de campañas

---

### ☁️ Supabase

Tablas previstas:

olivar_insumos

olivar_tratamientos

olivar_actividades

olivar_produccion

olivar_alertas

olivar_log_vecino

---

### 📊 Dashboard

Futuras tarjetas:

- Producción prevista
- Producción real
- Rendimiento graso
- Próximos tratamientos
- Alertas de stock
- Lista de compra

---

### 📄 PDF

Informes futuros:

- Campaña anual
- Consumos
- Producción
- Rendimiento graso
- Inventario

---

# 🎨 IDENTIDAD VISUAL OBLIGATORIA

## Header

Todas las páginas utilizarán:

✅ Mismo logo

✅ Mismo H1

✅ Misma estructura

✅ Mismos colores

---

## Navegación

✅ Mismos enlaces

✅ Mismo orden

✅ Mismo hover

✅ Mismo responsive

---

## Menú hamburguesa

✅ Mismo diseño

✅ Misma posición

✅ Mismo comportamiento

---

## Tarjetas

Utilizar siempre:

✅ tarjeta

✅ tarjeta-mini

---

## Responsive

Referencia principal:

✅ Móvil

Posteriormente:

✅ Tablet

✅ PC

✅ Pantallas grandes

---

# 🔘 BOTONES OBLIGATORIOS

Todos los módulos deberán incluir:

## 🗑️ Reset

✅ Mismo estilo

✅ Confirmación obligatoria

✅ Escribir ELIMINAR para confirmar

---

## 🖨️ Imprimir

✅ Mismo estilo

✅ Adaptado a impresión

✅ Ocultar elementos innecesarios

---

## 📄 Descargar

✅ Mismo estilo

✅ Preparado para PDF

✅ Preparado para Excel

✅ Preparado para CSV

---

# 🚫 PROHIBIDO

❌ Crear campañas locales

❌ Productos escritos manualmente

❌ Cultivos escritos manualmente

❌ Parcelas escritas manualmente

❌ Duplicar información

❌ Crear estilos distintos para los mismos botones

❌ Crear headers distintos

❌ Crear menús distintos

❌ Crear módulos sin actualizar este documento

---

# 🛣️ ROADMAP

## FASE 1

✅ Dashboard

✅ Cultivos

✅ Calendario

✅ Riegos

✅ Cosechas

✅ Trabajos Agrícolas

---

## FASE 2

🔲 Gestión de Productos

🔲 Tabla productos_huerta

🔲 Supabase Productos

---

## FASE 3

🔲 Cuaderno Fitosanitario

🔲 Tabla fitosanitarios_huerta

🔲 Supabase Fitosanitario

---

## FASE 4

🔲 Operarios

🔲 Tabla operarios_huerta

---

## FASE 5

🔲 Dashboard Agrícola Avanzado

---

## FASE 6

🔲 PDF

🔲 Informes

🔲 Exportaciones

---

## FASE 7

🔲 Gestión Integral Olivar

🔲 Inventario

🔲 Tratamientos

🔲 Alertas Predictivas

🔲 Telegram

🔲 Presupuesto Anual

# ⚠️ REGLA DE ORO

Antes de crear nuevas funciones:

1. Revisar este documento.
2. Actualizar este documento.
3. Revisar decisiones aprobadas.
4. No improvisar arquitectura nueva.
5. Mantener coherencia visual.
6. Mantener campaña global.
7. Mantener compatibilidad con Supabase.

---

# 📒 NOTA PARA FUTURAS CONVERSACIONES

Antes de programar:

1. Leer este documento.
2. Identificar el siguiente objetivo.
3. Revisar decisiones aprobadas.
4. Proponer solución.
5. Programar.

---

# DOCUMENTO MAESTRO: SISTEMA INTEGRAL OLIVAR (REUS)
**Fecha:** 06 de julio de 2026
**Estatus:** Especificación Técnica Final (Integrada: Gestión de Stock Pro + Previsión Inteligente)

---

## 1. Perfil y Contexto del Olivar
*   **Activos:** 400 olivos (100 centenarios + 300 de 25 años).
*   **Zona:** Reus, Tarragona.
*   **Rendimiento:** 9.000 kg (cosecha pasada). Rendimiento Graso: **15,82%**.
*   **Objetivo:** Consolidar 9.000-10.000 kg/año (Techo potencial: 14.000 kg).
*   **Recursos:** Agua de pozo (40 min/día) + Maquinaria propia y vecino.

---

## 2. Inventario Pro y Previsión de Compras (Gestión Dinámica)
La web debe cruzar el `Stock Actual` con la `Demanda Anual` para generar la `Lista de la Compra` automáticamente.

| Producto | Stock Actual | Stock Mínimo | Consumo Anual | Proveedor | Ubicación |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Abono Grano** | -- | 20 sacos | 20 sacos | Coop. Reus | Almacén |
| **Cobre Líquido**| -- | 5 Litros | 15 Litros | Coop. Reus | Almacén |
| **Potasio (Polvo)**| -- | 10 kg | 50 kg | Coop. Reus | Almacén |
| **Jabón Potásico**| -- | 5 Litros | 20 Litros | Coop. Reus | Almacén |
| **Nutrientes** | -- | 25 Litros | 50 Litros | Coop. Reus | Almacén |
| **Carnadine** | -- | 1 Litro | 1 Litro | Coop. Reus | Almacén |

---

## 3. Lógica de Alerta Predictiva (Funcionalidad "Pro")
La web debe ejecutar este algoritmo cada vez que consultes la Vista de Tratamientos:
1.  **Detección:** "Faltan 2 meses para la aplicación de [Actividad X]".
2.  **Cálculo:** `Stock_Necesario_para_Actividad` vs `Stock_Actual`.
3.  **Aviso:**
    *   Si `Stock_Actual` < `Stock_Necesario`: **"⚠️ ALERTA: No tienes suficiente producto para la próxima tarea. Añadiendo a Lista de la Compra..."**
    *   Si `Stock_Actual` > `Stock_Necesario`: **"✅ Stock OK para la próxima pasada."**

---

## 4. Calendario de Aplicaciones (Ventanas Flexibles)
*Regla de Mezcla: Cobre (Solo). Jabón (Solo). Nutrientes + Potasio (Juntos).*

| Actividad | Ventana | Producto | Agua | Equipo |
| :--- | :--- | :--- | :--- | :--- |
| **Abono Fondo** | Feb-Mar | 500kg Grano | N/A | Manual |
| **Cobre (A1-A3)** | Feb-Oct | 15L Líquido | 1000L | Vecino |
| **Jabón Potásico** | May-Jun | 20L Potásico | 1000L | Vecino |
| **Nutrición 1** | Jun-Jul | 25L+25kg | 1000L | Vecino |
| **Nutrición 2** | Ago-Sep | 25L+25kg | 1000L | Vecino |
| **Carnadine** | May-Sep | Foco (1L) | 100L | Carretilla |

---

## 5. Arquitectura de Desarrollo (Base de Datos Relacional)
*   **`Insumos`**: `id`, `nombre`, `stock`, `stock_min`, `cons_anual`, `prov`, `ubicacion`, `precio_ult`.
*   **`Actividades`**: `id`, `nombre`, `mes_inicio`, `mes_fin`, `producto_id`, `dosis`.
*   **`Expansión`**: `espacio_max (200)`, `plantados`, `historial_plantaciones`.
*   **`Log_Vecino`**: `id`, `fecha`, `actividad_id`, `incidencia_nota`.

---

## 6. Funcionalidades del Bot (Telegram)
*   **`/registrar [producto] [cantidad]`**: Descuenta del stock inmediatamente.
*   **`/lista_compra`**: Muestra los productos que están por debajo de su `Stock Mínimo`.
*   **`/alertas`**: Te envía un mensaje si estamos a < 30 días de una ventana y el stock es insuficiente.

---

## 7. Notas Pro de Gestión
1.  **Registro de Calidad:** Input obligatorio de `Rendimiento Graso (%)` tras cada campaña.
2.  **Gestión Vecino:** Campo `incidencia_nota` obligatorio si se sale de la "ventana" de fecha.
3.  **Escalabilidad:** Al plantar nuevos olivos, el `Consumo Anual` en la tabla de `Insumos` deberá aumentar de forma proporcional automáticamente (ej: +2% por cada 50 olivos nuevos).

---

## 8. Presupuesto Anual Maestro (Gastos)
*Total Inversión: 1.877 €.*

| Insumo / Servicio | Cantidad | Precio Unit. | Total |
| :--- | :--- | :--- | :--- |
| **Abono Grano** | 500 kg (20 sacos) | 23,00 € | 460,00 € |
| **Cobre Líquido** | 15 Litros | 13,40 € | 134,00 € |
| **Potasio (Polvo)** | 50 kg | 7,00 € | 350,00 € |
| **Jabón Potásico** | 20 Litros | 13,00 € | 260,00 € |
| **Nutrientes** | 50 Litros | 1,60 € | 80,00 € |
| **Carnadine** | 1 Litro | 63,00 € | 63,00 € |
| **Servicio Vecino** | 4 pasadas | 120,00 € | 480,00 € |
| **Mto. Carretilla** | 1 Lote | 50,00 € | 50,00 € |

---

## 9. Instrucciones de Implementación Técnica
Para asegurar la viabilidad del proyecto, siga este orden de ejecución:
1.  **Estructura de BD:** Implemente las tablas relacionales definidas en la Sección 5.
2.  **Lógica de Negocio:** Configure los triggers de stock para que cada `Registro de Aplicación` afecte automáticamente a `Insumos.stock`.
3.  **Interfaz Visual:** Desarrolle el sistema de tarjetas centrado en `Dashboard`, `Tratamientos` y `Expansión` para garantizar una UX móvil fluida.
4.  **Integración Bot:** Conecte el Token existente a los nuevos endpoints de `/registrar`, `/lista_compra` y `/alertas`.
5.  **Ciclo de Mejora Continua:** Revise anualmente el `Rendimiento Graso (%)` y ajuste los `Stock Mínimos` según la experiencia de la campaña anterior.







FIN DEL DOCUMENTO

PLAN MAESTRO LA HUERTA

Versión 4.0

Julio 2026