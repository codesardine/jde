import configparser
import os
import pathlib
from Jade import Utils


class Options():
    def __init__(self):
        self.config = configparser.ConfigParser()
        self.config.optionxform = str
        self.config_file = f"{str(pathlib.Path.home())}/.config/jde/desktop.conf"
        self.config.read(self.config_file)

    def save(self, key, value):
        self.config.set('DEFAULT', f'{key}', f'{value}')
        with open(self.config_file, 'w') as f:
            self.config.write(f)

    def load(self):
        defaults = {
            "debug": False,
            "autoTile": False,
            "moodBackground": "disabled",
            "Accessories": True,
            "Development": True,
            "Education": True,
            "Gaming": True,
            "GoOnline": True,
            "Graphics": True,
            "Help": True,
            "Multimedia": True,
            "Office": True,
            "System": True,
            "workspace1": "",
            "workspace2": "",
            "workspace3": "",
            "workspace4": "",
            "tourDone": False
        }
        if os.path.exists(self.config_file):
            for key, value in self.config.items('DEFAULT'):
                if value == "true" or value == "false":
                    defaults[key] = self.config.getboolean('DEFAULT', key)
                else:
                    defaults[key] = value
        return defaults
