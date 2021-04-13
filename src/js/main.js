Jade.Desktop = class API {

    constructor() {
        this.visible = true
        this.searchActive = false
    }

    elem(element) {
        return document.querySelector(element)
    }

    elems(elements) {
        return document.querySelectorAll(elements)
    }

    toggleLauncher() {
        let appView = this.appView()
        let classes = appView.classList
        if (classes.contains("show")) {
            this.closeApplications()
        } else {
            this.openApplications()
            JAK.Bridge.setPanelVisible(true)
        }
        this.toggleDesktop()
    }

    buildHTML(el, name, icon, description, keywords, file) {
        el.insertAdjacentHTML('beforeend', appTemplate(name, icon, description, keywords, file))
    }

    toggleDesktop() {
        JAK.Bridge.toggleDesktop()
    }

    hideInspector() {
        JAK.Bridge.hideInspector();
    }

    about() {
        return M.Modal.getInstance(this.elem('#about'))
    }

    appView() {
        return this.elem('.applications-wrapper')
    }

    playVideo(src) {
        let video = desktop.elem('#video-background')
        video.src = src
    }

    showApplications() {
        let apps = desktop.elem("#apps-container")
        let classes = apps.classList
        desktop.elem("#settingsPanel").classList.remove("show")
        classes.remove("shift")
    }

    showSettings() {
        this.closeWidgets()
        let settings = desktop.elem("#settingsPanel")
        let classes = settings.classList
        classes.add("show")
        desktop.elem("#apps-container").classList.add("shift")
        if (jde.searchSettings == null) {
            jde.searchSettings = ""
        } 
    }

    closeApplications() {
        this.openWidgets()
        let self = this
        this.appView().classList.remove("opacity")
        JAK.Bridge.setPanelVisible(false)
        setTimeout(function () {
            self.appView().classList.remove("show")
        }, 300);
    }

    get_categories() {
        let items = []
        for (let category in Jade.menu) {
            items.push(category)
        }
        return items
    }

    get_search_items() {
        JAK.Bridge.updateMenu()
        let items = []
        let categories = this.get_categories()
        for (let category of categories) {
            let apps = Jade.menu[`${category}`].apps
            for (let app of apps) {
                items.push(app)
            }
        }
        return items
    }

    openApplications() {
        if (Jade.settings.tourDone == true) {
            this.closeWidgets()
            if (jde.searchApplications == null) {
                jde.searchApplications = ""
            }
            this.appView().classList.add("show", "opacity");
        }
    }

    closeWidgets() {
        desktop.elem("#floating-items").style.opacity = 0
    }

    openWidgets() {
        desktop.elem("#floating-items").style.opacity = 1
    }

    empty(el) {
        el.innerHTML = ""
    }
}

function appDrag(ev) {
    el = ev.target
    img = el.querySelector("img")
    if (el.href.includes("ipc:")) {
        ev.dataTransfer.setDragImage(img, 10, 10)
        ev.dataTransfer.setData("url", ev.target.href.replace("ipc:", "file://"))
    } else {
        ev.dataTransfer.setDragImage(img, 25, 25)
    }
}

function appTemplate(name, icon, description, keywords, file) {
    let template = `
  <div class="grid-item">
    <div class="app">
      <div class="icons-container">
          <a href="${file}" ondragstart="appDrag(event)" class="ipc" onclick="JAK.IPC('${file}');return false;"><img class="app-icon" draggable="false" src="${icon}">
              <div class="app-title">
                ${name}
              </div>
          </a>
      </div>      
      <div class="description">${
        description.toLowerCase()
    }</div>
      <span style="display:none;">${keywords}</span>
    </div>
  `
    return template
}

