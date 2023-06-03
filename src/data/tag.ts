import joplin from 'api';
import { DataApi } from './dataApi';
import { Note } from './note';

export type Tag = {id: string, title: string};

export class TagAPI {
    constructor(public dataApi: DataApi) { }

    public async delete(tag: Tag) {
        await joplin.data.delete(['tags', tag.id]);
    }

    public async getByName(name: string): Promise<Tag[]> {
        return await DataApi.getAll(['search'], {query: name, type: 'tag'});
    }
}