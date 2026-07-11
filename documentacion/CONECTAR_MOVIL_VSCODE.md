✅ Requisitos
PC
Visual Studio Code
Extensión Live Server instalada
Móvil
Chrome o navegador similar
Conectado a la misma WiFi que el PC

🚜 Flujo de trabajo recomendado
Abrir VS Code
Lanzar Live Server
Abrir móvil
Acceder mediante IP local
Modificar código
Guardar:






# 📱 CONECTAR EL MÓVIL A VISUAL STUDIO CODE

## 1. Abrir el proyecto en VS Code

Abrir:

index.html

## 2. Iniciar Live Server

Botón derecho sobre:

index.html

↓

Open With Live Server

## 3. Obtener IP del PC

Abrir CMD

Escribir:

ipconfig

Buscar:

Dirección IPv4

Ejemplo:

192.168.0.76

## 4. Conectar el móvil

IMPORTANTE:

PC y móvil en la misma WiFi.

Abrir Chrome en el móvil.

Escribir:

http://192.168.0.76:5501

(Cambiar la IP por la tuya)

## 5. Si aparece error SSL

NO usar:

https://192.168.0.76:5501

Usar:

http://192.168.0.76:5501

## 6. Si no funciona

VS Code

↓

Configuración

↓

Buscar:

Use Local IP

↓

Activar:

Live Server: Use Local IP

## 7. Si aún no funciona

Permitir Live Server en Firewall de Windows.

## ✅ Resultado

Editar código en VS Code

↓

Guardar (Ctrl + S)

↓

Actualizar móvil

↓

Ver cambios al instante

## URL ACTUAL

http://192.168.0.76:5501

(Cambiar si cambia la IP del router)