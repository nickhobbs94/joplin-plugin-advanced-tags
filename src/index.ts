import joplin from 'api';
import { SettingItemType } from 'api/types';
import { PARENT_TAG_RELATION_SETTING, addParentTagsToChildren, getTagParentRelationships } from './setParentTags';
import { DataApi } from './dataApi';

export const RENAME_TAG_RELATION_SETTING: string = 'joplin-rename-tag-relation';

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
			[RENAME_TAG_RELATION_SETTING]: {
				value: RENAME_TAG_RELATION_SETTING,
				type: SettingItemType.String,
				section: 'tagRuleSection',
				public: true,
				label: 'Common tag for all notes specifying rename tags',
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
	},
});
