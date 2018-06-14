import os
import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk
from functools import lru_cache as cache

@cache(maxsize=None)
def get(icon_name):
    """

    :param icon_name:
    :return: icon name and path
    """
    icon_not_found = "image-missing"
    icon_theme = Gtk.IconTheme.get_default()


    if icon_name.endswith((".png", ".svg")):

        if  icon_name.startswith("/"):
            return icon_name  # if image has full icon path we just return them.

        # if image has icon name and extension, but no path, lets fix that.
        else:
            if icon_name.endswith(".png"):
                icon_name = icon_name.replace('.png', '')

            elif icon_name.endswith(".svg"):
            	icon_name = icon_name.replace('.svg', '')

    # xpm not supported by webkit don't load.
    elif icon_name.endswith(".xpm"):
        icon_name = icon_not_found
        print(icon_name + " xpm icons not supported")

    check_icon = icon_theme.has_icon(icon_name)

    if not check_icon:
        # check if it has the icon in pixmaps directory and return it.
        pixmaps = "/usr/share/pixmaps/" + icon_name
        if os.path.isfile(pixmaps + ".png"):
            return pixmaps + ".png"

        elif os.path.isfile(pixmaps + ".svg"):
            return pixmaps + ".svg"

        else:
            print("Icon Not found in this theme --> " + icon_name)
            icon_name = icon_not_found

    # TODO add support for icon size detection
    icon_theme = icon_theme.lookup_icon(icon_name, 64, 0)
    icon_path = icon_theme.get_filename()

    return icon_path

