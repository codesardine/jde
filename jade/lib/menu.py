import gi

gi.require_version('GMenu', '3.0')
from gi.repository import GMenu, Gio
from lib import icons, views
from j.AK import Api
from functools import lru_cache as cache


def dump(name, iteration):
    print('%s%s' % ('- ' * iteration, name))


class Get:

    def __init__(self):

        self.menu_path = "/etc/xdg/menus/jade-applications.menu"
        self.tree = GMenu.Tree.new_for_path(self.menu_path, 0)
        self.tree.connect('changed', self.menu_changed)
        self.load()
        self.menu = self.tree.get_root_directory()
        self.build(self.menu)

    @cache(maxsize=None)
    def build(self, menu, iteration=0):

        it = menu.iter()
        it_type = it
        while it_type != GMenu.TreeItemType.INVALID:

            if it_type == GMenu.TreeItemType.DIRECTORY:
                item = it.get_directory()

                # don't pep8 this block
                icon_name = item.get_icon().get_names()[0]
                icon = icons.get(icon_name)
                comment = item.get_comment()
                name = item.get_name()
                element_name = name.replace(" ", "-")

                # dump(name, iteration)
                Api.html += views.Html.get_categorie(comment, name, icon, element_name)

                # TODO this block needs a clean up.
                tag = "li"
                action = "onmouseover"
                if name == "Settings" or name == "System" or name == "Help":
                    tag = "div"
                    action = "onclick"

                Api.html = f"{Api.html}<{tag} class='application-category {element_name}'>" \
                           f"<a href='#' {action}=\"display('#{element_name}, " \
                           f"#{element_name}-msg');\">{name}</a></{tag}>"
                self.build(item, iteration + 1)

            elif it_type == GMenu.TreeItemType.ENTRY:
                item = it.get_entry()
                app = item.get_app_info()

                # don't pep8 this block
                name         = app.get_display_name()
                generic_name = app.get_generic_name()
                description  = app.get_description()
                icon         = app.get_icon()
                keywords     = app.get_keywords()
                keywords     = " ".join(keywords)
                desktop      = item.get_desktop_file_path()

                if isinstance(icon, Gio.ThemedIcon):
                    icon = icon.get_names()[0]
                elif isinstance(icon, Gio.FileIcon):
                    icon = icon.get_file().get_path()

                icon = icons.get(icon)
                # dump(application_name, iteration+1)

                if not generic_name:
                    generic_name = "Generic name not available"

                if not description:
                    description = "Description not available"

                Api.html += views.Html.get_app(name, generic_name, description, desktop, icon, keywords)

            it_type = it.next()

        Api.html += "</div></div>"

    @cache(maxsize=None)
    def load(self):
        self.tree.load_sync()

    def menu_changed(self, *a):
        self.load()
    # self.build(self.menu)
