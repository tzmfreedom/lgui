class ConfigStore {
    get(key: string) {
        return localStorage.getItem(key);
    }

    set(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    setObject(key: string, value: Object) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    getObject(key: string) {
        const value = localStorage.getItem(key);
        if (value === null) return value;
        return JSON.parse(value)
    }

    remove(key: string) {
        localStorage.removeItem(key);
    }
}

export default new ConfigStore();

