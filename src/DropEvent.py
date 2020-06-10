from JAK.Utils import JavaScript

def event(view, event):
    #TODO manage sound and video
    pass
    data = event.mimeData()
    ext = (".mp4", ".ogv", ".webm")
    if str(data.text().endswith(ext)):
        video = str(data.text())
        js = f"desktop.playVideo(`{video}`)"
        JavaScript.send(js)        