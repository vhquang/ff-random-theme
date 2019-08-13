
// browser.windows.onCreated.addListener(themeWindow);

// Theme all currently open windows
// browser.windows.getAll().then(wins => wins.forEach(themeWindow));

var themes_collector = {};


function themeExtractor(theme) {
  var res = {};
  themeProps = [
    'colors',
    // 'images',
    'properties'
  ];
  for (const key of themeProps) {
    if (theme[key] == null) continue;
    var prop = {};
    for (const k of Object.keys(theme[key])) {
      if (theme[key][k] != null) {
        prop[k] = theme[key][k];
      }
    }
    res[key] = prop;
  }
  // console.log(res);
  return res;
}

browser.management.getAll().then(extensions => {
  var themes = extensions.filter(ext => ext.type === 'theme');
  // console.log(themes);
  var t = themes[2];
  console.log(t.name);
  browser.management.setEnabled(t.id, true)
  .then( () => browser.theme.getCurrent() )
  .then( (curTheme) => {
    console.log(curTheme);
    var theme = themeExtractor(curTheme);
    console.log(theme);
    return browser.theme.update(theme);
  });
});

const themes = [
    {
      colors: {
        frame: '#CF723F',
        tab_background_text: '#111',
      },
      images: {
        theme_frame: "moz-extension://c8dd224b-a585-4561-9e79-a442429b558b/aurora-persona-header.jpg"
      }
    },
    {
      colors: {
        frame: '#000',
        tab_background_text: '#fff',
      }
    },
    {
      colors: {
        accentcolor: "black",
        textcolor: "white",
        toolbar: "#333",
        toolbar_text: "white"
      }
  }
];

function themeWindow(window) {
  // Check if the window is in private browsing
  //   if (window.incognito) {
    //     browser.theme.update(window.id, {
//       images: {
  //         headerURL: "",
  //       },
      //   colors: {
      //       accentcolor: "black",
      //       textcolor: "white",
      //       toolbar: "#333",
      //       toolbar_text: "white"
      //     }
      //   });
      // }
    //   // Reset to the default theme otherwise
    //   else {
      //     browser.theme.reset(window.id);
      //   }
  var i = Math.floor(Math.random() * 2);
  console.log(window.id, i);
  browser.theme.update(window.id, themes[i]);
}
