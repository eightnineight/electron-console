# electron-console

Use main process consoles in renderer process

## Install

```
npm install @eightnineight/electron-console
```

## Usage

main process

```js
import "@eightnineight/electron-console";
```

renderer process

```js
import "@eightnineight/electron-console";

// use as usual, except when using console.log(function)
console.log('test');
```
