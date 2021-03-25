import dbus
import dbus.service as service
from JAK.Utils import JavaScript, Instance
from Jade.Utils import Session, Desktop 


def client(busName):
    bus = dbus.SessionBus()
    service = bus.get_object(busName, f"/{busName.replace('.', '/')}")
    return dbus.Interface(service, dbus_interface=busName)
    

class Service(dbus.service.Object):

    def __init__(self):
        bus_name = service.BusName("io.jde.Desktop", dbus.SessionBus())
        service.Object.__init__(self, bus_name, "/io/jde/Desktop")

    @dbus.service.method("io.jde.Desktop", in_signature='', out_signature='')
    def toggleLauncher(self):
        Desktop.toggleLauncher()

    @dbus.service.method("io.jde.Desktop", in_signature='', out_signature='')
    def toggleSettings(self):
        Desktop.toggleSettings()

    @dbus.service.method("io.jde.Desktop", in_signature='', out_signature='')
    def screenToggle(self):
        Desktop.screenToggle()
