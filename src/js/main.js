Jade.Desktop = class API {

    constructor() {
        this.visible = true
    }

    setBranch(branch) {
        JAK.Bridge.setBranch(branch)
    }

    isCurrentBranchChecked(branch) {
        let t = desktop.elem(`#${branch}-btn`).checked
        console.log(t)
        return t
    }

    elem(element) {
        return document.querySelector(element)
    }

    elems(elements) {
        return document.querySelectorAll(elements)
    }

    toggleSettings() {
        if (Jade.settings.tourDone === true) {
            let settingsSidenav = this.settingsSidenav()
            if (settingsSidenav.isOpen == true) {
                this.closeSettings()
            } else {
                let appView = this.appView()
                let classes = appView.classList
                if (classes.contains("show")) {
                    this.closeApplications()
                }
                this.openSettings()
                JAK.Bridge.setPanelVisible(true)
            }
            this.toggleDesktop()
        }
    }

    toggleSearch() {
        if (this.searchBar().classList.contains("show")) {
            this.closeSearch()
        } else {
            if (this.settingsSidenav().isOpen == true) {
                this.closeSettings()
            }
            let appView = this.appView()
            if (appView.classList.contains("show")) {
                this.closeApplications()
            }
            this.openSearch()
            this.searchBar().querySelector("input").focus()
            JAK.Bridge.setPanelVisible(true)
        }
        this.toggleDesktop()
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

    buildApplications(category) {
        let categoryBtn = desktop.elem("#" + category.replace(/\s/g, "") + "-btn")
        if (category == "Settings") {
            var destination = desktop.elem(".settings-grid")
            build(category)
        } else if (category != "Settings" && categoryBtn.checked) {
            var destination = desktop.elem("#Applications")
            build(category)
        }
        function build(category) {
            JAK.Bridge.updateMenu()
            let menu = Jade.menu[category]
            let apps = menu['apps'];
            for (let app in apps) {
                let name = apps[app].name;
                let icon = apps[app].icon;
                let description = apps[app].description;
                let category = apps[app].category;
                let file = apps[app].path;
                let keywords = apps[app].keywords;
                desktop.buildHTML(destination, name, icon, description, keywords, file)
            }
        }
    }

    buildHTML(el, name, icon, description, keywords, file) {
        el.insertAdjacentHTML('beforeend', appTemplate(name, icon, description, keywords, file))
    }

    closeSearch() {
        if (Jade.settings.tourDone == true || Jade.settings.tourDone == "step7") {
            this.searchBar().classList.remove("show")
            JAK.Bridge.setPanelVisible(false)
        }
    }

    openSearch() {
        if (Jade.settings.tourDone == true || Jade.settings.tourDone == "step6") {
            this.searchBar().classList.add("show")
        }
    }

    toggleDesktop() {
        JAK.Bridge.toggleDesktop()
    }

    hideInspector() {
        JAK.Bridge.hideInspector();
    }

    settingsSidenav() {
        return M.Sidenav.getInstance(this.elem('.sidenav'))
    }

    about() {
        return M.Modal.getInstance(this.elem('#about'))
    }

    searchBar() {
        return this.elem('.search')
    }

    appView() {
        return this.elem('.applications-wrapper')
    }

    playVideo(src) {
        let video = desktop.elem('#video-background')
        video.src = src
    }

    closeSettings() {
        this.settingsSidenav().close();
        JAK.Bridge.setPanelVisible(false)
    }

    openSettings() {
        this.closeSearch()
        let el = this.elem('.settings-grid')
        this.empty(el)
        if (el.innerHTML == "") {
            this.buildApplications('Settings');
        }
        this.settingsSidenav().open();
    }

    closeApplications() {
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
            let applications = this.elem("#Applications")
            this.empty(applications)
            for (let category in Jade.menu) {
                if (category != "Settings") {
                    desktop.buildApplications(category);
                }
            }
            if (applications.innerHTML != "") {
                this.closeSearch()
                desktop.closeSettings()
            }
            let appView = this.appView()
            appView.classList.add("show", "opacity");
        }
    }

    empty(el) {
        el.innerHTML = ""
    }

    matchQuery(item, searchQuery) {
        return item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase()) || item.keywords.toLowerCase().includes(searchQuery.toLowerCase())
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

    Jade.videos = [
        "Beach",
        "Blue Sky",
        "Burning Fire",
        "Foggy Mountain",
        "Lightning",
        "Lake",
        "Yellow Flower",
        "Shark Tank",
        "Aurora Borealis",
        "Ink Splash",
        "Ink Mix"
    ]

    new Vue({
        el: '#app',
        data: {
            backgroundBtnIcon: icons["background"],
            arrowUp: icons["arrow-up"],
            arrowDown: icons["arrow-down"],
            backgroundBtnText: "Change Wallpaper",
            moodBackGroundText: "Mood Background",
            restoreText: "Restore Defaults",
            restoreBtnIcon: icons["restore"],
            devToolsText: "DevTools",
            inspectorText: "Inspector",
            branchTitle: "Software Branch",
            stable: "Stable",
            testing: "Testing",
            unstable: "Unstable",
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
            searchQuery: '',
            categories: Jade.menu,
            activeAppText: "Press enter to run ",
            videos: Jade.videos,
            "disabledText": "Disabled",
            "tileText": "Auto Tile Windows",
            Appearance: "Appearance",
            Behavior: "Behavior",
            System: "System"
        },

        computed: {
            filter() {
                let applications = desktop.get_search_items()
                return applications.filter(item => {
                    return desktop.matchQuery(item, this.searchQuery)
                })
            }
        }
    })

    M.Tabs.init(desktop.elems('.tabs'), {swipeable: true});

    function debounce(callback, wait) {
        let timeout;
        return(...args) => {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => callback.apply(context, args), wait);
        };
    }

    let arrowDown = desktop.elem(".arrowDown")
    arrowDown.addEventListener("click", () => {
        let apps = desktop.elem(".grid")
        let height = apps.getBoundingClientRect()["height"]
        apps.scrollBy(0, height)
    })
    let arrowUp = desktop.elem(".arrowUp")
    arrowUp.addEventListener("click", () => {
        let apps = desktop.elem(".grid")
        let height = apps.getBoundingClientRect()["height"]
        apps.scrollBy(0, -height)
    })

    let search = desktop.searchBar()
    search.addEventListener("keyup", (e) => {
        if (e.key === "Escape") {
            desktop.closeSearch()
        }
    })

    desktop.elem("#Applications").getBoundingClientRect()["height"]
    workspace1 = desktop.elem("#workspace1")
    workspace1.value = Jade.settings.workspace1
    workspace1.addEventListener("keyup", debounce(() => {
        JAK.Bridge.saveSettings("workspace1", workspace1.value)
    }, 500))

    workspace2 = desktop.elem("#workspace2")
    workspace2.value = Jade.settings.workspace2
    workspace2.addEventListener("keyup", debounce(() => {
        JAK.Bridge.saveSettings("workspace2", workspace2.value)
    }, 500))

    workspace3 = desktop.elem("#workspace3")
    workspace3.value = Jade.settings.workspace3
    workspace3.addEventListener("keyup", debounce(() => {
        JAK.Bridge.saveSettings("workspace3", workspace3.value)
        console.log('works')
    }, 500))

    workspace4 = desktop.elem("#workspace4")
    workspace4.value = Jade.settings.workspace4
    workspace4.addEventListener("keyup", debounce(() => {
        JAK.Bridge.saveSettings("workspace4", workspace4.value)
    }, 500))


    for (let [key, value] of Object.entries(Jade.settings)) {
        let button = desktop.elem(`#${key}-btn`)
        if (button != null) {
            button.checked = value
            button.addEventListener('click', function () {
                JAK.Bridge.saveSettings(key, button.checked)
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
                desktop.closeSettings()
                let about = desktop.elem('.modal-overlay')
                about.onmouseleave = function () {
                    desktop.aboutPanel.close();
                };
            }
        }
    })

    desktop.elem(`#${
        JAK.Bridge.getBranch
    }-btn`).checked = true

    M.Sidenav.init(desktop.elems('.sidenav'), {
        menuWidth: 300,
        edge: 'left',
        draggable: true
    })

    desktop.elem(".drag-target").onmouseenter = function () {
        desktop.toggleSettings()
    }

    desktop.elem(".app-view-drag-target").onmouseenter = function () {
        desktop.toggleLauncher()
    }

    desktop.elem('#background-btn').addEventListener('click', function () {
        JAK.Bridge.setBackgroundImage()
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

    desktop.elem('#stable-btn').addEventListener('click', function () {
            desktop.setBranch("stable")
    })

    desktop.elem('#testing-btn').addEventListener('click', function () {
            desktop.setBranch("testing")
    })

    desktop.elem('#unstable-btn').addEventListener('click', function () {
            desktop.setBranch("unstable")
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

    let categoriesBtn = desktop.elem('#categories-btn')
    categoriesBtn.addEventListener('click', function () {
        let categoriesMenu = desktop.elem("#categories-submenu")
        let classes = categoriesMenu.classList
        if (categoriesBtn.checked) {
            classes.add("show")
        } else {
            classes.remove("show")
        }
    })

    let appView = desktop.elem(".applications-wrapper")
    appView.onmouseleave = function () {
        desktop.closeApplications()
    }

    let dashboardSettings = desktop.elem("#settingsPanel")
    dashboardSettings.onmouseleave = function () {
        desktop.closeSettings()
    }
}
function startTour() {
    desktop.aboutPanel.open()
    let el1 = desktop.elem('.grid-item')
    el1.classList.add('tour-step4')
    let el2 = desktop.elem('#Applications')
    el3 = desktop.elem('#Applications .grid-item:nth-child(4)')
    el3.classList.add('tour-step5')
    let el4 = desktop.elem('.applications-wrapper')
    el4.style.transform = "translateX(0)"
    el2.style.margin = '50px 0 0 0'

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
                element: '.tour-step0',
                intro: "Hi welcome, lets do a quick tour to get you more familiar with your new desktop. You can Install/Remove/Update applications using Pamac under the settings menu.",
                position: 'bottom'
            },
            {
                element: '.tour-step1',
                intro: "You will find all important shortcuts here. You can change Workspace, access your Applications, Settings, Search and open Windows. Click CTRL + Right mouse Key to open dock options.",
                position: 'top'
            },
            {
                element: '.tour-step2',
                intro: "This is your notifications area, information about Updates, Wifi network connections and Exit menu. You can configure it under settings Panel Manager.",
                position: 'top'
            },
            {
                element: '.tour-step3',
                intro: "Here you can configure Desktop behaviour, appearance and auto start your favorite applications per workspace.",
                position: 'right'
            }, {
                element: '.tour-step4',
                intro: "Any installed dedicated settings applications are accessible here. You can Drag and Drop the icons to your dock bellow.",
                position: 'right'
            }, {
                element: '.tour-step5',
                intro: "Applications can be dragged to the dock bellow.",
                position: 'bottom'
            }, {
                element: '.tour-step6',
                intro: "Search items appear under the search bar, they can be launched using the mouse or keyboard, they can also be dragged to the dock.",
                position: 'bottom'
            }, {
                element: '.tour-step7',
                intro: "This tour is finished. Thanks for watching.",
                position: 'bottom'
            }
        ]
    })
    intro.onchange(function (el) {
        if (this._currentStep == 0) {
            console.log("intro started")
            desktop.aboutPanel.open()
        } else if (this._currentStep == 1) {
            desktop.aboutPanel.close()
        } else if (this._currentStep == 2) {
            desktop.elem("#settingsPanel").style.opacity = 0
            desktop.elem("#settingsPanel").style.transform = "translateX(0)"
        } else if (this._currentStep == 3) {
            desktop.elem("#settingsPanel").style.opacity = 1
            desktop.buildApplications('Settings')
        } else if (this._currentStep == 4) {
            desktop.elem("#Applications .grid-item").classList.add("tour-step5")
        } else if (this._currentStep == 5) {
            desktop.elem("#settingsPanel").style.transform = "translateX(-105%)"
            el4.style.opacity = 0
        } else if (this._currentStep == 6) {
            Jade.settings.tourDone = "step6"
            el4.style.transform = "translateX(-200%)"
            el2.setAttribute('style', '')
            el4.setAttribute('style', '')
            desktop.openSearch()
        } else if (this._currentStep == 7) {
            Jade.settings.tourDone = "step7"
            desktop.closeSearch()
            Jade.settings.tourDone = true
            JAK.Bridge.saveSettings("tourDone", true)
        }
    })
    intro.start()
}
document.addEventListener('DOMContentLoaded', () => {
    init()
    for (let category in Jade.menu) {
        desktop.buildApplications(category);
    }
    if (Jade.settings.tourDone == false) {
        startTour()
    }
})
