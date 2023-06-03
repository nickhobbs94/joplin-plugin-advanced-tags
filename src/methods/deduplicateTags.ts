import { DataApi } from "../data/dataApi";
import { Tag } from "../data/tag";

function dupes(tags: Tag[]) {
    // Create an object with `name` keys and arrays of objects as values
    const groups = tags.reduce((acc: Record<string, Tag[]>, tag) => {
      acc[tag.title] = acc[tag.title] || [];
      acc[tag.title].push(tag);
      return acc;
    }, {});

    // Transform the object back into an array, filtering out those
    // groups that only have one element (because those aren't duplicates)
    const duplicates = Object.values(groups).filter(group => group.length > 1);

    return duplicates;
  }

export async function deduplicateTags(dataApi: DataApi) {
    const duplicates = dupes(dataApi.allTags);
    if (duplicates.length === 0) return;

    console.warn("Found duplicates");
    console.log(duplicates);

    for (let tags of duplicates) {
        const newTag = tags.pop();
        if (!newTag) {
            console.warn("Something has gone wrong. Skipping tag");
            continue;
        }

        for (let oldTag of tags) {
            await dataApi.addParentTags(oldTag, newTag);
            await dataApi.tag.delete(oldTag);
        }
    }
}
