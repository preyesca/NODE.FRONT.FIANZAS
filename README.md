<p align="center">
  <a href="https://cibergestion.com.mx/" target="blank"><img src="https://teggium.com/assets/img/logo-teggium.png"  alt="Teggium_logo" />
  </a>
</p>

<h2 align="center">Teggium | Aplicación Web Marsh</h2>

## 🛠️ Instaladores

Herramientas requeridas para el desarrollo.

| Nombre                                                            | Command |
| :---------------------------------------------------------------- | :------ |
| [Visual Studio Code](https://code.visualstudio.com/)              | -       |
| [Node.js](https://nodejs.org/dist/v18.16.0/node-v18.16.0-x64.msi) | -       |
| [Git](https://git-scm.com/download/win)                           | \_      |
| [Postman](https://dl.pstmn.io/download/latest/win64)              | -       |

## 📄 Extensiones y configuraciones

Se detalla algunas extensiones y/o configuraciones que nos permitirá mejorar la productividad y calidad de nuestro código:

| Extensión                                                                                                | Extension Id                          |
| :------------------------------------------------------------------------------------------------------- | :------------------------------------ |
| [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)                   | `usernamehw.errorlens`                |
| [Image preview](https://marketplace.visualstudio.com/items?itemName=kisstkondoros.vscode-gutter-preview) | `kisstkondoros.vscode-gutter-preview` |
| [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)                | `wix.vscode-import-cost`              |
| [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)                   | `esbenp.prettier-vscode`              |
| [TODO Highlight](https://marketplace.visualstudio.com/items?itemName=wayou.vscode-todo-highlight)        | `wayou.vscode-todo-highlight`         |
| [Todo Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree)                   | `Gruntfuggly.todo-tree`               |
| [SonarLint](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode)            | `SonarSource.sonarlint-vscode`        |
| [Turbo Console Log](https://marketplace.visualstudio.com/items?itemName=ChakrounAnas.turbo-console-log)  | `ChakrounAnas.turbo-console-log`      |
| [Peacock](https://marketplace.visualstudio.com/items?itemName=johnpapa.vscode-peacock)                   | `johnpapa.vscode-peacock`             |

En el `settings.json` de su **VS Code** agregar la siguiente configuración:

```bash
 "omnisharp.organizeImportsOnFormat": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": "explicit"
  },
  "typescript.updateImportsOnFileMove.enabled": "always",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "javascript.updateImportsOnFileMove.enabled": "always",
  "editor.fontLigatures": true, #Opcional
  "editor.guides.bracketPairs": true, #Opcional
  "editor.guides.bracketPairsHorizontal": true #Opcional
```

## 🛠️ Iniciar aplicación (Development)

Se requiere tener en ejecución los siguientes proyectos:

| Aplicación                                       | Url                                 |
| :----------------------------------------------- | :---------------------------------- |
| [Api Gateway](http://localhost:5080/api/swagger) | `http://localhost:5080/api/swagger` |
| [Portal Asegurado](http://localhost:5082)        | `http://localhost:5082`             |

Para iniciar la aplicación se necesita ejecutar alguno de estos comandos:

```bash
npm start

ng serve
```

## 🛠️ Despliegue

Obtener el compilado del aplicativo para publicar en otro ambiente:

| Ambiente | Comando              |
| :------- | :------------------- |
| DEV      | `npm run deploy_dev` |
| QA       | `npm run deploy_qa`  |
| PROD     | `npm run deploy_pro` |
