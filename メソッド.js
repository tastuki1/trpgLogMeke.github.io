const DEFAULT_COLOR = "#ffffff";
const BACK_COLOR = "#6b8e23";
const DEFAULT_DICE_PATH = "./defaultDice6th.json"

const blueBackground = { background: 'linear-gradient(transparent 70%, #7fbfff 0%)' };
const redBackground = { background: 'linear-gradient(transparent 70%, #ff7f7f 0%)' };

const regex = / 【(.*)】.*\(1D100<=\d+\) ＞ (\d+) ＞ (.*)/;
const regex_d100 = /.* \(1D100<=\d+\) ＞ (\d+) ＞ (.*)/;

const makeLog = new Vue({
    el: "#makeLog",
    data: {
        isLoading: false,
        logFileName: "log",
        nameColor: DEFAULT_COLOR,
        backColor: BACK_COLOR,
        file: {},
        component: [],
        result: [],
        tablist: [],
        character: [],
        tabName: { visible: true },
        value: { visible: true },
        status: { visible: true },
        labels: [
            { labelname: "クリティカル", visible: true },
            { labelname: "スペシャル", visible: true },
            { labelname: "ファンブル", visible: true },
            { labelname: "初期値成功", visible: true }
        ],
        copyText: "",
        defaultDice: []
    },
    methods: {
        /**
         * ログ内容のリセット
         */
        reset() {
            this.result = []
            this.tablist = [{ tabName: "メイン", color: "#ffffff", visible: true }, { tabName: "情報", color: "#ffffff", visible: true }]
            this.character = []
            this.component = []
            this.readDefaultDice()
        },
        /**
         * ダイスの初期値の読み込み
         * @returns {boolean} ファイル読み込み完了
         * @returns {boolean} ファイル読み込みエラー
        */
        readDefaultDice(){
            var reader = new FileReader()
            // ファイル読み込み開始
            reader.readAsText(DEFAULT_DICE_PATH)
            // ファイル読み込み完了時の処理
            reader.onload = () => {
                var content = reader.result
                this.defaultDice = JSON.parse(content)
                console.log("ファイル読み込み完了")
            }
            // ファイル読み込みエラー時の処理
            reader.onerror = () => {
                console.log("ファイル読み込みエラー")
            }
        },
        /**
        * テキストコピー
        */
        copy() {
            // コピーするテキストを取得
            const copyText = this.$el.querySelector('#growth_area').innerText
            navigator.clipboard
                .writeText(copyText)
                .then(() => {
                    alert('テキストコピー完了')
                    console.log('テキストコピー完了')
                })
                .catch(e => {
                    console.error(e)
                })
        },
        /**
        * ログファイルの解析
        * @param {string} tabName タブ名
        * @param {string} charName キャラクタ名
        * @param {string} content ログ内容
        */
        analizeDice(tabName, charName, content) {
            if (content.trim() !== '') {
                // 改行で分割
                let contents = content.split("<br>");
                let temp_cont = [];
        
                // 各行の解析
                for (let cont of contents) {
                    // 空行の場合は値を追加して次の行へ
                    if (cont.trim() === '') {
                        this.addValue(tabName, charName, temp_cont);
                        // 初期化
                        temp_cont = [];
                        continue;
                    // ダイス行の場合はダイスの解析
                    } else if (regex_d100.test(cont)) {
                        dice = this.checkDice(cont, tabName, charName);
                    }
                    temp_cont.push({ content: cont, dice: dice });
                }
                // 値を追加
                this.addValue(tabName, charName, temp_cont);
            }
        },
        /**
         * 値の追加
         * @param {string} tabName タブ名
         * @param {string} charName キャラクタ名
         * @param {string} line 行
         */
        addValue(tabName, charName, line) {
            const num = this.component.length - 1;
            // タブ名が同じ場合
            if (num >= 0 && this.component[num].tabName === tabName) {
                const lastComponent = this.component[num];
                const lastValue = lastComponent ? lastComponent.value[lastComponent.value.length - 1] : null;
                // キャラクタ名が同じ場合
                if (lastValue && lastValue.charName === charName) {
                    lastValue.line.push(line);
                // キャラクタ名が異なる場合
                } else {
                    this.component[num].value.push({ charName: charName, line: [line] });
                }
            // タブ名が異なる場合
            } else {
                this.component.push({ tabName: tabName, value: [{ charName: charName, line: [line] }] });
            }
        },
        /**
         * ダイスの解析
         * @param {string} cont ログ内容
         * @param {string} tabName タブ名
         * @param {string} charName キャラクタ名
         */
        checkDice(cont, tabName, charName) {
            // ダイスの解析
            label = "";
            dice = redBackground;
            let res = cont.match(regex_d100)[1];
            if (cont.match(/決定的成功|スペシャル/)) {
                dice = blueBackground;
                label = cont.match(/決定的成功/) ? "クリティカル" : "スペシャル";
            } else if (cont.match(/致命的失敗/)) {
                dice = redBackground;
                label = "ファンブル";
            } else if (cont.match(/成功/)) {
                dice = blueBackground;
                const judge = cont.match(/<=\d+ 【.*】/);
                if (judge && this.defaultDice.includes(judge[0])) {
                    label = "初期値成功";
                }
            }
            // ラベルがある場合
            if (label !== "") {
                const s_regex = /SAN値チェック|STR|CON|POW|DEX|APP|SIZ|INT|EDU|アイデア|幸運|ショックロール|知識/;
                // ステータス判定
                let status = s_regex.test(cont);
                // 技能名の取得
                let skillMatch = cont.match(regex);
                let skill = skillMatch ? skillMatch[1] : "";
                // キャラクタがない場合は追加
                if (!this.result[charName]) {this.result[charName] = {};}
                // ラベルがない場合は追加
                if (!this.result[charName][label]) {this.result[charName][label] = [];}
                // ダイスの追加
                this.result[charName][label].push({ tabName: tabName, ginou: skill, value: res, status: status });
            }
            return dice;
        },
        /**
         * ログファイルの読み込み
         * @param {Event} e イベント
         * @returns {boolean} ファイル情報取得エラー
         * @returns {boolean} ファイル読み込み完了
        */
        readLogFile: function(e) {
            // 初期化
            this.reset()
            // ファイルの取得
            const files = e.target.files
            this.file = files[0]
            this.logFileName = this.file.name.replace(/\[.+\](.*)/, "").replace(/\.html/, "")
            var reader = new FileReader()
            // ファイル読み込み開始
            reader.readAsText(this.file)
            // ファイル読み込み完了時の処理
            reader.onload = () => {
                var content = reader.result
                if (this.readLog(readRegex(content))) {
                    alert("ファイル読み込み完了")
                } else {
                    alert("ファイル情報取得エラー")
                }
            }
            // ファイル読み込みエラー時の処理
            reader.onerror = () => {
                alert("ファイル読み込みエラー")
            }
        },
        /**
         * ログファイルの解析
         * @param {*} content 
         * @returns 
         */
        readLog(content) {
            // 初期値
            var charName, style, color, tabName = ""
            list = ["system"]
            ary = []
            // ログ内容をブロックごとに分割する正規表現
            const regex = /<p style="color:(#[0-9a-z]+);">\s*<span> \[(.*?)\]<\/span>\s*<span>(.*?)<\/span> :\s*<span>([\s\S]*?)<\/span>\s*<\/p>/g

            // マッチング実行
            const matches = content.matchAll(regex);

            try {
                // 各ブロックごとに処理
                for (const match of matches) {
                    
                    charColor = match[1]                    // キャラクタの色の取得
                    tabName = this.getTabName(match[2]);    // タブ名の取得
                    charName = match[3]                     // キャラクタ名の取得
                    content = match[4]                      // 内容の取得

                    // タブリストにタブ名がない場合は追加
                    if (!this.tablist.some((u) => u.tabName === tabName)) {
                        this.tablist.push({ tabName: tabName, color: "#707070", visible: true })
                    }

                    // キャラクタ名が取得できる場合
                    if (charName) {
                        // キャラクタ名がリストにある場合はスタイルを変更
                        if (list.includes(charName)) {
                            style = "character"
                            ary = ary.filter(item => item.charName != charName)
                            // キャラクタ名の色を変更
                            charColor == "#888888" ? "#ffffff" : charColor
                            // キャラクタ名がリストにない場合はスタイルを変更
                        } else {
                            style = "item"
                            list.push(charName)
                            color = "#707070"
                        }
                        // ダイスの解析
                        this.analizeDice(tabName, charName, content)
                        // キャラクタリストに追加
                        ary.push({ charName: charName, style: style, color: charColor })
                    }
                }
                // キャラクタリストのソート
                this.character = ary.sort((a, b) => {
                    if (a.style < b.style) return -1;
                    if (a.style > b.style) return 1;
                    if (a.charName < b.charName) return -1;
                    if (a.charName > b.charName) return 1;
                    return 0
                })
                return true
            } catch {
                return false
            }
        },
        /**
         * タブ名の取得
         * @param {string} rawtabName タブ名
         * @returns {string} タブ名
         */
        getTabName(rawtabName) {
            switch (rawtabName) {
                case "main": return "メイン";
                case "info": return "情報";
                case "other": return "雑談";
                default: return rawtabName;
            }
        }
    }
})