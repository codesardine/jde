import pathlib
import subprocess
import os
import json
import Jade.Menu
import time
import gi
import dbus
gi.require_version('Wnck', '3.0')
gi.require_version('Notify', '0.7')
from gi.repository import Wnck, Gio, Notify
from Jade.Settings import Options
from JAK.Utils import JavaScript, Instance
from JAK.Utils import getScreenGeometry
Notify.init("Jade")


def notify(title, msg):
    Notify.Notification.new(title, msg, "dialog-information").show()


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
    def lock():
        run(['light-locker-command', '-l'])

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
        self.get_screen().connect('active-workspace-changed', self.active_workspace_changed_cb)
        self.ignore_windows = (
            "Guake!", "plank", "Steam Login", "Manjaro Hello", "Manjaro Linux Installer"
            )


    def workspace_exec(self, cmd):
        run(f"""
                if pgrep -x '{cmd}' > /dev/null; 
                then echo "Running"; 
                else {cmd};
                fi
                exit 0
                """, shell=True)


    def active_workspace_changed_cb(self, screen, previously_active_space):
        workspace_name = screen.get_active_workspace().get_name()
        workspaces = ["workspace1", "workspace2", "workspace3", "workspace4"]
        for space in workspaces:
            if workspace_name.lower().replace(" ", "") == space:
                config = Desktop.loadSettings()[space].split(" ")
                for cmd in config:
                    print(workspace_name, config, cmd)
                    self.workspace_exec(cmd)


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

    def workspace(self):
        self.get_screen().get_active_workspace()

    def hide_terminal(self):
        bus = dbus.SessionBus()
        service = bus.get_object('org.guake3.RemoteControl', '/org/guake3/RemoteControl')
        interface = dbus.Interface(service, dbus_interface='org.guake3.RemoteControl')
        interface.hide()

    def minimize_windows(self):
        self.hide_terminal()
        monitor = getScreenGeometry()
        windows = self.get_screen().get_windows()
        for window in windows:
            w_name = window.get_name()
            if not w_name.startswith(self.ignore_windows):
                window_position = window.get_geometry()
                if not window.is_minimized():
                    _type = window.get_window_type()
                    if _type != Wnck.WindowType.DESKTOP and monitor.width() > window_position[0]:
                        self.minimized_windows.append(window)
                        window.minimize()

    def autoTile(self):
        settings = Desktop.loadSettings()
        if settings["autoTile"]:
            monitor = getScreenGeometry()
            windows = self.get_screen().get_windows()            
            for window in windows:                                
                w_name = window.get_name()
                print("title:" + w_name)
                if not w_name.startswith(self.ignore_windows):
                    half_screen_size = monitor.width() / 2
                    window_x = float(window.get_geometry()[0])
                    window_width = float(window.get_geometry()[2])
                    _type = window.get_window_type()
                    if not window.is_skip_tasklist() and window_x != half_screen_size or window_x != 0.0 \
                            or window_width != half_screen_size and not window.is_maximized() \
                            and not window.is_minimized() and not window.is_fullscreen() \
                            and _type == Wnck.WindowType.NORMAL:
                        gravity = Wnck.WindowGravity.STATIC
                        dock_size = 48
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

                elif w_name == "Manjaro Linux Installer":
                    window.make_above()
                    window.set_fullscreen(True)
                    window.set_window_type(Wnck.WindowType.SPLASHSCREEN)


    def setPanelVisible(self, value):
        self.panel_open = value

    def window_open_cb(self, screen, window):
        if Desktop.loadSettings()["tourDone"]:
            _type = window.get_window_type()
            if _type == Wnck.WindowType.DESKTOP:
                pass
            elif _type == Wnck.WindowType.NORMAL:
                self.clearWindows()
                self.autoTile()
        else:
            self.autoTile()
            time.sleep(0.50)
            self.minimize_windows()

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
    def setBranch(desired_branch):
        notify(f"Setting branch to {desired_branch.upper()}.", "Might take a while.")

        from JAK.Widgets import InfoDialog
        def update():
            run(["pamac-manager", "--updates"])

        cmd = ['pkexec', 'pacman-mirrors', '--fasttrack', '--api', '--set-branch', f'{desired_branch}']
        def callback(sucprocess: Gio.Subprocess, result: Gio.AsyncResult, data):
            proc.communicate_utf8_finish(result)
            current_branch = Desktop.getBranch()
            if current_branch != desired_branch:
                JavaScript.send(f"""
            desktop.elem(`#{current_branch}-btn`).checked = true
            """)
                notify("Something went wrong", "")
            else:
                from JAK.Widgets import JCancelConfirmDialog
                window = Instance.retrieve("win")
                msg = f"All Done, would you like to update your software and operating system from {current_branch.upper()} branch now?"
                JCancelConfirmDialog(window, " ", msg, update)

        proc = Gio.Subprocess.new(cmd, Gio.SubprocessFlags.STDIN_PIPE | Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE)
        proc.communicate_utf8_async('Shell Command', None, callback, None)            

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
        JCancelConfirmDialog(window, " ",
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
