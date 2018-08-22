from functools import lru_cache as cache
from j.AK import Api
import subprocess, pwd, os


def run(command):
    subprocess.Popen(command, shell=True)


def get_desktop_env():
    return os.environ.get('DESKTOP_SESSION')


def get_user_name():
    user_name = pwd.getpwuid(os.getuid())[4].replace(",", " ")
    if user_name == "" and os.path.exists("/usr/bin/calamares"):
        user_name = "Manjaro WebDad"    

    return user_name


@cache(maxsize=None)
def get_disk_usage():
    """
    :return: total disk usage in percentage
    """
    contents = []
    disk_usage = os.popen('df --total')  # TODO this works but needs a fix i don't like having to use a list.
    for entry in disk_usage:
        if entry.startswith("total"):
            contents.append(entry)
            percentage = contents[0].split("%")[0].strip().split(" ")[-1].strip() + "%"
            return percentage

            
def autostart():
    if get_desktop_env() == "jade":
        # autostart .desktop files if environment variable is jade 
        command = "sleep 5 && dex -ae JADE"
        run(command)


def get_user_style():
    user_folder = os.path.expanduser("~")
    path = f"{user_folder}/.config/jade/theme/style.css"
    if os.path.exists(path):
        Api.html += f"<script>themeOverride('{path}');</script></body></html>"
        print('User style.css found')

    else:
        Api.html += "</body></html>"


