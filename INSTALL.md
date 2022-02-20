## Requisitos

- Nodejs 10.17 en adelante

Se tomo como ejemplo el [repositorio](https://gitlab.agetic.gob.bo/agetic/backend-base-nestjs) para conectarse con Ciudadania Digital y servir datos fake

La configuración de las variables de entorno se encuentran en el archivo .env.sample, con la cual se debe renombrar con .env

``` bash
mv .env.sample .env

# Explicacion de cada variable 

VUE_APP_SITENAME=frontend_base                      Es el nombre del sitio, este nombre ayudara a gestionar la creación de cookies, almacenamiento en el storage, etc.
VUE_APP_FRONTEND=http://localhost:8079              Es la ruta expuesta para el frontend por ejemplo https://test.agetic.gob.bo/frontend_base
VUE_APP_API_CIUDADANIA=http://localhost:2999        Ruta al cual se accede para autenticarnos, desloguearnos con ciudadanía digital
VUE_APP_API_URL=http://localhost:2999/api/v1/       Ruta expuesta del backend para realizar todas los intercambios de informacion con el frontend
VUE_APP_BASE_SERVER=http://localhost:2999/api/      Ruta base que manejara el backend
VUE_APP_DEBUG_MODE=true                             Para habilitar debug en modo produccion
VUE_APP_PUBLIC_PATH=/                               Para indicar si se tiene un subdominio o no, por ejemplo si se tiene subdominio tendra que ser de la siguiente manera /[MI_SUBDOMINIO]/
VUE_APP_AUTH_TOKEN=Bearer                           Formato para enviar el token

```
### Para los iconos se esta utilizando [material icons](https://materialdesignicons.com/)

## Instalando el proyecto

Siga los siguientes pasos:

### 1. Instalando dependencias

``` bash
npm install
```
### Compilar para produccion

Exportar las variables para producción:

Seteando el ambiente:
```
export NODE_ENV=production
```

Seteando las  urls:
```
export VUE_APP_FRONTEND=[URL_PRODUCCION_FRONTEND]
export VUE_APP_API_URL=[URL_PRODUCCION_BACKEND]
export VUE_APP_BASE_SERVER=[URL_PRODUCCION_BACKEND]
export VUE_APP_PUBLIC_PATH=[SUBDOMINIO]
```

Ejemplo:

```sh
export VUE_APP_FRONTEND=https://test.agetic.gob.bo/frontend_base
export VUE_APP_API_URL=https://test.agetic.gob.bo/backend_base/api/v1/
export VUE_APP_BASE_SERVER=https://test.agetic.gob.bo/backend_base/api/
export VUE_APP_PUBLIC_PATH=/frontend_base/
```

### Compilar para produccion
```
npm run build
```
