# Advanced Tags

Write rules to update your tags within your Joplin notebooks.

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

## Future
I'm planning on adding automatic tag renames here too. For example making sure that if I add a tag named `#maths` it automatically renames to `#mathematics`.
