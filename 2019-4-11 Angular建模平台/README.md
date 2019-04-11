# HomoloAngularWebapp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.3.

这个项目是用来验证 `homolo-datamodel` 和 `homolo-framework` 两个基础模块功能的webapp.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## 开发提示

先启动两个 library 项目的 build 并开启 watch

```bash
ng build homolo-framework --watch
```

```bash
ng build homolo-datamodel --watch
```

将 `proxy.config.sample.json` 拷贝成 `proxy.config.json` 并做相应修改.

然后再启动application进行开发

```bash
npm start
```