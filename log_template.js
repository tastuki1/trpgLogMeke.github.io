function makeLogHtml(tablist, character, backColor, nameColor, logFileName, contentText) {
  let tabtemp = ``
  let chartemp = ``
  let viewcheck = ``
  
  for(tab in tablist){ 
      if(tab.tabname != "メイン" && tab.tabname != "情報"){
      tabtemp = tabtemp + `
  .${tab.tabname} {
  border-left: 3px solid ${tab.color};
  }`
      viewcheck = viewcheck + `
      <label :for= "tab[tabname]">
      <input type="checkbox" :id="tab[tabname]" checked="checked" :onchange="'c_disp(this, '+tab[tabname]+')'"/>tab[tabname]
      </label>
      `
      }
  }
  for(charname in character.keys){
    chartemp = chartemp + `
p.${character.charname} {
color: ${character.color};
}` 
    }
  var style = `  <style>
@import url('https://fonts.googleapis.com/css?family=Noto+Sans+JP');
@import url('https://fonts.googleapis.com/css2?family=New+Tegomin&family=Sawarabi+Mincho&display=swap');
html {
font-size: 16px;
}
body {
background-color: ${backColor};
font-family: 'Hiragino Sans', sans-serif;
}
.header{
background-color: ${backColor};
width:100%;
position: fixed;
z-index: 999;
top:0;
left:0;
height:6rem;
}
h1 {
padding: .5rem .5rem .5rem 3rem;
margin: 0rem;
color: ${nameColor};
font-family: 'New Tegomin', serif;
}
h3 {
margin: .5rem;
}
.viewcheck{
padding-left: 3rem;
color: ${nameColor};
}
.viewcheck label{
display: inline-block;
}
.box5 {
padding: 2rem;
margin: 6.2rem 2rem 2rem;
border: double 5px ${backColor};
background-color: #ffffff;
}
.box5 p {
margin: 0;
padding: .5rem;
text-align: left;
margin-left: .5rem;
}
.tabBox {
position: relative;
margin: .5rem 0 1rem 0;
padding: .5rem 1.5rem 0 1rem;
box-sizing: border-box;
background: #f5f5f5;
}
.tabBox p{
overflow-wrap: break-word;
}
${tabtemp}
.box {
position: relative;
margin: 1.5rem 1rem;
padding: 1rem 1.5rem .5rem 1rem;
border: solid 3px #707070;
border-radius: 8px;
background: #ffffff;
line-height: 1.5;
}
.box .box-title {
position: absolute;
display: inline-block;
top: -0.6rem;
left: .5rem;
padding: 0 .5rem;
line-height: 1;
background: #FFF;
color: #707070;
font-weight: bold;
}
.box p {
margin: 0;
color: #707070;
}
bbbbb {
display: block;
content: "";
margin: 0.8rem;
}
@media screen and (max-width: 480px){
html {
font-size: 14px;
}
h1 {
padding: .5rem .5rem .5rem 2rem;
font-size: 27px;
}
.viewcheck{
padding-left: 2rem;
}
main {
width: 100%;
}
.box5{
padding: 0.8rem;
margin: 6.2rem 1rem 1rem;
}
b{
  display: block;
}
bbbbb {
display: block;
content: "";
margin: 0.6rem;
}

}
/* PCの記載 */
p{
margin-left: .5rem;
}
p.char{
text-indent: -.5rem;
}
${chartemp}
</style>`
var template = `<!DOCTYPE html>
<html lang="ja">
<head>
<title>${logFileName}</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, user-scalable=yes">
<meta http-equiv="X-UA-Compatible" content="ie=edge" />
${style}
</head>
<body>
<div class="header">
<h1><${logFileName}</h1>
<div class="viewcheck">
  ${viewText}
</div>
</div>
<div class="box5">
${contentText}
</div>
</body>
</html>`
  return template
}

export default { makeLogHtml }