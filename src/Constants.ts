import { resolve, dirname } from "path";

export default class Constants {
    static readonly urlPattern = new RegExp("(http|ftp|https|file):///?[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?");
    static readonly modulePath = __dirname;
    static readonly tmpName = "tdd-suite-";
    static readonly baseUrl = dirname(Constants.modulePath);
    static readonly framework = "mocha";
    static readonly adapterPath = resolve(Constants.modulePath, "adapter");
    static readonly rendererPath = resolve(Constants.modulePath, "renderer");
    static readonly electronRendererPath = resolve(Constants.rendererPath, "electron");
    static readonly nodeRendererPath = resolve(Constants.rendererPath, "node");
    static readonly indexUrl = resolve(Constants.electronRendererPath, "browser/index.html");
    static readonly backendRenderer = resolve(Constants.electronRendererPath, "Backend");
    /*
    static readonly tmpName = "tdd-suite-";
    static readonly modulePath = __dirname;
    static readonly adapterPath =  resolve(Constants.modulePath, "lib/adapter");
    static readonly browserAdapterPath = resolve(Constants.adapterPath, "BrowserAdapter");
    static readonly nodeAdapterPath = resolve(Constants.adapterPath, "NodeAdapter");
    static readonly tddConfig = "tdd.json";
    static readonly indexUrl = "index.html";
    */
}
