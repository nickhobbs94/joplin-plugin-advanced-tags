import { DataApi } from "./dataApi";
import joplin from 'api';

export const PARENT_TAG_RELATION_SETTING: string = 'joplin-parent-tag-relation';

export type ParentTagRelationship = {
	childTagName: string,
	parentTagName: string,
}

async function getParentTagName(): Promise<string> {
    return await joplin.settings.value(PARENT_TAG_RELATION_SETTING);
}

export async function getTagParentRelationships(dataApi: DataApi): Promise<ParentTagRelationship[]> {
    const tagName = await getParentTagName();
    const tag = dataApi.getTagByName(tagName);
    if (!tag) {
        console.warn(`Cannot find tag ${tagName}`);
        console.log(dataApi.allTags);
        return [];
    }

    const notes = await dataApi.getNotesWithTag(tag.id);
    let result: ParentTagRelationship[] = [];

    for (let note of notes) {
        const parsed = JSON.parse(note.body);
        const relations: ParentTagRelationship[] = Object.keys(parsed)
            .map(key => ({childTagName: key, parentTagName: parsed[key]}));
            result = result.concat(relations);
    }

    return result;
}
