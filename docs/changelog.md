# Changelog

## [2.6.3](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/2.6.3) (07.11.2025)

- Fix bug where the open command wouldn't insert the selected text in the search field.

## [2.6.2](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/2.6.2) (12.06.2025)

- Change the plugin name from Wikipedia Search to Wikipedia Helper

## [2.6.1](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/2.6.1) (09.02.2025)

- Remove surfing integration and replace with web viewer core plugin

## [2.6.0](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/2.6.0) (30.07.2024)

- Fix problems with wrong auto-cleanup of intros
- Add basic support for Wiktionary, Wikibooks, Wikiquote, Wikiversity, Wikivoyage, Wikisource, Wikinews 

## [2.5.1](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/2.5.1) (09.06.2024)

- Small bug fix. The keyboard wouldn't open automatically on commands on mobile.

## [2.5.0](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/2.5.0) (08.06.2024)

- Fixes a broken link in the settings
- Gets rid of the cursor positioning setting and introduces `{cursor}` as a replacement
- Adds auto-search with note title
- Adds global replacements (all tags in the file will be replaced and not just the ones in the template string)
- Few minor tweaks like better texts

## [2.4.4](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/2.4.4) (15.03.2024)

- Tweaks the auto cleanup for some more edge cases.

## [2.4.3](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/2.4.3) (07.03.2024)

- Fixes a forbidden characters in file name bug. (#30)
- Fixes a bug with the directory search in the settings with the forced `/`. (#27)

## [2.4.2](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/2.4.2) (07.03.2024)

- Adds the `{thumbnailUrl}` option for the template strings.

## [2.4.1](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/2.4.1) (23.02.2024)

- Fixes a bug where a template still uses the specified template file without creating a note
- Improves the auto-cleanup feature to also parse the LaTeX of a Wikipedia articles intro.

## [2.4.0](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/2.4.0) (17.12.2023)

- Fixes a big bug that made using template files with the link article command impossible. (#25)
- Adds the option to use the parent folder of the currently active note to create new notes in. (#24)

## [2.3.3](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/2.3.3) (02.12.2023)

- Adds the template file option.
- Adds the `Override files` setting
- Fixes some bugs.

## [2.3.2](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/2.3.2) (27.11.2023)

- Adds the `Create article note` command.
- Adds the `Open created article notes` setting.

## [2.3.1](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/2.3.1) (18.11.2023)

- Introduces the new documentation and links it from the settings page.

## [2.3.0](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/2.3.0) (18.11.2023)

- Fixes article redirect bugs and adds intro auto cleanup.

## [2.2.1](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/2.2.1) (14.11.2023)

- Fixes an IOS bug (#20).
- Fixes typos and stuff.

## [2.2.0](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/2.2.0) (16.10.2023)

- Adds note creation for articles and improves a bunch of stuff.

## [2.1.4](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/2.1.4) (29.09.2023)

- Fixes a mobile bug with the surfing integration.

## [2.1.2](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/2.1.2) (20.08.2023)

- Adds the `{thumbnail}` option for the templates.

## [2.1.1](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/2.1.1) (03.08.2023)

- Small styling and functionality patch.

## [2.1.0](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/2.1.0) (03.08.2023)

- Changes `Open article` to use the surfing plugin.

## [1.9.2](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/1.9.2) (19.07.2023)

- Fixes links opening when offline.

## [1.9.1](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/1.9.1) (12.07.2023)

- Fixes file navigation bug (#14).

## [1.9.0](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/1.9.0) (10.07.2023)

- Adds an `Open article` command.

## [1.8.1](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/1.8.1) (25.06.2023)

- Fixes a small intro language bug.

## [1.8.0](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/1.8.0) (14.06.2023)

- Adds the option for multiple templates.
- Adds a {language} and {languageCode} parameter for the templates.
- Some smaller tweaks.

## [1.7.1](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/1.7.1) (25.05.2023)

- Adds a setting for choosing whether or not to use the articles title instead of the selected text for '{title}' parameter when hyperlinking.

## [1.7.0](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/1.7.0) (25.05.2023)

- Implements the option for the cursor placement (#7)
- Adds the option to auto-select single response queries (#8)

## [1.6.3](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/1.6.3) (21.04.2023)

- Removes an unnecessary check.
- Update the funding url.

## [1.6.2](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/1.6.2) (15.04.2023)

- Fixes a bug with some queries messing up the urls and therefore showing wrong descriptions.

## [1.6.1](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/1.6.1) (31.03.2023)

- Improves the offline error handling. A missing internet connection gets caught right away now.

## [1.6.0](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/1.6.0) (31.03.2023)

- Adds `{intro}` for the templates.
- Improve the UX with better setting descriptions and so on.

## [1.5.0](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/1.5.0) (31.03.2023)

- Added quicksearching different languages.

## [1.4.0](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/1.4.0) (31.03.2023)

- Added hyperlinking.

## [1.3.0](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/1.3.0) (29.03.2023)

- Improve search with articles description.

## [1.2.0](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/1.2.0) (23.03.2023)

- Minor code and meta data changes.

## [1.1.0](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/1.1.0) (20.03.2023)

- Improved error handling when the user is offline.

## [1.0.0](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/1.0.0) (15.03.2023)

- Birth
