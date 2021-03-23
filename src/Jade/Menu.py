import gi
import json
from functools import lru_cache
gi.require_version('GMenu', '3.0')
from gi.repository import GMenu, Gio
import Jade.Icons as icons


class Get:
    def __init__(self):
        self.menu_path = "/etc/xdg/menus/jde-applications.menu"

    def build(self, menu=None, iteration=0, category=None, output={}):
        it = menu.iter()
        it_type = it
        while it_type is not GMenu.TreeItemType.INVALID:
            if it_type is GMenu.TreeItemType.DIRECTORY:

                item = it.get_directory()
                category = item.get_name()
                #dump(categorie, iteration)
                output[f'{category}'] = {}
                output[f'{category}']['icon'] = icons.get(item.get_icon().get_names()[0])
                output[f'{category}']['description'] = item.get_comment()
                output[f'{category}']['apps'] = []
                self.build(item, iteration + 1, category, output)

            elif it_type is GMenu.TreeItemType.ENTRY:

                item = it.get_entry()
                app = item.get_app_info()
                icon = app.get_icon()
              
                if isinstance(icon, Gio.ThemedIcon):
                    icon = icon.get_names()[0]
                elif isinstance(icon, Gio.FileIcon):
                    icon = icon.get_file().get_path()
                
                #dump(name, iteration+1)
                output[f'{category}']['apps'].append({
                    'category': f'{category}',
                    'name': f'{app.get_display_name()}',
                    'generic': f'{app.get_generic_name()}',
                    'description': f'{app.get_description()}',
                    'icon': f'{icons.get(icon)}',
                    'keywords': f'{" ".join(app.get_keywords())}',
                    'path': f'{item.get_desktop_file_path()}'
                    })

            it_type = it.next()

        return output

    @lru_cache(maxsize=200)
    def items(self):
        tree = GMenu.Tree.new_for_path(self.menu_path, 0)
        tree.load_sync()
        directory = tree.get_root_directory()
        menu = self.build(directory)
        return menu
