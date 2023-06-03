import joplin from 'api';

export const settings = {
    getSetting: async (name: string): Promise<string> => await joplin.settings.value(name),
}
