import { ipcMain, ipcRenderer } from 'electron';

const CONSOLE_EVENT__LOG = 'c0219c23-6f4c-47ed-941f-41cda3fa4565';

let originConsoleLog;

const consoleLog = async (...rest) => {
    if (originConsoleLog) {
        originConsoleLog(...rest);
    }
    const data = await ipcRenderer.invoke(CONSOLE_EVENT__LOG, ...rest);
    if (data?.error) {
        throw data.error
    }
    return data?.result;
}

if (process?.type === 'browser') {
    const mainInit = () => {
        ipcMain.handle(CONSOLE_EVENT__LOG, async (event, ...rest) => {
            let result;
            let error;

            try {
                result = console.log(...rest);
            } catch (e) {
                error = e;
            }
            return {
                result,
                error,
            };
        });
    }

    mainInit();
}

if (process?.type === 'renderer') {
    originConsoleLog = console.log;
    console.log = consoleLog;
}
