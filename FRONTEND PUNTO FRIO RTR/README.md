
# 🖥️ SISTEMA WEB DE GESTIÓN DE VENTAS PARA EL PUNTO FRÍO R.T.R

En el siguiente repositorio se describe el uso de herramientas de desarrollo, despliegue e instalación del proeycto. 


## ⚙️ Herramientas de desarrollo

* React
* Tailwind CSS
* React Hoocks
* React icons
* jsPDF
* Visual Studio Code
* GitHub
* Vite


## 🧑‍💻Ambiente de desarrollo

Tener en cuenta los siguientes ajustes previos a la descarga del archivo

1. Tener instalado Node.js
2. Tener un editor de código como Visual Studio Code

Clonar el proeycto

```bash
  git clone https://github.com/AlanRiosMendoza/SYSTEM-PUNTO-FRIO-RTR.git
```

Cambiar ubicación a la carpeta de desarrollo, cabe mencionar que los comandos son empleados en el terminak de bash de Visual Studio Code.

```bash
  cd "[nombre del componente]"
```

En la ruta del proyecto abrir la terminal y escribir el siguiente comando para instalar las dependencias de desarrollo y las versiones del proyecto.

```bash
  npm i
```

Para realizar el despliegue del proyecto como desarrollador es necesario escribir en la terminal el siguiente comando

```bash
  npm run dev
```


## ✍️ Variables de entorno

Para que el proyecto corra es necesario incluir las variables de entorno del proyecto.
Para ello debemos crear una archivo en la raiz del proyecto con el nombre ```.env```. 

Además incluir el nombre dentro del archivo ```.gitignore```.

Las varibles de entorno deben seguir el siguiente esquema:

`VITE_BACKEND_URL` = "Dirección del backend"

`VITE_RUC`= "Numero de RUC del establecimiento"

`VITE_DIRECCION`= "Dirección del establecimiento"

`VITE_TELEFONO`= "Telefono del establecimiento"



## 🛫 Despliegue

El proyecto se encuentra desplegado en el siguiente enlace:

https://punto-frio-rtr-sandy.vercel.app/


## Authors

- [Frontend - Cristhian Pañora](https://github.com/risthian-P)

- [Backend - Alan Rios Mendosa](https://github.com/AlanRiosMendoza)

