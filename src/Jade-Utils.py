import pathlib
import subprocess
import pwd
import os
import json
import Jade-Menu
import time
import gi
gi.require_version('Wnck', '3.0')
from gi.repository import Wnck
from gi.repository import GObject
from Jade-Settings import Options
from JAK.Utils import JavaScript, Instance
from JAK.Utils import getScreenGeometry


def run(command):
    proc = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE)
    return proc


class Session():
    def __init__(self):
        self.desktop_session = os.environ.get('DESKTOP_SESSION')

    @staticmethod
    def logOut():
        run('loginctl terminate-session $XDG_SESSION_ID')

    @staticmethod
    def powerOff():
        run('systemctl poweroff')

    @staticmethod
    def reboot():
        run('systemctl reboot')

    @staticmethod
    def hibernate():
        run('systemctl hibernate')

    @staticmethod
    def suspend():
        run('systemctl suspend')

    @staticmethod
    def sleep():
        run('systemctl hybrid-sleep')

    def get_desktop_session(self):
        return self.desktop_session

    @staticmethod
    def userCSS():
        user_folder = Desktop.getHome()
        path = f"{user_folder}/.config/jade/theme/style.css"
        if os.path.exists(path):
            try:
                with open(path, "r", encoding='utf-8') as file:
                    return file.read()
            except Exception as err:
                print(err)


class Desktop():
    def __init__(self):
        self.minimized_windows = []
        self.next_window_pos = "left"
        self.panel_open = False
        self.get_screen().connect("window-opened", self.window_open_cb)

    def toggle(self):
        # wnck only works on xorg
        if not self.minimized_windows:
            self.minimize_windows()
            win = Instance.retrieve("win")
            win.activateWindow()

        elif self.minimized_windows and not self.panel_open:
            for window in self.minimized_windows:
                if window and window.is_minimized():
                    window.unminimize(int(time.time()))
            self.clearWindows()

    def get_screen(self):
        return Wnck.Screen.get_default()

    def minimize_windows(self):
        monitor = getScreenGeometry()
        windows = self.get_screen().get_windows()
        workspace = self.get_screen().get_active_workspace()
        for window in windows:
            if window.has_name() and window.get_name() != "Guake!":
                window_position = window.get_geometry()
                if window.is_in_viewport(workspace) and not window.is_minimized():
                    _type = window.get_window_type()
                    # remove dock windows and select only windows on primary screen
                    if _type == Wnck.WindowType.NORMAL and monitor.width() > window_position[0]:
                        self.minimized_windows.append(window)
                        window.minimize()

    def autoTile(self):
        settings = Desktop.loadSettings()
        if settings["autoTile"]:
            monitor = getScreenGeometry()
            windows = self.get_screen().get_windows()
            for window in windows:
                half_screen = monitor.width() / 2
                window_x = window.get_geometry()[0]
                if window_x != half_screen or window_x != 0:
                    if not window.is_maximized() and not window.is_minimized():
                        _type = window.get_window_type()
                        if _type == Wnck.WindowType.NORMAL:
                            gravity = Wnck.WindowGravity.STATIC
                            dock_size = 50
                            if self.next_window_pos == "left":
                                self.next_window_pos = "right"
                                x = 0

                            elif self.next_window_pos == "right":
                                self.next_window_pos = "left"
                                x = half_screen

                            geometry_mask = Wnck.WindowMoveResizeMask.X | Wnck.WindowMoveResizeMask.Y | Wnck.WindowMoveResizeMask.WIDTH | Wnck.WindowMoveResizeMask.HEIGHT
                            window.set_geometry(gravity, geometry_mask, x, 0, half_screen, monitor.height() - dock_size)

    def setPanelVisible(self, value):
        self.panel_open = value

    def window_open_cb(self, screen, window):
        _type = window.get_window_type()
        if _type == Wnck.WindowType.DESKTOP:
            pass
        elif _type == Wnck.WindowType.NORMAL:
            monitor = getScreenGeometry()
            self.clearWindows()
            self.autoTile()

    def clearWindows(self):
        self.minimized_windows.clear()

    @staticmethod
    def getPath():
        return str(pathlib.Path(__file__).parent.absolute())

    @staticmethod
    def getHome():
        return str(pathlib.Path.home())

    @staticmethod
    def toggleSearch():
        JavaScript.send("desktop.toggleSearch();")

    @staticmethod
    def about():
        items = json.dumps({
            "author": "Vitor Lopes",
            "title": "Just Another Desktop Enviroment",
            "description": "Built with Web Technologies",
            "url": "https://github.com/codesardine/Jadesktop/",
            "license": "GPL"
        })
        return items

    @staticmethod
    def screenToggle():
        desktop = Instance.retrieve("desktop")
        desktop.setPanelVisible(False)
        desktop.toggle()

    @staticmethod
    def setBackground():
        from JAK.Widgets import FileChooserDialog
        window = Instance.retrieve("win")
        image = FileChooserDialog(
            parent=window, file_type="*.jpeg, *.jpg", title="Chose a image").choose_file()
        if image and os.path.isfile(image):
            window = Instance.retrieve("win")
            window.setBackgroundImage(image)
            Desktop.saveSettings("background", image)

    @staticmethod
    def getBackground():
        try:
            background = Desktop.loadSettings()["background"]
        except Exception:
            background = f"{Desktop.getPath()}/themes/default/backgrounds/background.jpg"
        return background


    @staticmethod
    def getJS():
        menu = Jade-Menu.Get().items()
        settings = Desktop.loadSettings()
        return f"const Jade = {{}};Jade.menu = { json.dumps( menu ) };Jade.settings = { json.dumps( settings ) }"

    @staticmethod
    def updateMenu():
        menu = Jade-Menu.Get().items()
        JavaScript.send(f"Jade.menu = { json.dumps( menu ) }")

    @staticmethod
    def toggleSettings():
        JavaScript.send("desktop.toggleSettings();")

    @staticmethod
    def toggleLauncher():
        JavaScript.send("desktop.toggleLauncher();")

    @staticmethod
    def setBranch(branch):
        p = run(f'pkexec pacman-mirrors --api --set-branch {branch}')
        result = p.stdout.readline().decode("utf-8")
        from JAK.Widgets import InfoDialog
        window = Instance.retrieve("win")
        msg = f"You are now set on {Desktop.getBranch().capitalize()}, Please sync your new mirrors."
        InfoDialog(window, "Software Branch", msg)

    @staticmethod
    def getBranch():
        p = run('cat /etc/pacman-mirrors.conf | grep "Branch ="')
        output = p.stdout.readline().decode(
            "utf-8").replace("Branch = ", "").replace("#", "").strip()
        return output

    @staticmethod
    def restoreDefaultsDialog():
        from JAK.Widgets import JCancelConfirmDialog
        window = Instance.retrieve("win")
        msg = "Some of your manual configuration under your HOME folder will be lost, Would you like to proceed?"
        JCancelConfirmDialog(window, "Restore Defaults",
                             msg, Desktop.restoreDefaults)

    @staticmethod
    def restoreDefaults():
        home = os.path.expanduser("~")
        # TODO backup old files
        run(f"cp -r /etc/skel {home}")
        from JAK.Widgets import InfoDialog
        window = Instance.retrieve("win")
        msg = "Profile defaults have been set on your home directory."
        InfoDialog(window, "Set Defaults", msg)

    @staticmethod
    def saveSettings(key, value):
        options = Options()
        options.save(key, value)

    @staticmethod
    def loadSettings():
        options = Options()
        return options.load()
