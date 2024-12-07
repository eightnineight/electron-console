# electron-console

When using console.log() in the Electron renderer process, 
simultaneously display log messages in both the main and 
renderer processes.

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
