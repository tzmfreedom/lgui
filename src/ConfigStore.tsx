class ConfigStore_ {
    get(key: string) {
        return localStorage.getItem(key);
    }

    set(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    setObject(key: string, value: Object) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    getObject(key: string, defaultValue: Object = []) {
        const value = localStorage.getItem(key);
        if (value === null) {
            this.setObject(key, defaultValue);
            return defaultValue;
        }
        return JSON.parse(value)
    }

    remove(key: string) {
        localStorage.removeItem(key);
    }
}
const allowedStandardObjects = [
    'Account',
    'Contact',
    'User',
    'Lead',
    'Opportunity',
    'Case',
];
export const ConfigStore = new ConfigStore_();
export const Settings = {
    Key: 'lgui-settings',
    AllowedStandardObjects: allowedStandardObjects,
    Default: {
        objects: allowedStandardObjects,
        views: {},
    },
};

