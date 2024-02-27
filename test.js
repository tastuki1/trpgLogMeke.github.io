function returnTemplate(logFileName, nameColor, backColor, viewCheck, content) {
  var style = `
<style>
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
  }
  details {
    background-color: ${backColor};
    padding: .3rem;
    margin: 0rem;
  }
  summary {
    padding-left: 3rem;
    margin: 0rem;
    color: ${nameColor};
  }
  h1 {
    padding: .3rem .3rem .3rem 3rem;
    margin: 0rem;
    color: ${nameColor};
    font-family: 'New Tegomin', serif;
  }
  h3 {
    margin: .5rem;
    style="color:#707070"
  }
  .viewCheck{
    padding-left: 3rem;
    color: ${nameColor};
  }
  .viewCheck label{
    display: inline-block;
  }
  .box5 {
    padding: 2rem;
    margin: 6rem 2rem 2rem;
    border: double 5px ${backColor};
    background-color: #ffffff;
  }
  .box5 p {
    margin: 0;
    padding: .5rem;
    text-align: left;
  }
  .tab {
    position: relative;
    margin: 1rem 0 1rem 0;
    padding: .5rem 1.5rem .5rem 1rem;
    box-sizing: border-box;
    background: #f5f5f5;
    overflow-wrap: break-word;
  }
  .box {
    position: relative;
    margin: 2rem 1rem 1.5rem;
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
  b {
    display: block;
  }
  @media screen and (max-width: 480px){
    html {
      font-size: 14px;
    }
    h1 {
      padding: .2rem .2rem .2rem 1.5rem;
      font-size: 27px;
    }
    .viewcheck{
      padding-left: 1.5rem;
    }
    details {
      padding: .2rem;
    }
    summary {
      padding-left: 1.5rem;
    }
    main {
      width: 100%;
    }
    .box5{
      padding: 0.8rem;
      margin: 5.5rem .6rem .6rem;
    }
    bbbbb {
      display: block;
      content: "";
      margin: 0.6rem;
    }
  }
/* PCの記載 */
  p.char {
    margin-left: .5rem;
    text-indent: -.5rem;
  }
  p.KP {
    margin-left: .5rem;
  }
</style>`
  var template = `
<!DOCTYPE html>
<html lang="ja">
    <head>
        <title>${logFileName}</title>
        <meta charset="UTF-8">
        <script type="text/javascript">
            function c_disp(obj, name) {
                const title = document.getElementsByClassName(name)
                for ( let i = 0; i < title.length; i ++ ){
                if ( obj.checked == true) {
                    title[i].style.display = 'block';
                } else {
                    title[i].style.display = 'none';
                }
                }
            }
        </script>
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, user-scalable=yes">
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        ${style}
    </head>
    <body>
        <div class="header">
            <h1>${logFileName}</h1>
            <details>
              <summary>タブ表示</summary>
              ${viewCheck}
            </details>
        </div>
        <div class="box5">
            ${content}
        </div>
    </body>
</html>`
  return template
}