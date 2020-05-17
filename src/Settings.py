import configparser
import os
import pathlib


class Options():
    def __init__(self):
        self.config = configparser.ConfigParser()
        self.config.optionxform = str
        self.settings = f"{str(pathlib.Path.home())}/.config/jade.conf"
        self.config.read(self.settings)

    def save(self, key, value):
        self.config.set('DEFAULT', f'{key}', f'{value}')
        with open(self.settings, 'w') as file:
            self.config.write(file)

    def load(self):
        defaults = {
            "debug": False,
            "moodBackground": False,
            "Accessories": True,
            "Development": False,
            "Education": True,
            "Gaming": False,
            "GoOnline": True,
            "Graphics": False,
            "Help": True,
            "Multimedia": True,
            "Office": True,
            "System": False
        }
        if os.path.exists(self.settings):
            for key, value in self.config.items('DEFAULT'):
                if value == "True" or value == "False":
                    defaults[key] = self.config.getboolean('DEFAULT', key)
                else:
                    defaults[key] = value
        return defaults
