import joplin from 'api';
import { DataApi } from './dataApi';

export type Note = {id: string, title: string, body: string};

export class NoteAPI {
    constructor(public dataApi: DataApi) { }

    private static FIELDS = ['id', 'title', 'body'];

    public async getByTagName(tagName: string): Promise<Note[]> {
        return await DataApi.getAll(['search'], {
            query: `tag:"${tagName}"`,
            type: 'note',
            fields: NoteAPI.FIELDS
        });
    }

    public async getByTagNameUnderFolder(tagName: string, fromNotebook: string): Promise<Note[]> {
        return await DataApi.getAll(['search'], {
            query: `tag:"${tagName}" notebook:"${fromNotebook}"`,
            type: 'note',
            fields: NoteAPI.FIELDS
        });
    }

    public async getByTagNameExcludeFolder(tagName: string, toNotebook: string): Promise<Note[]> {
        return await DataApi.getAll(['search'], {
            query: `tag:"${tagName}" -notebook:"${toNotebook}"`,
            type: 'note',
            fields: NoteAPI.FIELDS
        });
    }

    public async moveNoteToFolder(note: Note, toNotebookName: string) {
        const notebook = await this.dataApi.notebook.getByName(toNotebookName);
        await joplin.data.put(['notes', note.id], null, {parent_id: notebook.id});
    }
}
