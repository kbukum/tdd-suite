import { dirname } from "path";
class Constants {
    static readonly urlPattern = new RegExp("(http|ftp|https|file):///?[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?");
    static readonly modulePath = dirname(__dirname);
    static readonly adapterPath = "lib/adapters";
}

export default Constants;