# Settings

A list of all the available settings including detailed explanations for each one.

## General settings

::: details Screenshot
![general settings screenshot](/general-settings.png)
:::

### Language

Select the default Wiki language to search. See [languages.ts](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/blob/master/src/utils/languages.ts) for a list of all available languages.
Note: Some features might not work with all languages. (Some APIs might not have all the necessary functionality.)

Default: `en - English`

### Search limit

The maximum number of search results to return and show for any given query. The value must be between (and including) 1 and 500 and a number. Otherwise the last valid value will be kept.

Default: `10`

### Thumbnail width

The width of the inserted thumbnails in pixels. Leave this field empty to use the original size. Any other input must be a valid number. Otherwise the last valid value will be kept. The width will be inserted into the thumbnail embed like this: `![... Thumbnail | <thumbnailWidth>](...)`. The `|` followed by the width tells obsidian to show that image with the specified width.

Default: `‎` (empty)

### Default note path

The default vault folder where articles notes should be created. This only gets used when there is a template which creates notes and it's custom path empty i.e. not set. If set to `[current folder]` the parent folder of the currently active note will be used.

Default: `/` (the root folder)

## Template settings

Each user has a list of templates for the inserts that this plugin creates when [linking articles](commands.md#link-article) or [creating article notes](commands.md#create-article-note). The templates can be separated into one default template and multiple additional templates. Templates can be deleted with the `-` button at the end. The default template can't be deleted. You can create new templates with the `+` button at the bottom right.

The settings for a template can be separated into the following three parts:

::: details Screenshot
![template settings screenshot](/template-settings.png)
:::

### Template name

The first field of each template sets the name of the template. The name of the default template can't be changed (that's why that field is disabled) while the additional templates can have any name.

Default: `Additional Template`

### Creates note & Custom note path

The middle part of a templates settings is all about note creation. It consist of a toggle and a text field that appears when the "creates a note" toggle is in the "on" state. The toggle controls whether or not the template should create a new note with the articles title as its name, paste the insert in there and link the newly created note instead of directly pasting the insert into the current note. This allows for creating notes for articles. We call templates that create new notes "note templates" and templates that doesn't "inline templates".

