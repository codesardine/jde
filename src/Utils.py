import pathlib
import subprocess
import pwd
import os
import json
import Menu
import time
import gi
gi.require_version('Wnck', '3.0')
from gi.repository import Wnck
from gi.repository import GObject
from Settings import Options
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
        self.screen = Wnck.Screen.get_default()
        self.panel_open = False
        self.screen.connect("window-opened", self.window_open_cb)
        
    def toggle(self):
        # wnck only works on xorg
        monitor = getScreenGeometry()        
        self.screen.force_update()
        windows = self.screen.get_windows()
        workspace = self.screen.get_active_workspace()
                
        if not self.minimized_windows:
            win = Instance.retrieve("win")
            win.activateWindow()
            for window in windows:
                window_position = window.get_geometry()
                if window.is_in_viewport(workspace) and not window.is_minimized():
                    _type = window.get_window_type()
                    # remove dock windows and select only windows on primary screen
                    if _type == Wnck.WindowType.NORMAL and monitor.width() > window_position[0]:
                        self.minimized_windows.append(window)
                        window.minimize()                
            
        elif self.minimized_windows and not self.panel_open:
            for window in self.minimized_windows:
                if window.is_minimized():
                    window.unminimize(int(time.time()))
            self.clearWindows()
                  

    def setPanelVisible(self, value):
        self.panel_open = value

    def window_open_cb(self, screen, window):
        _type = window.get_window_type()
        if _type == Wnck.WindowType.DESKTOP:
            pass
        elif _type == Wnck.WindowType.NORMAL:
            self.clearWindows()
            
    def clearWindows(self): 
        #FIXME for some reason we have to clear window list twice
        for window in self.minimized_windows:
            self.minimized_windows.remove(window)

        if self.minimized_windows:
            for window in self.minimized_windows:
                self.minimized_windows.remove(window)
                  
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
        menu = Menu.Get().init()
        settings = Desktop.loadSettings()
        return f"const Jade = {{}};Jade.menu = { json.dumps( menu ) };Jade.settings = { json.dumps( settings ) }"

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