function init() {
    desktop = new Jade.Desktop();
    let about = JSON.parse(JAK.Bridge.about)
    let icons = JSON.parse(JAK.Bridge.icons)

    setInterval(showTime, 1000)
    function showTime() {
        let time = new Date()
        let hour = time.getHours()
        let min = time.getMinutes()       
        hour = hour < 10 ? "0" + hour : hour
        min = min < 10 ? "0" + min : min
        let currentTime = hour + ":" + min
        desktop.elem("#time").innerHTML = currentTime
    }

    showTime()
    Jade.videos = [
        "Beach",
        "Blue Sky",
        "Burning Fire",
        "Foggy Mountain",
        "WaterFall",
        "Sleeping Cat",
        "Yellow Flower",
        "Shark Tank",
        "Sunset",
        "The Web",
        "Ink Mix"
    ]

    jde = new Vue({
        el: '#app',
        data: {
            backgroundBtnIcon: icons["background"],
            appSettingsIcon: icons["app-settings"],
            appMenuIcon: icons["app-menu"],
            categorySettingsIcon: icons["category-settings"],
            arrowUp: "../../images/arrow.svg",
            arrowDown: "../../images/arrow.svg",
            moodBackGroundText: "Mood Background",
            restoreText: "Restore Defaults",
            restoreBtnIcon: icons["restore"],
            devToolsText: "DevTools",
            inspectorText: "Inspector",
            experimentalFeaturesText: "Experimental features",
            searchBtnIcon: icons["search"],
            aboutTitle: about["title"],
            aboutDescription: about["description"],
            urlText: "Project URL and reporting bugs.",
            url: about["url"],
            aboutLicense: "License: " + about["license"],
            aboutAuthor: "Copyright © 2020 " + about["author"],
            warranty: "This software comes with no warranty.",
            categoriesTittle: "Visible Applications",
            categories: Jade.menu,
            videos: Jade.videos,
            "disabledText": "Disabled",
            "tileText": "Auto Tile Windows",
            Appearance: "Appearance",
            Behavior: "Behavior",
            System: "System",
            workspaceText: "WorkSpaces",
            workspaceDescription: "Run applications or script your workspaces, usage: executable or script path.",
            isTyping : false,
            searchApplications: null,
            searchSettings : null


        },

        watch : {
            searchApplications : function (query) {
                    this.matchQuery("#Applications", query)
            },
            searchSettings : function (query) {
                    this.matchQuery(".settings-grid", query)
            }

        }, 

        methods : {
            matchQuery(_type, query) {
                this.isTyping = true
                setTimeout(() => {
                    destination = desktop.elem(`${_type}`)
                    desktop.empty(destination)
                    this.isTyping = false
                    desktop.searchActive = true
                    let apps = desktop.get_search_items()
                    function match(app) {
                        if (
                            app.name.toLowerCase().includes(query.toLowerCase()) |
                            app.description.toLowerCase().includes(query.toLowerCase()) ||
                            app.keywords.toLowerCase().includes(query.toLowerCase())
                            ) {
                                desktop.buildHTML(destination, app.name, app.icon, app.description, app.keywords, app.path)
                            }
                    }
                    if (_type == "#Applications") { 
                        for (app of apps) {
                            if (app.category != "Settings") {
                                if (desktop.elem(`#${app.category.replace(" ", "")}-btn`).checked) {
                                    match(app)
                                }                                
                            }
                        }
                    } else if (_type == ".settings-grid") {
                        for (app of apps) {
                            if (app.category == "Settings") {
                                match(app)
                            }
                        }
                    }
                }, 1000)
            }
        }
    })

    M.Tabs.init(desktop.elems('.tabs'), {swipeable: true});

    function appsScrolllAnimation(direction) {
        let apps = desktop.elem("#Applications")
        interval = undefined
        clearInterval(interval)
        let scroll = 76
        let pixels = 1;
        let timer = 1;
        let speed = 6

        interval = setInterval(function() { 
            if ( direction === "down" ) {
                apps.scrollBy(0, pixels);
            } else if ( direction === "up" ) {
                apps.scrollBy(0, - pixels);   
            }         
            pixels += speed;
            if ( pixels >= scroll ) {
                clearInterval(interval)
            }
        }, timer);
    }

    let arrowDown = desktop.elem(".arrowDown")
    arrowDown.addEventListener("click", () => {
        appsScrolllAnimation("down")
    })
    let arrowUp = desktop.elem(".arrowUp")
    arrowUp.addEventListener("click", () => {
        appsScrolllAnimation("up")
    })

    function _debounce(callback, wait) {
        let timeout;
        return(...args) => {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => callback.apply(context, args), wait);
        };
    }

    desktop.elem("#Applications").getBoundingClientRect()["height"]
    workspace1 = desktop.elem("#workspace1")
    workspace1.value = Jade.settings.workspace1
    workspace1.addEventListener("keyup", _debounce(() => {
        JAK.Bridge.saveSettings("workspace1", workspace1.value)
    }, 500))

    workspace2 = desktop.elem("#workspace2")
    workspace2.value = Jade.settings.workspace2
    workspace2.addEventListener("keyup", _debounce(() => {
        JAK.Bridge.saveSettings("workspace2", workspace2.value)
    }, 500))

    workspace3 = desktop.elem("#workspace3")
    workspace3.value = Jade.settings.workspace3
    workspace3.addEventListener("keyup", _debounce(() => {
        JAK.Bridge.saveSettings("workspace3", workspace3.value)
        console.log('works')
    }, 500))

    workspace4 = desktop.elem("#workspace4")
    workspace4.value = Jade.settings.workspace4
    workspace4.addEventListener("keyup", _debounce(() => {
        JAK.Bridge.saveSettings("workspace4", workspace4.value)
    }, 500))


    for (let [key, value] of Object.entries(Jade.settings)) {
        let button = desktop.elem(`#${key}-btn`)
        if (button != null) {
            button.checked = value
        }
    }

    let categories = desktop.get_categories()
    for (let category of categories) {
        if (category != "Settings") {
            category = category.replace(" ", "")
            let button = desktop.elem(`#${category}-btn`)
            button.addEventListener('click', () => {
                const last_search = jde.searchApplications
                let search = desktop.elem("#app-search input")
                search.style.color = "transparent"
                jde.searchApplications = "reset"
                JAK.Bridge.saveSettings(category, button.checked)
                setTimeout(() => {
                    search.style.color = "white"
                    if (last_search) {
                        jde.searchApplications = last_search
                    } else {
                        jde.searchApplications = ""
                    }
                }, 20)
            })
        }
    }

    let autoTileBtn = desktop.elem("#auto-tile-btn")
    autoTileBtn.checked = Jade.settings.autoTile
    autoTileBtn.addEventListener('click', function () {
        JAK.Bridge.saveSettings("autoTile", autoTileBtn.checked)
    })

    desktop.aboutPanel = M.Modal.init(desktop.elem('.modal'), {
        onOpenEnd: function () {
            if (Jade.settings.tourDone) {
                let about = desktop.elem('.modal-overlay')
                about.onmouseleave = function () {
                    desktop.aboutPanel.close();
                };
            }
        }
    })

    let inspectorBtn = desktop.elem('#inspector-btn')
    inspectorBtn.addEventListener('click', function () {
        if (inspectorBtn.checked) {
            JAK.Bridge.showInspector()
        } else {
            JAK.Bridge.hideInspector()
        }
    })

    desktop.elem('#defaults-btn').addEventListener('click', function () {
        JAK.Bridge.restoreDefaults()
    })

    function toggleVideo(btn, name) {
        if (btn.checked && name != false) {
            desktop.playVideo(`../../mood-backgrounds/${
                name.replace(" ", "-").toLowerCase()
            }.mp4`)
        } else {
            desktop.playVideo("")
        }
    }

    if (Jade.settings.moodBackground) {
        let video = Jade.settings.moodBackground
        let btn = desktop.elem(`#${
            video.replace(" ", "-")
        }-btn`)
        btn.checked = true
        toggleVideo(btn, video)
    }

    let disabledBtn = desktop.elem("#disabled-btn")
    disabledBtn.addEventListener('click', function () {
        toggleVideo(disabledBtn, false)
        JAK.Bridge.saveSettings("moodBackground", "disabled")
    })

    Jade.videos.forEach((video) => {
        let btn = desktop.elem(`#${
            video.replace(" ", "-")
        }-btn`)
        btn.addEventListener('click', function () {
            toggleVideo(btn, video)
            JAK.Bridge.saveSettings("moodBackground", video.replace(" ", "-"))
        })
    })

    let backgroundsBtn = desktop.elem('#video-background-btn')
    backgroundsBtn.addEventListener('click', function () {
        let backgroundsMenu = desktop.elem("#backgrounds-submenu")
        let classes = backgroundsMenu.classList
        if (backgroundsBtn.checked) {
            classes.add("show")
        } else {
            classes.remove("show")
        }
    })

    let categoriesBtn = desktop.elem('.search .categorySettingsIcon')
    categoriesBtn.addEventListener('click', function () {
        let categoriesMenu = desktop.elem("#categories-submenu")
        let classes = categoriesMenu.classList
        if (classes.contains("show")) {
            classes.remove("show")
        } else {
            classes.add("show")
        }
    })
    
    let searchSettingsIcon = desktop.elem('.search .searchSettingsIcon')
    searchSettingsIcon.addEventListener('click', function () {
        desktop.elem("#Settings input").focus()
        jde.searchSettings = ""
    })

    let searchApplicationsIcon = desktop.elem('.search .searchApplicationsIcon')
    searchApplicationsIcon.addEventListener('click', function () {
        desktop.elem("#app-search input").focus()
        jde.searchApplications = ""
    })

    let appMenuBtn = desktop.elem('.search .appMenuIcon')
    appMenuBtn.addEventListener('click', function () {
        desktop.showApplications()
    })

    let appSettingsBtn = desktop.elem('.appSettingsIcon')
    appSettingsBtn.addEventListener('click', function () {
        desktop.showSettings()
    })

    let appView = desktop.elem(".applications-wrapper")
    appView.onmouseleave = function () {
        desktop.closeApplications()
    }
}
function startTour() {
    desktop.aboutPanel.open()  
    let intro = introJs()
    intro.onexit(function() {
      desktop.toggleDesktop()
    })
    intro.setOptions({
        showStepNumbers: false,
        hidePrev: true,
        hideNext: true,
        exitOnEsc: false,
        exitOnOverlayClick: false,
        showStepNumbers: false,
        overlayOpacity: 0,
        disableInteraction: true,
        steps: [
            {
                element: '.tour-step1',
                intro: "Hi, lets get you more familiar with your desktop, wallpapers won't work in a VM, due to saving space on the live image no applications are installed, after instalation a wizard will finish the process.",
                position: 'bottom'
            },
            {
                element: '.tour-step1',
                intro: "The dock is hidden in the bottom center, you can switch between apps or add more, CTRL + right mouse Key opens dock options.",
                position: 'top'
            },
            {
                element: '.tour-step2',
                intro: "Sound, wifi, bluetooth and battery widgets live here.",
                position: 'top'
            },
            {
                element: '.tour-step3',
                intro: "Some desktop options are available here and you can script your workspaces, icons can be dragged to the dock.",
                position: 'right'
            }, {
                element: '.tour-step6',
                intro: "All done, now build something cool.",
                position: 'bottom'
            }
        ]
    })
    intro.onchange(function (el) {
        console.log(this._currentStep)
        function change_border_color(color) {
            setTimeout( ()=> {
                desktop.elem(".introjs-helperLayer").style.borderColor = color
            }, 80)
        }
        if (this._currentStep == 0) {
            change_border_color("transparent")
            desktop.aboutPanel.open()
            desktop.closeWidgets()
        } else if (this._currentStep == 1) {
            desktop.aboutPanel.close()
            change_border_color("transparent")
        } else if (this._currentStep == 2) {
            change_border_color("transparent")
            JAK.Bridge.setPanelVisible(false)
        } else if (this._currentStep == 3) {            
            desktop.openApplications()
            desktop.showSettings()
            JAK.Bridge.setPanelVisible(true)
            setTimeout(function () {
                intro.refresh();
            }, 700)
            change_border_color("transparent")
        } else if (this._currentStep == 4) {
            desktop.closeApplications()
            desktop.showApplications()
            JAK.Bridge.setPanelVisible(false)
            Jade.settings.tourDone = "step6"
            Jade.settings.tourDone = true
            JAK.Bridge.saveSettings("tourDone", true)
        }
    })
    intro.start()
}
document.addEventListener('DOMContentLoaded', () => {
    init()
    jde.searchApplications = ""
    jde.searchSettings = ""
    if (Jade.settings.tourDone == false) {
        startTour()
    }
})
