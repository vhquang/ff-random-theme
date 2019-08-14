
//#region Extract theme info
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

function collectTheme(themes) {
  return new Promise( function(resolve, reject) {

    function collect(todo) {
      if (todo.length === 0) {
        resolve();
        return;
      }

      const item = todo.splice(0, 1)[0];
      browser.management.setEnabled(item.id, true)
      .then( () => browser.theme.getCurrent() )
      .then( (curTheme) => {
        var theme = themeExtractor(curTheme);
        themes_collector[item.id] = theme;
        return new Promise( (_resolve, _reject) => _resolve() );
      })
      .then( () => {
        collect(todo);
      });
    }

    collect(themes.slice());
  });
}


function demoCollect(themes) {
  var t = themes[2];
  browser.management.setEnabled(t.id, true)
  .then( () => browser.theme.getCurrent() )
  .then( (curTheme) => {
    console.log(curTheme);
    var theme = themeExtractor(curTheme);
    console.log(theme);
    // return browser.theme.update(theme);
    themes_collector[t.id] = theme;
  });
}


browser.management.getAll().then(extensions => {
  var themes = extensions.filter(ext => ext.type === 'theme');
  // console.log(themes);
  // demoCollect(themes);
  collectTheme(themes).then( () => console.log(themes_collector) );
});

//#endregion


//#region Extracting image

// var png = "moz-extension://8594443b-581b-418b-8d61-427737be7a20/greyflat-boflash-03.apng";
var png = "moz-extension://6e372956-7103-495f-8a14-87085e675081/Persona_Header_LABS_FINAL.jpg";

var file = new File(['abc'], png);

var reader = new FileReader();

reader.onload = function(aImg) {
  console.log('load image');
  console.log(aImg);
  console.log(aImg.total);
  // return function(e) { aImg.src = e.target.result; };
}

reader.onloadend = function(_status) {
    var content = reader.result;
    console.log('end');
    console.log(content);
    console.log(content.length);
}

// reader.readAsDataURL(file);
// reader.readAsBinaryString(file);



var req = new XMLHttpRequest();
req.onload = function() {
  console.log('xml request');
  console.log(req.response);
};
req.open("GET", png);
// req.send();


//#endregion


//#region Update Theme
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
  //#region ignore
  // Check if the window is in private browsing
  // if (window.incognito) {
  //     browser.theme.update(window.id, {
  //   images: {
  //       headerURL: "",
  //     },
  //     colors: {
  //         accentcolor: "black",
  //         textcolor: "white",
  //         toolbar: "#333",
  //         toolbar_text: "white"
  //       }
  //     });
  //   }
  //   // Reset to the default theme otherwise
  //   else {
  //       browser.theme.reset(window.id);
  //     }
  //#endregion
  const ids = Object.keys(themes_collector);
  const i = Math.floor(Math.random() * ids.length);
  const theme = themes_collector[ids[i]];
  console.log(`window: ${window.id}, theme ${ids[i]}, index ${i}`);
  browser.theme.update(window.id, theme);
}

browser.windows.onCreated.addListener(themeWindow);

// Theme all currently open windows
// browser.windows.getAll().then(wins => wins.forEach(themeWindow));

//#endregion
