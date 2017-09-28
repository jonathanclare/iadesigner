# Issues

## Windows
- Signing for windows - do we need it - how does it work.

## Files
- Do we need to overwrite ia-min.js.
- Designer uses a combination of default.less and styles.json. default.css can be written to but it is never read.
- Older config.xml files will have components removed so we have to match up using the template attribute.
- Current solution is to find the matching config.xml using the template attribute and inject any missing widgets into the config.xml file being read in.
- Could this break older config.xml files.
- Theres no way of matching config.xml files by language, so its reliant on the user setting the language for the app.

## Images
- Images need fixing.
- Image alignment.
- How to copy and move referenced images.

## Code
- When editing widget properties open panels must remain open.
- Cant delete radarChart2.