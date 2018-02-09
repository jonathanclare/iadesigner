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

## Map Json
- Take bounding box from map
- Update form when name has changed
- maintainlayer order - make layers sortable - override
- Issues with the correct path when in evaluation mode

## Spine chart
- election template form. Columns need looking at.

## Other
- debounce on map render in source code might help when layers are edited - stop white polygon background appearing - tried this but it didnt work
needs to only happen on initiation
- Dont select canvas when in preview mode
- When refreshing the report we probably want to keep the current settings rather than completely refreshing it.

## Forms
- Stop buttons being part of drag area - eg map palette can be dragged above "New Palette" button.
- Clicking enter to close colorpicker when its activated
- Shouldnt be allowed to delete the default palette or the report will break
- Opened main report - error when drag and drop - looks like jquery-ui isnt loaded
- Dropdown showing palette colours whenever a palette needs to be selected for a config propert
