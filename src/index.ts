import joplin from 'api';
import { SettingItemType } from 'api/types';
import { PARENT_TAG_RELATION_SETTING, addParentTagsToChildren, getTagParentRelationships } from './methods/setParentTags';
import { DataApi } from './data/dataApi';
import { deduplicateTags } from './methods/deduplicateTags';
import { MOVE_TAG_RULE_TAG_SETTING_NAME, moveTaggedNotes } from './methods/moveTaggedNotes';

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

		await joplin.settings.registerSettings({
			[MOVE_TAG_RULE_TAG_SETTING_NAME]: {
				value: MOVE_TAG_RULE_TAG_SETTING_NAME,
				type: SettingItemType.String,
				section: 'tagRuleSection',
				public: true,
				label: 'Common tag for all notes specifying move note rules',
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

		await joplin.commands.register({
			name: 'moveTaggedNotes',
			label: 'Move tagged notes based on custom rules',
			execute: async () => {
				console.info('MOVING TAGGED NOTES');
				const dataApi = await DataApi.builder();
				await moveTaggedNotes(dataApi);
			},
		});
	},
});
