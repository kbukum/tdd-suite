import * as MochaRunner from "./mocha";
import PropsClass from "wasabi-common/lib/lang/PropClass";
var {ipcRenderer, remote } = require('electron');

class MochaRender extends PropsClass {
    constructor() {
        super({});
        this.props.opts = ipcRenderer.sendSync('on-renderer', 1);
    }

    run(){
        let opts = this.props.opts;
        if (!opts.interactive) {
            require('./console')
        }
        (window as any).mocha = require('mocha');
        try {
            opts.preload.forEach((script) => {
                const tag = document.createElement('script');
                tag.src = script;
                tag.async = false;
                document.head.appendChild(tag)
            })
        } catch (error) {
            console.log(error);
            ipcRenderer.send('on-error', {
                message: error.message,
                stack: error.stack
            })
        }

        try {
            (MochaRunner as any).run(opts, (...args) => {
                ipcRenderer.send('on-completed', ...args)
            })
        } catch (e) {
            let error = {
                message: e.message,
                stack: e.stack
            };
            ipcRenderer.send('on-error', error);
        }

    }
}

const rendered = new MochaRender();
rendered.run();
