import gi
import json
gi.require_version('GMenu', '3.0')
from gi.repository import GMenu, Gio
import Jade-Icons as icons
from JAK.Utils import bindings
if bindings() == "PyQt5":
    from PyQt5.QtCore import pyqtSlot as Slot

class Get:
    def __init__(self):
        self.menu_path = "/etc/xdg/menus/jade-applications.menu"

    def build(self, menu=None, iteration=0, category=None, output={}):
        it = menu.iter()
        it_type = it
        while it_type != GMenu.TreeItemType.INVALID:
            if it_type == GMenu.TreeItemType.DIRECTORY:

                item = it.get_directory()
                icon = icons.get(item.get_icon().get_names()[0])
                comment = item.get_comment()
                category = item.get_name()
                #dump(categorie, iteration)
                output[f'{category}'] = {}
                output[f'{category}']['icon'] = icon
                output[f'{category}']['description'] = comment
                output[f'{category}']['apps'] = []
                self.build(item, iteration + 1, category, output)

            elif it_type == GMenu.TreeItemType.ENTRY:

                item         = it.get_entry()
                app          = item.get_app_info()
                name         = app.get_display_name()
                generic      = app.get_generic_name()
                description  = app.get_description()
                icon         = app.get_icon()
                keywords     = " ".join(app.get_keywords())
                path         = item.get_desktop_file_path()

                if isinstance(icon, Gio.ThemedIcon):
                    icon = icon.get_names()[0]
                elif isinstance(icon, Gio.FileIcon):
                    icon = icon.get_file().get_path()

                icon = icons.get(icon)
                #dump(name, iteration+1)

                if not generic:
                    generic = "Generic name not available"

                if not description:
                    description = "Description not available"

                output[f'{category}']['apps'].append({
                    'category': f'{category}',
                    'name': f'{name}',
                    'generic': f'{generic}',
                    'description': f'{description}',
                    'icon': f'{icon}',
                    'keywords': f'{keywords}',
                    'path': f'{path}'
                    })

            it_type = it.next()

        return output

    @Slot()
    def items(self):
        tree = GMenu.Tree.new_for_path(self.menu_path, 0)
        tree.load_sync()
        directory = tree.get_root_directory()
        menu = self.build(directory)
        return menu
