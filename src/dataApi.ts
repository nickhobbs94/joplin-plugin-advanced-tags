import joplin from 'api';
import { Path } from 'api/types';

type Tag = {id: string, title: string};
type Note = {id: string, title: string, body: string};

export class DataApi {

    constructor(public allTags: Tag[]) {}

    public static async builder(): Promise<DataApi> {
        const allTags = await DataApi.getAll(['tags'], {fields: ['id', 'title']});
        return new DataApi(allTags);
    }

    public async addParentTags(tagRelation: {id: string, parentId: string}) {
        const notes: {id: string}[] = await DataApi.getAll(['tags', tagRelation.id, 'notes'], { fields: ['id'] });

        for (let note of notes) {
            console.log(`updating ${tagRelation} for note ${note.id}`);
            await DataApi.setNoteTag(note.id, tagRelation.parentId);
        }
    }

    public getTagByName(tagName: string) {
        return this.allTags.find(tag => tag.title === tagName);
    }

    public async getNotesWithTag(tagId: string): Promise<Note[]> {
        return await DataApi.getAll(['tags', tagId, 'notes'], { fields: ['id', 'title', 'body'] });
    }

    public async getNoteTags(note: Pick<Note, 'id'>): Promise<Tag[]> {
        return await DataApi.getAll(['notes', note.id, 'tags'], { fields: ['id', 'title'] });
    }

    private static async setNoteTag(noteId: string, tagId: string): Promise<void> {
        await joplin.data.post(['tags', tagId, 'notes'], null, {id: noteId});
    }

    private static async getAll(path: Path, options: any): Promise<any[]> {
        let results: any = [];
        let hasMore = true;
        let page = 1;

        while (hasMore && page < 1000) {
            let data = await joplin.data.get(path, {...options, page});
            hasMore = data.has_more;
            results = results.concat(data.items);
            page += 1;
        }

        return results;
    }

}
