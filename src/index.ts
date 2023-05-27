import joplin from 'api';
import { SettingItemType } from 'api/types';
import { PARENT_TAG_RELATION_SETTING, addParentTagsToChildren, getTagParentRelationships } from './setParentTags';
import { DataApi } from './dataApi';
import { deduplicateTags } from './deduplicateTags';

joplin.plugins.register({
	onStart: async function() {
		await joplin.settings.registerSection('tagRuleSection', {
			label: 'Tag Rule Settings',
			iconName: 'fas fa-tag',
		});

		await joplin.settings.registerSettings({
			[PARENT_TAG_RELATION_SETTING]: {
				value: PARENT_TAG_RELATION_SETTING,
				type: SettingItemType.String,
				section: 'tagRuleSection',
				public: true,
				label: 'Common tag for all notes specifying parent tags',
			},
		});

		await joplin.commands.register({
			name: 'updateTags',
			label: 'Update tags based on user defined rules',
			execute: async () => {
				console.info('UPDATING TAGS');
				const dataApi = await DataApi.builder();

				const tagParents = await getTagParentRelationships(dataApi);

				console.log(`tagParents.length ${tagParents.length}`);

				await addParentTagsToChildren(dataApi, tagParents);
			},
		});

		await joplin.commands.register({
			name: 'deleteDuplicateTags',
			label: 'Delete duplicate tags',
			execute: async () => {
				console.info('DELETING DUPLICATE TAGS');
				const dataApi = await DataApi.builder();
				await deduplicateTags(dataApi);
			},
		});
	},
});
