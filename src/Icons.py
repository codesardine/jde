import os, gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk
from functools import lru_cache as cache


def not_found(icon):
    print(f"Icon not found:{icon}")
    return "image-missing"

@cache(maxsize=None)
def get(icon: str) -> str:
    """
    :param icon:
    :return: icon name and path
    """
    if icon is None:
        icon = not_found(icon)

    EXTENSIONS = (".png", ".svg")
    if icon.endswith(EXTENSIONS):
        # if image has full icon path return icon.
        if icon.startswith("/"):
            return icon  
        # if image has icon name and extension, but no path.
        else:
            for ext in EXTENSIONS:
                if icon.endswith(ext):
                    icon = icon.replace(ext, '')
                
    icon_theme = Gtk.IconTheme.get_default()
    if not icon_theme.has_icon(icon):
        # check for icon in pixmaps directory.
        pixmaps = f"/usr/share/pixmaps/{icon}"
        for ext in EXTENSIONS:
            if os.path.isfile(f"{pixmaps}{ext}"):
                return f"{pixmaps}{ext}"
                        
    SIZES = (64, 48, 32, 24)
    for size in SIZES:
        icon_name = icon_theme.lookup_icon(icon, size, 0)
        if icon_name:
            return icon_name.get_filename()
        
    icon = not_found(icon)
    return icon
