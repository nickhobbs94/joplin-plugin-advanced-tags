import { DataApi } from './dataApi';

export type Notebook = {id: string, title: string, parent_id: string};

export class NotebookAPI {
    constructor(public dataApi: DataApi) { }

    private static FIELDS = ['id', 'title', 'parent_id'];

    public async getByName(notebookName: string): Promise<Notebook> {
        const notebooks =  await DataApi.getAll(['search'], {
            query: `${notebookName}`,
            type: 'folder',
            fields: NotebookAPI.FIELDS
        });

        if (notebooks.length !== 1) {
            throw new Error(`Notebook name ${notebookName} is note unique to one notebook`);
        }

        return notebooks[0];
    }
}
