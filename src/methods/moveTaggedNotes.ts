import { Note } from "src/data/note";
import { DataApi } from "../data/dataApi";
import { settings } from "../settings";

export const MOVE_TAG_RULE_TAG_SETTING_NAME = 'joplin-move-tag-rule';

export async function moveTaggedNotes(dataApi: DataApi) {
    const rules = await getRules(dataApi);
    for (let rule of rules) {
        await applyRule(rule, dataApi);
    }
}

/* Implementation below here */

type Rule = {
    tag: string,
    fromNotebook?: string | undefined,
    toNotebook: string,
}

function validateRule(rule: Partial<Rule>): boolean {
    if (typeof rule.tag !== 'string') return false;
    if (typeof rule.toNotebook !== 'string') return false;
    if (rule.fromNotebook && typeof rule.fromNotebook !== 'string') return false;
    return true;
}

async function getRules(dataApi: DataApi) {
    const ruleTagName = await settings.getSetting(MOVE_TAG_RULE_TAG_SETTING_NAME);
    const ruleNotes = await dataApi.note.getByTagName(ruleTagName);

    return ruleNotes
        .map(note => JSON.parse(note.body))
        .filter(validateRule);
}

async function applyRule(rule: Rule, dataApi: DataApi) {
    console.log(rule);
    let notes: Note[];
    if (rule.fromNotebook) {
        notes = await dataApi.note.getByTagNameUnderFolder(rule.tag, rule.fromNotebook);
    } else {
        notes = await dataApi.note.getByTagNameExcludeFolder(rule.tag, rule.toNotebook);
    }
    for (let note of notes) {
        await dataApi.note.moveNoteToFolder(note, rule.toNotebook);
    }
}
