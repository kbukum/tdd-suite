import { dirname } from "path";
const UrlFormat = require("url");
import {hasValue} from "./util/Functions";
import {resolve} from "path";

class Constants {
    static readonly urlPattern = new RegExp("(http|ftp|https|file):///?[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?");
    static readonly tddModulePath = dirname(__dirname);
    static readonly adapterPath = resolve(Constants.tddModulePath, "lib/adapters");
    static readonly adapterClass = resolve(Constants.adapterPath, "api/MainAdapter");
    static readonly indexUrl = resolve(Constants.adapterPath,"api/web/index.html");
    static readonly runner = "Runner";
    static readonly commandTemplate = {
        "--help": ["help", "output usage information", false],
        "-h": "--help",
        "--debug-brk ": ["Boolean", "Debug", false],
        "--renderer": ["Boolean", "run tests in renderer process", false],
        "--interactive": ["Boolean", "browser will open to debug code.", false],
        "--tdd-config": ["JsonFile", "configuration file"],
        "-tdd": "--tdd-config",
        "--remote-debugging-port": ["String", "Debugging", false],
        "--base-url": ["String","base url to use as base for the project"],
        "--index-url": ["String", "browser will open on url", Constants.indexUrl],
        "--adapter-path": ["String", "adapter base path", Constants.adapterPath],
        "--adapter-class": ["String", "adapter class", Constants.adapterClass],
        "--root-list": ["Array", "root folder list", []],
        "--framework": ["String", "interactive flag", "mocha"],
        "--tdd-runner": ["String", "tdd runner"]
    };
    static formatUrl(url, protocol?, slashes?){
        return UrlFormat.format({
            protocol: hasValue(protocol)? protocol : "file",
            slashes: hasValue(slashes)? slashes : true,
            pathname: url
        });
    }
}

export default Constants;
