import os, gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk
from functools import lru_cache as cache
from j.AK import settings


@cache(maxsize=None)
def get(icon):
    """
    :param icon:
    :return: icon name and path
    """
    icon_not_found = settings("window", "icon")
    icon_theme = Gtk.IconTheme.get_default()
    if icon is None:
      return icon_not_found

    if icon.endswith((".png", ".svg")):

        if icon.startswith("/"):
            return icon  # if image has full icon path we just return them.

        # if image has icon name and extension, but no path, lets fix that.
        else:
            if icon.endswith(".png"):
                icon = icon.replace('.png', '')

            elif icon.endswith(".svg"):
                icon = icon.replace('.svg', '')

    # xpm not supported by webkit don't load.
    elif icon.endswith(".xpm"):
        icon = icon_not_found
        print(f"{icon} xpm icons not supported")

    if not icon_theme.has_icon(icon):
        # check if it has the icon in pixmaps directory and return it.
        pixmaps = f"/usr/share/pixmaps/{icon}"
        if os.path.isfile(f"{pixmaps}.png"):
            return f"{pixmaps}.png"

        elif os.path.isfile(f"{pixmaps}.svg"):
            return f"{pixmaps}.svg"
        else:
            print(f"{icon} Not found in this theme")
            icon = icon_not_found
            
    # TODO add support for icon size detection
    icon_theme = icon_theme.lookup_icon(icon, 68, 0)
    if icon_theme is None:
      return icon_not_found

    return  icon_theme.get_filename()


