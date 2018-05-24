# Features

## Undo functionality
- Added undo functionality to replace annoying warning pops where necessary.

## Code
- Code completely refactored/modularized where needed.
- Many minor bugs/issues fixed during refactoring.
- Much easier to debug and add new functionality.

## GUI
- Generally tidied up and simplified the user interface as much as possible with more advanced functionality hidden away but still discoverable.
- Report uses full screen.
- Sidebar hidden when not in use.

## Menu
- Edit / Preview changed to radio buttons.
- Added an "image" dropdown menu for styling/layout functionality.
- Added insert option to menu which allows you to quickly insert text, images and buttons without opening the add widget modal.
- Tidied and simplified menu (currently too many items in main menu bar)
- Dropdown menus appear on hover rather than click (more intuitive).

## Widgets
- All buttons removed from widget hover so they dont block resizing.
- Properties, send to back/front and delete widget buttons appear in menu only when a widget is selected and are hidden when no widget is selected.
- Removed warning messages for deleting widgets (they can get very tedious) because its now difficult to delete a widget unintentionally and its easy to add back in if you do.
- Widget properties sidebar contains undo/done to rollback any changes to the widget you are currently editing.
- Added insert option to menu which allows you to quickly insert text, images and buttons without opening the add widget modal.
- Add widget functionality has been moved to sidebar so you can add multiple widgets without the modal closing.

## Sidebar
- Sidebar functionality more modularized eg color scheme now launched from menu rather than button in style sidebar.
- All styling/layout/widget functionality moved to sidebar (it means you can play around with different styles/layouts without the modal closing.
- Sidebar hidden when not in use.
- Side bars contain undo/done functionality.

## Forms
- Code completely revamped so much more user friendly and easier to debug and create new controls.
- Fixed all minor bugs relating to use of forms.
- When switching between forms scroll position is maintained.
- When adding new columns/menu items/breaks/etc. they are added at the top rather than bottom so user gets visual feedback.
- Drag and drop functionality of columns/menu items/breaks/etc. improved.
- Removed annoying bootstrap tooltips - replaced with less intrusive html title tip.
- Added undo functionality.