const startIndex: number = "[object ".length;
const getType = (command): string => {
    let type = Object.prototype.toString.call(command);
    return type.substring(startIndex, type.length - 1);
};

const hasValue = (value): boolean => {
    return value !== null && typeof value !== "undefined";
};

const requireMain = (id: string) => {
    let module = require(id);
    if(module.__esModule) {
        if(module.default) {
            return module.default;
        }
        let count = 0;
        let moduleKey;
        for(let key in module) {
            if(module.hasOwnProperty(key)) {
                if(count === 1) {
                    count = -1;
                    break;
                }
                count++;
                moduleKey = key;
            }
        }
        if(count !== -1) {
            return module[moduleKey];
        }
    }
    return module;
};

export {
    getType,
    hasValue,
    requireMain
}