# Issues

## Windows
- Signing for windows - do we need it - how does it work.

## Files
- Designer uses a combination of default.less and styles.json. default.css can be written to but it is never read.
- Older config.xml files will have components removed so we have to match up using the template attribute.
- Current solution is to find the matching config.xml using the template attribute and inject any missing widgets into the config.xml file being read in.
- Could this break older config.xml files.
- Theres no way of matching config.xml files by language, so its reliant on the user setting the language for the app.

## Images
- How to copy and move referenced images.

## Text
- Text bugs.

## General
- Dont select canvas when in preview mode
- Save As
- Undo / Redo

## Refactor
- Dropdown showing palette colours whenever a palette needs to be selected for a config property
- Take this out of formcontrols
if (data.formType === 'PropertyGroup' || data.formType === 'MapLayers') dispatchGroupPropertyChange(data);

## Map Json
- Take bounding box from map
- Update form when name has changed
- maintainlayer order - make layers sortable - override
- refresh happening too quickly on colour

