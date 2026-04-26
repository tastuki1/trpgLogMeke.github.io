import { FAILURE_HIGHLIGHT, SUCCESS_HIGHLIGHT } from '@/logmake/lib/defaults'
import type {
  ContentParagraph,
  ContentToken,
  LogmakeSettings,
  OutputModel,
  OutputSection,
  OutputSpeakerEntry,
} from '@/logmake/types'

export function buildOutputHtml(
  outputModel: OutputModel,
  settings: LogmakeSettings
): string {
  const viewCheck = outputModel.toggles
    .map(
      (tab) => `
                <label for="${escapeAttribute(tab.name)}">
                    <input
                        type="checkbox"
                        id="${escapeAttribute(tab.name)}"
                        checked="checked"
                        onchange="c_disp(this, '${escapeAttribute(`${tab.name} tab`)}')"
                        style="accent-color: ${tab.color};"
                    />
                    <span>${escapeText(tab.name)}</span>
                </label>`
    )
    .join('\n')

  const content = outputModel.sections.map(renderSection).join('\n')

  return `<!DOCTYPE html>
<html lang="ja">
    <head>
        <title>${escapeText(settings.logFileName)}</title>
        <meta charset="UTF-8">
        <script type="text/javascript">
            function c_disp(obj, name) {
                const nodes = document.getElementsByClassName(name)
                for (let i = 0; i < nodes.length; i += 1) {
                    nodes[i].style.display = obj.checked ? 'block' : 'none'
                }
            }
        </script>
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, user-scalable=yes">
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        ${buildStyle(settings)}
    </head>
    <body>
        <div class="header">
            <h1>${escapeText(settings.title)}</h1>
            <details>
                <summary>タブ表示</summary>
                <div class="viewCheck">
                    ${viewCheck}
                </div>
            </details>
        </div>
        <div class="box5">
            ${content}
        </div>
    </body>
</html>`
}

function renderSection(section: OutputSection): string {
  const className =
    section.tabName === 'メイン' || section.tabName === '情報'
      ? 'mainBlock'
      : section.tabVisibilityClass

  const style =
    section.tabName === 'メイン' || section.tabName === '情報'
      ? ''
      : ` style="border-left: 3px solid ${section.tabColor};"`

  return `<div class="${className}"${style}>
    ${section.entries.map(renderSpeaker).join('\n')}
</div>`
}

function renderSpeaker(entry: OutputSpeakerEntry): string {
  if (entry.style === 'character') {
    return `<div class="char" style="color: ${entry.color};">
    <b>${escapeText(entry.charName)}</b>
    ${entry.paragraphs.map(renderParagraph).join('\n')}
</div>`
  }

  if (entry.style === 'scene') {
    return `<p class="KP" style="color: ${entry.color};">${escapeText(entry.charName)}</p>
${entry.paragraphs.map(renderParagraph).join('\n')}`
  }

  return `<div class="box">
    <span class="box-title">${escapeText(entry.charName)}</span>
    ${entry.paragraphs.map(renderParagraph).join('\n')}
</div>`
}

function renderParagraph(paragraph: ContentParagraph): string {
  return `<p class="bbb">
    ${paragraph.tokens.map(renderToken).join('<br>')}
</p>`
}

function renderToken(token: ContentToken): string {
  if (token.highlight === 'success') {
    return `<span style="background: ${SUCCESS_HIGHLIGHT};">${token.content}</span>`
  }

  if (token.highlight === 'failure') {
    return `<span style="background: ${FAILURE_HIGHLIGHT};">${token.content}</span>`
  }

  return `<span>${token.content}</span>`
}

function buildStyle(settings: LogmakeSettings): string {
  return `<style>
  @import url('https://fonts.googleapis.com/css?family=Noto+Sans+JP');
  @import url('https://fonts.googleapis.com/css2?family=New+Tegomin&family=Sawarabi+Mincho&display=swap');
  html {
    font-size: 16px;
  }
  body {
    background-color: ${settings.frameColor};
    font-family: 'Hiragino Sans', sans-serif;
  }
  .header{
    background-color: ${settings.frameColor};
    width:100%;
    position: fixed;
    z-index: 999;
    top:0;
    left:0;
  }
  details {
    background-color: ${settings.frameColor};
    padding: .3rem;
    margin: 0;
  }
  summary {
    padding-left: 3rem;
    margin: 0;
    color: ${settings.nameColor};
  }
  h1 {
    padding: .3rem .3rem .3rem 3rem;
    margin: 0;
    color: ${settings.nameColor};
    font-family: 'New Tegomin', serif;
  }
  .viewCheck{
    padding-left: 3rem;
    color: ${settings.nameColor};
  }
  .viewCheck label{
    display: inline-block;
    margin-right: .75rem;
  }
  .box5 {
    padding: 2rem;
    margin: 6rem 2rem 2rem;
    border: double 5px ${settings.frameColor};
    background-color: ${settings.backColor};
  }
  .box5 p {
    margin: 0;
    padding: .5rem;
    text-align: left;
  }
  .tab {
    position: relative;
    margin: 1.5rem 0;
    padding: .5rem 1.5rem .5rem 1rem;
    box-sizing: border-box;
    background: rgba(127, 127, 127, 0.1);
    overflow-wrap: break-word;
  }
  .box {
    position: relative;
    margin: 2rem 1rem;
    padding: 1rem 1.5rem .5rem 1rem;
    border: solid 3px #888888;
    border-radius: 8px;
    background: ${settings.backColor};
    line-height: 1.5;
  }
  .box .box-title {
    position: absolute;
    display: inline-block;
    top: -0.6rem;
    left: .5rem;
    padding: 0 .5rem;
    line-height: 1;
    background: ${settings.backColor};
    color: #888888;
    font-weight: bold;
  }
  .box p {
    margin: 0;
    color: #888888;
  }
  b {
    display: block;
  }
  .bbb {
    display: block;
    margin: 0rem 0.3rem;
  }
  .char {
    margin: 1.5rem 1rem 1.5rem 0.5rem;
  }
  .KP {
    margin-left: .5rem;
  }
  @media screen and (max-width: 480px){
    html {
      font-size: 14px;
    }
    h1 {
      padding: .2rem .2rem .2rem 1.5rem;
      font-size: 27px;
    }
    .viewCheck{
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
  }
  </style>`
}

function escapeText(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function escapeAttribute(text: string): string {
  return escapeText(text)
}
