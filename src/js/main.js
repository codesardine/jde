Jade.Desktop = class API {

  constructor() {
    this.visible = true
  }

  setBranch(branch) {
    JAK.Bridge.setBranch(branch)
  }

  elem(element) {
    return document.querySelector(element)
  }

  elems(elements) {
    return document.querySelectorAll(elements)
  }

  toggleSettings() {
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
      let settingsView = desktop.elem("#Settings")
      var destination = settingsView
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
    this.searchBar().classList.remove("show")
    JAK.Bridge.setPanelVisible(false)
  }

  openSearch() {
    this.searchBar().classList.add("show")
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
    let el = this.elem('#Settings')
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
    setTimeout(function(){ 
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

  empty(el) {
    el.innerHTML = ""
  }

  matchQuery(item, searchQuery) {
    return item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.keywords.toLowerCase().includes(searchQuery.toLowerCase())
  }
}

function appDrag(ev) {
  el = ev.target
  img = el.querySelector("img")
  ev.dataTransfer.setDragImage(img, 30, 30)  
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
      <div class="description">${description.toLowerCase()}</div>
      <span style="display:none;">${keywords}</span>
    </div>
  `
  return template
}

function init() {
  desktop = new Jade.Desktop();
  let about = JSON.parse(JAK.Bridge.about)

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
      backgroundBtnIcon: JAK.Bridge.backgroundIcon,
      backgroundBtnText: "Change Wallpaper",
      moodBackGroundText: "Mood Background",
      restoreText: "Restore Defaults",
      restoreBtnIcon: JAK.Bridge.restoreIcon,
      devToolsText: "DevTools",
      inspectorText: "Inspector",
      branchTitle: "Software Branch",
      stable: "Stable",
      testing: "Testing",
      unstable: "Unstable",
      experimentalFeaturesText: "Experimental features",
      searchBtnIcon: JAK.Bridge.searchIcon,
      aboutTitle: about["title"],
      aboutDescription: about["description"],
      urlText: "Project URL and reporting bugs.",
      url: about["url"],
      aboutLicense: "License: " + about["license"],
      aboutAuthor: "Copyright © 2020 " + about["author"],
      aboutBtnIcon: JAK.Bridge.infoIcon,
      warranty: "This software comes with no warranty.",
      categoriesTittle: "Visible Applications",
      searchQuery: '',
      categories: Jade.menu,
      activeAppText: "Press enter to run ",
      videos: Jade.videos,
      "disabledText": "Disabled",
      "tileText": "Auto Tiling",
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

function debounce(callback, wait) {
  let timeout;
  return (...args) => {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => callback.apply(context, args), wait);
  };
}

let search = desktop.searchBar()
search.addEventListener("keyup", (e) => {
  if(e.key === "Escape") {
    desktop.closeSearch()
}})

workspace1 = desktop.elem("#workspace1")
workspace1.value = Jade.settings.workspace1
workspace1.addEventListener("keyup", debounce(() => {
    JAK.Bridge.saveSettings("workspace1", workspace1.value)
    console.log('works')
  }, 500))

  workspace2 = desktop.elem("#workspace2")
  workspace2.value = Jade.settings.workspace2
  workspace2.addEventListener("keyup", debounce(() => {
      JAK.Bridge.saveSettings("workspace2", workspace2.value)
      console.log('works')
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
    console.log('works')
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

  let aboutPanel = M.Modal.init(desktop.elem('.modal'), { onOpenEnd: function() {
    let about = desktop.elem('.modal-overlay')
    about.onmouseleave = function() {
      aboutPanel.close();
    };
  }});
  desktop.elem(`#${JAK.Bridge.getBranch}-btn`).checked = true

  M.Sidenav.init(desktop.elems('.sidenav'), {
    menuWidth: 300,
    edge: 'left',
    draggable: true
  })

  M.Tabs.init(desktop.elems('.tabs'), { swipeable: true });

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
      desktop.playVideo(`../../mood-backgrounds/${name.replace(" ", "-").toLowerCase()}.mp4`)
    } else {
      desktop.playVideo("")
    }
  }

  if (Jade.settings.moodBackground) {
    let video = Jade.settings.moodBackground
    let btn = desktop.elem(`#${video.replace(" ", "-")}-btn`)
    btn.checked = true
    toggleVideo(btn, video)
  }

  let disabledBtn = desktop.elem("#disabled-btn")
  disabledBtn.addEventListener('click', function () {
    toggleVideo(disabledBtn, false)
    JAK.Bridge.saveSettings("moodBackground", "disabled")
  })

  Jade.videos.forEach((video) => {
    let btn = desktop.elem(`#${video.replace(" ", "-")}-btn`)
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

document.addEventListener('DOMContentLoaded', (event) => {
  init()
})