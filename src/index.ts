import joplin from 'api';

const tagParents = {
	'number-theory': 'maths'
};

type TagInfo = {
	id: string,
	name: string,
	parentName: string,
	parentId: string,
}

async function updateTags(tag: TagInfo) {
	const notes = await joplin.data.get(['tags', tag.id, 'notes'], { fields: ['id'] });
	for (let note of notes.items) {
		console.log(`updating ${tag} for ${note}`);
		joplin.data.post(['tags', tag.parentId, 'notes'], null, {id: note.id});
	}
}

joplin.plugins.register({
	onStart: async function() {
		console.info('Hello world. Test plugin started!');

		// This event will be triggered when the user selects a different note
		await joplin.workspace.onNoteSelectionChange(() => {
			console.info('onNoteSelectionChange');
		});

		// This event will be triggered when the content of the note changes
		// as you also want to update the TOC in this case.
		await joplin.workspace.onNoteChange(async () => {
			console.info('onNoteChange');
			let note = await joplin.workspace.selectedNote();
			console.log(note);
		});

		await joplin.commands.register({
			name: 'updateTags',
			label: 'Tag menu item from plugin',
			execute: async () => {
				console.info('UPDATING TAGS');
				const allTags = await joplin.data.get(['tags']);
				for (let tagName of Object.keys(tagParents)) {
					let tag = allTags.items.find(t => t.title === tagName);
					if (!tag) {
						console.warn(`Unable to find tag ${tagName}`);
						continue;
					}

					let parentTag = allTags.items.find(t => t.title === tagParents[tagName]);
					if (!parentTag) {
						console.warn(`Unable to find tag ${tagParents[tagName]}`);
						continue;
					}

					await updateTags({
						id: tag.id,
						name: tagName,
						parentId: parentTag.id,
						parentName: tagParents[tagName],
					});
				}
			},
		});

		// Also update the TOC when the plugin starts
		console.info('when the plugin starts');
	},
});
