# Advanced Tags

Write rules to update your tags/notes within your Joplin notebooks. Warning: this plugin is experimental. Use at your own risk.

Rules are writen as notes anywhere in your Joplin instance. You just have to tag them with a specific tag so that they can be found and applied. All notes must be valid JSON to work.

Below are some of the things you can do with this plugin.

## Move Tagged Notes To Notebook

We can write a rule that moves tagged notes into a specific notebook when run. For example, every day I create a new logbook note, and at the end of the week I'd like to move them from my `Desk` notebook into my `Logbook` folder to keep things tidy.

The rule I write would look like this

```
{
  "tag": "log",
  "toNotebook": "Logbook",
  "fromNotebook": "Desk"
}
```

The `fromNotebook` field is optional, leave it off to move from any notebook. This may be slow if you have a lot of notes with this tag.

I will put this into a note anywhere in Joplin and tag it with `#joplin-move-tag-rule`. The specific tag required can be changed in Joplin's settings.

I can then run this rule at the end of the week by running `:moveTaggedNotes` from the CMD+P menu.

## Add Parent Tags

This plugin lets you run a command to add a tag to every note with a given tag.

For example, I have a few notes in my Notebook about number theory and topology.

Notebook contents:
- Prime numbers `#primes` `#number-theory`
- Natural number `#number-theory`
- Torus `#topology`

As you can see, I've tagged these notes with relevant tags.

I now realise, that I often find myself wanting to look at notes tagged either `#number-theory` or `#topology`.
It'd be really handy if I had tagged them all `#mathematics`. Now I could use the search feature and add the tag,
but I want to ensure that any future notes also get `#mathematics` added to them.

Using this plugin I can make a new rule to specify this relationship. If I make a note tagged `#joplin-parent-tag-relation` (the specific tag is configurable) and populate it with the following JSON contents:

```
{
  "number-theory": "mathematics",
  "topology": "mathematics"
}
```

We can then add the mathematics tag to any `#number-theory` or `#topology` tagged notes just by running `:updateTags` in the CMD + P menu.

## Deduplicate tags

One problem with my notebook was that behind the scenes there were actually two tags named `#number-theory`.
I've added a command to delete the duplicate tags. This is likely highly risky. Please make a backup before running this.

## Future
I'm planning on adding automatic tag renames here too. For example making sure that if I add a tag named `#maths` it automatically renames to `#mathematics`.
