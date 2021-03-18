import dbus
import dbus.service as service
from JAK.Utils import JavaScript, Instance
from Jade.Utils import Session, Desktop 

class Service(dbus.service.Object):

    def __init__(self):
        bus_name = service.BusName("org.jade.Desktop", dbus.SessionBus())
        service.Object.__init__(self, bus_name, "/org/jade/Desktop")

    @dbus.service.method("org.jade.Desktop", in_signature='', out_signature='')
    def toggleLauncher(self):
        Desktop.toggleLauncher()

    @dbus.service.method("org.jade.Desktop", in_signature='', out_signature='')
    def toggleSettings(self):
        Desktop.toggleSettings()

    @dbus.service.method("org.jade.Desktop", in_signature='', out_signature='')
    def screenToggle(self):
        Desktop.screenToggle()
