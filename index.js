import { ipcMain, ipcRenderer } from 'electron';

const CONSOLE_EVENT__GET = 'c569ffc2-844d-4cf8-945f-b8a111350b37';
const CONSOLE_EVENT__SET = 'c74b7aaa-ff0b-489d-9e4a-b25fa54b58bb';
const CONSOLE_EVENT__APPLY = 'c0219c23-6f4c-47ed-941f-41cda3fa4565';

const mainInit = () => {
    ipcMain.handle(CONSOLE_EVENT__GET, async (event, prop) => {
        let result;
        let error;
        try {
            result = console[prop];
        } catch (e) {
            error = e;
        }
        return {
            result,
            error,
        };
    });
    ipcMain.handle(CONSOLE_EVENT__SET, async (event, prop, value) => {
        let result;
        let error;
        try {
            result = console[prop] = value;
        } catch (e) {
            error = e;
        }
        return {
            result,
            error,
        };
    });
    ipcMain.handle(CONSOLE_EVENT__APPLY, async (event) => {
        let result;
        let error;

        const argumentList = [];
        for (let i = 1; i < arguments.length; ++i) {
            argumentList.push(arguments[i]);
        }

        try {
            result = console(...argumentList);
        } catch (e) {
            error = e;
        }
        return {
            result,
            error,
        };
    });
}

const consoleGet = async (prop) => {
    const data = await ipcRenderer.invoke(CONSOLE_EVENT__GET, prop);
    if (data?.error) {
        throw error
    }
    return data?.result;
}
const consoleSet = async (prop, value) => {
    const data = await ipcRenderer.invoke(CONSOLE_EVENT__SET, prop, value);
    if (data?.error) {
        throw error
    }
    return data?.result;
}
const consoleApply = async () => {
    const data = await ipcRenderer.invoke(CONSOLE_EVENT__APPLY, ...arguments);
    if (data?.error) {
        throw error
    }
    return data?.result;
}

let console = null;

if (process?.type === 'renderer') {
    console = new Proxy(console, {
        get(target, prop, receiver) {
            return consoleGet(prop);
        },
        set(target, prop, value, receiver) {
            consoleSet(prop, value);
            return true;
        },
        apply(target, thisArgument, argumentList) {
            return consoleApply(...argumentList);
        }
    });
}


if (process?.type === 'browser') {
    mainInit();
}

export {
    console,
};
