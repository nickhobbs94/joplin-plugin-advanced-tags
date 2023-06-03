import joplin from 'api';
import { Path } from 'api/types';
import { Tag, TagAPI } from './tag';
import { Note, NoteAPI } from './note';
import { NotebookAPI } from './notebook';

export class DataApi {

    public tag = new TagAPI(this);
    public note = new NoteAPI(this);
    public notebook = new NotebookAPI(this);

    constructor(public allTags: Tag[]) { }

    public static async builder(): Promise<DataApi> {
        const allTags = await DataApi.getAll(['tags'], {fields: ['id', 'title']});
        return new DataApi(allTags);
    }

    public async addParentTags(child: Tag, parent: Tag) {
        const notes: {id: string}[] = await DataApi.getAll(['tags', child.id, 'notes'], { fields: ['id'] });

        for (let note of notes) {
            console.log(`adding tag ${parent.title} with id ${parent.id} to note ${note.id}`);
            await DataApi.setNoteTag(note.id, parent.id);
        }
    }

    /*
    Apparently there are no guarantees that tag names are unique.
    We might have multiple tags called `number-theory`. We should add `mathematics` to them all.
    */
    public getTagsByName(tagName: string): Tag[] {
        return this.allTags.filter(tag => tag.title === tagName);
    }

    public async getNotesWithTag(tagId: string): Promise<Note[]> {
        return await DataApi.getAll(['tags', tagId, 'notes'], { fields: ['id', 'title', 'body'] });
    }

    public async getNoteTags(note: Pick<Note, 'id'>): Promise<Tag[]> {
        return await DataApi.getAll(['notes', note.id, 'tags'], { fields: ['id', 'title'] });
    }

    public async createTag(title: string): Promise<Tag> {
        return await joplin.data.post(['tags'], null, {title});
    }

    public async getTaggedNotesUnderFolder(tag: string, notebook: string): Promise<Note[]> {
        return await DataApi.getAll(['search'], {query: `tag:"${tag}" -notebook:"${notebook}"`, type: 'note'});
    }

    private static async setNoteTag(noteId: string, tagId: string): Promise<void> {
        await joplin.data.post(['tags', tagId, 'notes'], null, {id: noteId});
    }

    public static async getAll(path: Path, options: any): Promise<any[]> {
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
