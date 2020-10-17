import pathlib
import subprocess
import os
import json
import Jade.Menu
import time
import gi
import dbus
gi.require_version('Wnck', '3.0')
from gi.repository import Wnck
from Jade.Settings import Options
from JAK.Utils import JavaScript, Instance
from JAK.Utils import getScreenGeometry


def run(command, shell=False):
    proc = subprocess.Popen(command, shell=shell, stdout=subprocess.PIPE)
    return proc


class Session():
    def __init__(self):
        self.desktop_session = os.environ.get('DESKTOP_SESSION')

    @staticmethod
    def logOut():
        run('loginctl terminate-session $XDG_SESSION_ID', shell=True)

    @staticmethod
    def powerOff():
        run(['systemctl', 'poweroff'])

    @staticmethod
    def reboot():
        run(['systemctl', 'reboot'])

    @staticmethod
    def hibernate():
        run(['systemctl', ' hibernate'])

    @staticmethod
    def suspend():
        run(['systemctl', 'suspend'])

    @staticmethod
    def sleep():
        run(['systemctl', 'hybrid-sleep'])

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


class Desktop:
    def __init__(self):
        self.minimized_windows = []
        self.next_window_pos = "left"
        self.panel_open = False
        self.get_screen().connect("window-opened", self.window_open_cb)
        self.get_screen().connect('window-closed', self.window_closed_cb)
        self.ignore_windows = ["Guake!"]

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

    def hide_terminal(self):
        bus = dbus.SessionBus()
        service = bus.get_object('org.guake3.RemoteControl', '/org/guake3/RemoteControl')
        interface = dbus.Interface(service, dbus_interface='org.guake3.RemoteControl')
        interface.hide()

    def minimize_windows(self):
        self.hide_terminal()
        monitor = getScreenGeometry()
        windows = self.get_screen().get_windows()
        workspace = self.get_screen().get_active_workspace()
        for window in windows:
            for ignored_window in self.ignore_windows:
                if window.has_name() and window.get_name() != ignored_window:
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
                for ignored_window in self.ignore_windows:
                    if window.has_name() and window.get_name() != ignored_window:
                        half_screen_size = monitor.width() / 2
                        window_x = float(window.get_geometry()[0])
                        window_width = float(window.get_geometry()[2])
                        _type = window.get_window_type()
                        if not window.is_skip_tasklist() and window_x != half_screen_size and window_x != 0.0 \
                                or window_width != half_screen_size and not window.is_maximized() \
                                and not window.is_minimized() and not window.is_fullscreen() \
                                and _type == Wnck.WindowType.NORMAL:
                            gravity = Wnck.WindowGravity.STATIC
                            dock_size = 50
                            if self.next_window_pos == "left":
                                self.next_window_pos = "right"
                                x = 0

                            elif self.next_window_pos == "right":
                                self.next_window_pos = "left"
                                x = half_screen_size

                            geometry_mask = Wnck.WindowMoveResizeMask.X | Wnck.WindowMoveResizeMask.Y | \
                                            Wnck.WindowMoveResizeMask.WIDTH | Wnck.WindowMoveResizeMask.HEIGHT

                            window.set_geometry(gravity, geometry_mask, x, 0, half_screen_size, monitor.height()
                                                - dock_size)

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

    def window_closed_cb(self, screen, closed_window):
        for w in self.minimized_windows:
            if w is closed_window:
                self.minimized_windows.remove(closed_window)

    def clearWindows(self):
        self.minimized_windows.clear()

    @staticmethod
    def getPath():
        return str(pathlib.Path(__file__).parent.parent.absolute())

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
        menu = Jade.Menu.Get().items()
        settings = Desktop.loadSettings()
        return f"const Jade = {{}};Jade.menu = {json.dumps(menu)};Jade.settings = {json.dumps(settings)}"

    @staticmethod
    def updateMenu():
        menu = Jade.Menu.Get().items()
        JavaScript.send(f"Jade.menu = {json.dumps(menu)}")

    @staticmethod
    def toggleSettings():
        JavaScript.send("desktop.toggleSettings();")

    @staticmethod
    def toggleLauncher():
        JavaScript.send("desktop.toggleLauncher();")

    @staticmethod
    def setBranch(branch):
        p = run(['pkexec', 'pacman-mirrors', '--api', '--set-branch', f'{branch}'])
        while p.poll() is None:
            print("")
        from JAK.Widgets import InfoDialog
        window = Instance.retrieve("win")
        branch = Desktop.getBranch()        
        if p.returncode == 0:
            msg = f"You are now set on {branch.capitalize()}, Please sync your new mirrors."
            InfoDialog(window, "Software Branch", msg)
        else:
             JavaScript.send(f"""
             desktop.elem(`#{branch}-btn`).checked = true
             """)

    @staticmethod
    def getBranch():
        p = run('cat /etc/pacman-mirrors.conf | grep "Branch ="', shell=True)
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
        run(f"cp -r /etc/skel {home}", shell=True)
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
