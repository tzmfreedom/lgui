export interface Config {
    objects: Array<string>
    views: any
    layouts: { [key: string]: LayoutStore }
}

export interface LayoutStore {
    default: Layout
    [key:string] : Layout
}

type TriggerType = 'CreateRecord' | 'UpdateRecord'

export interface Trigger {
    name: string
    type: TriggerType
    definition: any
}

export interface Layout {
    definitions: Array<LayoutDefinition>
    defaultSize: any
    trigger?: Trigger
}

export type LayoutDefinition = LayoutDefinitionField | LayoutDefinitionButton | LayoutDefinitionSection | LayoutDefinitionBlank;

export interface LayoutDefinitionField {
    type: 'field'
    name: string
    required?: boolean
    label?: string
}

export interface LayoutDefinitionButton {
    type: 'button'
    label?: string
}
export interface LayoutDefinitionSection {
    type: 'section'
    label?: string
}
export interface LayoutDefinitionBlank {
    type: 'blank'
}

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

    getObject(key: string, defaultValue: Object): Object {
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
        layouts: {},
    },
};