By default all the notes will be created at the [default note path](#default-note-path). The appearing text field lets you customize the location for any given template. Leave it empty to use the default note path or set it to `[current folder]` to use the parent folder of the currently active note. Note that this means you always have to make sure you have an active note when using [`Create article note`](commands.md#create-article-note).

Default: `false` as in "inline" for the toggle and `‎` (empty) for the custom note path

### Template string

The last and most important part of any template is its template string. The template string is the blueprint for the insert. This last section consists of a toggle and an input field which is either a big text or a file search field. The toggle sets whether or not the template string is declared directly in the settings tab in the big text field or separately in a file which the file search field references instead. Template files are only supported for note templates. That's why the toggle disappears and the input automatically switches to the text field once you switch to an inline template.

The template string can be any kind of string containing line breaks and whatever you can think of. The plugin recognizes the following character sequences (tags) and replaces all occurrences with the corresponding data:

_Available for all Wikis:_
- `{title}` The articles title or current selection (based on [this setting](#use-article-title-instead-of-selection)).
- `{url}` The url of the article.
- `{language}` The name of the language of this article.
- `{languageCode}` The language code of the language of this article.
- `{cursor}` The position of the cursor after inserting. The first reference will be used an all the other deleted. By default (if no `{cursor}` is found) the cursor will be placed after the locally inserted content.

_Available only for Wikipedia articles (for the other Wikis these tags simply get removed):_
- `{description}` The articles description if available. If not, all occurrences will be removed with a notice.
- `{intro}` The articles intro (the first big paragraph). _Note: It can be pretty long and there are some [caveats](https://www.mediawiki.org/wiki/Extension:TextExtracts#Caveats) with the API! (intros can have weird mistakes)_
- `{thumbnail}` An embed to the articles thumbnail if available. If not, all occurrences will be removed with a notice. This will look like `![<article-title> Thumbnail](<url-to-thumbnail>)` or `![<article-title> Thumbnail | <thumbnail-width>](<url-to-thumbnail>)` if the [thumbnail width](#thumbnail-width) is set.
- `{thumbnailUrl}` The url of the articles thumbnail if available. If not, all occurrences will be removed with a notice.

Default: `[{title}]({url})` for inline templates and `{thumbnail}\n[{title}]({url}): {intro}` for note templates

::: tip
You can also use [Templater](https://github.com/SilentVoid13/Templater) Syntax in the template string of note templates to make the article notes even better! Just [install](obsidian://show-plugin?id=templater) and enable the Templater Plugin and enable its "Trigger Templater on new file creation" setting:

![Templater Setting](/templater-setting.png)
:::

## Workflow optimization settings

### Auto-search note title

Whether or not to automatically use the active notes title when searching for articles. The current selection will be prioritized.

Default: `false`

### Auto-select single response queries

Whether or not to automatically select the response to a query when there is only one article to choose from. For example when you select someones name and want to hyperlink it to the persons article this feature will automatically select the article when there is only one article related to that name.

Default: `false`

### Use article title instead of selection

Whether or not to use the articles title instead of the selected text for the '{title}' parameter of your template when hyperlinking.

Default: `false`

### Stop auto-cleanup of intros

Whether or not to stop auto-cleaning/parsing the articles intros for better readability. Many articles intros and mostly intros that contain any math are very poorly formatted the way the Wikipedia API returns them in plain-text. For example the intro of the [Total order](https://en.wikipedia.org/w/api.php?format=json&redirects=1&action=query&prop=extracts&exintro&explaintext&titles=Total%20order) with lots of weirdly placed empty spaces and linebreakes. Therefor every response gets cleaned up a bit for better readability with the following code:

```ts
intro
	// turns all "{\displaystyle ... }" occurrences into a proper LaTeX equation.
	.replaceAll(/{\\displaystyle [^\n]+}/g, (text: string) => "$" + text.slice(15, -1).trim() + "$")
	// removes the unicode characters that try to replace the LaTeX and all the unnecessary linebreakes
	.replaceAll("$\n  \n", "$")
	.replaceAll(/\n  \n    \n      \n[^\$]*      \n    \n    \$/g, "$")
	// take care of some other quirks that can occur
	.replaceAll("  ", " ")
	// escape some markdown syntax
	.replaceAll("`", "\\`")
```

::: details Example

<pre style="white-space:pre-wrap;">"In mathematics, a total order or linear order is a partial order in which any two elements are comparable.  That is, a total order is a binary relation \n  \n    \n      \n        ≤\n      \n    \n    {\\displaystyle \\leq }\n   on some set \n  \n    \n      \n        X\n      \n    \n    {\\displaystyle X}\n  , which satisfies the following for all \n  \n    \n      \n        a\n        ,\n        b\n      \n    \n    {\\displaystyle a,b}\n   and \n  \n    \n      \n        c\n      \n    \n    {\\displaystyle c}\n   in \n  \n    \n      \n        X\n      \n    \n    {\\displaystyle X}\n  :\n\n  \n    \n      \n        a\n        ≤\n        a\n      \n    \n    {\\displaystyle a\\leq a}\n   (reflexive).\nIf \n  \n    \n      \n        a\n        ≤\n        b\n      \n    \n    {\\displaystyle a\\leq b}\n   and \n  \n    \n      \n        b\n        ≤\n        c\n      \n    \n    {\\displaystyle b\\leq c}\n   then \n  \n    \n      \n        a\n        ≤\n        c\n      \n    \n    {\\displaystyle a\\leq c}\n   (transitive).\nIf \n  \n    \n      \n        a\n        ≤\n        b\n      \n    \n    {\\displaystyle a\\leq b}\n   and \n  \n    \n      \n        b\n        ≤\n        a\n      \n    \n    {\\displaystyle b\\leq a}\n   then \n  \n    \n      \n        a\n        =\n        b\n      \n    \n    {\\displaystyle a=b}\n   (antisymmetric).\n\n  \n    \n      \n        a\n        ≤\n        b\n      \n    \n    {\\displaystyle a\\leq b}\n   or \n  \n    \n      \n        b\n        ≤\n        a\n      \n    \n    {\\displaystyle b\\leq a}\n   (strongly connected, formerly called total).Reflexivity (1.) already follows from connectedness (4.), but is required explicitly by many authors nevertheless, to indicate the kinship to partial orders.\nTotal orders are sometimes also called simple, connex, or full orders.A set equipped with a total order is a totally ordered set; the terms simply ordered set, linearly ordered set, and loset are also used. The term chain is sometimes defined as a synonym of totally ordered set, but refers generally to some sort of totally ordered subsets of a given partially ordered set.\nAn extension of a given partial order to a total order is called a linear extension of that partial order."</pre>

gets turned into

<pre style="white-space:pre-wrap;">"In mathematics, a total order or linear order is a partial order in which any two elements are comparable. That is, a total order is a binary relation $\leq$ on some set $X$, which satisfies the following for all $a,b$ and $c$ in $X$:\n$a\leq a$ (reflexive).\nIf $a\leq b$ and $b\leq c$ then $a\leq c$ (transitive).\nIf $a\leq b$ and $b\leq a$ then $a=b$ (antisymmetric).\n$a\leq b$ or $b\leq a$ (strongly connected, formerly called total).\nReflexivity (1.) already follows from connectedness (4.), but is required explicitly by many authors nevertheless, to indicate the kinship to partial orders.\nTotal orders are sometimes also called simple, connex, or full orders.\nA set equipped with a total order is a totally ordered set; the terms simply ordered set, linearly ordered set, and loset are also used. The term chain is sometimes defined as a synonym of totally ordered set, but refers generally to some sort of totally ordered subsets of a given partially ordered set.\nAn extension of a given partial order to a total order is called a linear extension of that partial order."</pre>

:::

Default: `false` (really recommended)

### Article tab placement

Whether or not to open articles in a fullscreen tab instead of a split view when using the Web viewer core plugin to [open the articles directly in Obsidian](commands.md#open-article) or [opening newly created article notes](#open-created-article-notes).

Default: `false`

### Open created article notes

Whether or not to open the newly created article notes directly after creating them. Follows the [article tab placement setting](#article-tab-placement).

Default: `false`

### Override files

Whether or not to override existing files when creating article notes.

Default: `false`
