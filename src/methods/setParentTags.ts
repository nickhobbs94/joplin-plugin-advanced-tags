import { DataApi } from "../data/dataApi";
import joplin from 'api';
import { Note } from "../data/note";

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
    const tags = dataApi.getTagsByName(tagName);
    if (tags.length === 0) {
        console.warn(`Cannot find tag ${tagName}`);
        console.log(dataApi.allTags);
        return [];
    }

    let notes: Note[] = [];

    for (let tag of tags) {
        notes = notes.concat(await dataApi.getNotesWithTag(tag.id));
    }

    let result: ParentTagRelationship[] = [];

    for (let note of notes) {
        const parsed = JSON.parse(note.body);
        const relations: ParentTagRelationship[] = Object.keys(parsed)
            .map(key => ({childTagName: key, parentTagName: parsed[key]}));
            result = result.concat(relations);
    }

    return result;
}

export async function addParentTagsToChildren(dataApi: DataApi, tagParents: ParentTagRelationship[]) {
    for (let relation of tagParents) {
        const children = dataApi.getTagsByName(relation.childTagName);
        let parents = dataApi.getTagsByName(relation.parentTagName);

        if (children.length === 0) {
            console.warn(`Unable to find tag ${relation.childTagName}`);
            continue;
        }

        // If there are duplicated parent tags, we only want to add to tags that have notes attached
        if (parents.length > 1) {
            let parentsWithNotes = parents.filter(async (tag) => (await dataApi.getNotesWithTag(tag.id)).length > 0);

            // if none of the tags have any notes then just pick the first one
            if (parentsWithNotes.length === 0) {
                parents = [parents[0]];
            } else {
                parents = parentsWithNotes;
            }
        }

        // create a new parent tag if it doesn't exist yet
        if (parents.length === 0) {
            console.warn(`Creating new tag ${relation.parentTagName}`);
            parents.push(await dataApi.createTag(relation.parentTagName));
        }

        for (let child of children) {
            for (let parent of parents) {
                await dataApi.addParentTags(child, parent);
            }
        }
    }
}
