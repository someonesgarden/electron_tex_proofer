// 文章の校正ツール
var MAX_WORD = 40; // 最大単語数の警告
var fs = require('fs');
var msg = "";


// 助詞の「の」の連続と単語数の長さを確認
function checkJosiNo(items,elem) {

  var cnt = 0; // 助詞「の」が出現した回数を数える
  var cur = []; // 現在読み込んでいる文を保存する
  var lineno = 1; // 行番号を数える

  for (var i in items) {

    var it = items[i];
    var w = it.surface_form;
      if (w == "EOS" || w == "CF" || w == "CRLF" || w=='\n' || w=='\r' || w=='\r\n') {
        console.log("EOS:"+w);
        lineno++; cur = []; cnt = 0;
        continue;
    }
    // 文末および句点の確認 ---- (※4)
    if (w == "。" || w == "、") {
      // 「の」の回数
      if (cnt >= 3) {

        msg = "[警告] 助詞「の」が" + cnt + "回連続しています。";
          console.log(msg); elem.innerHTML +="<p>"+msg+"</p>";
        msg = "\t("+i+"ワード目・" + lineno + "行目:)" + cur.join("");
        console.log(msg); elem.innerHTML +=msg+"<hr/>";

      }
      // 単語数を確認 --- (※5)
      if (cur.length >= MAX_WORD) {
          msg = "[警告] 一文が長すぎます。" + cur.length + "以上の単語です。";
          console.log(msg); elem.innerHTML +="<p>"+msg+"</p>";
          msg = "\t("+i+"ワード目・" + lineno + "行目)" + cur.join("|");
          console.log(msg); elem.innerHTML +=msg+"<hr/>";

      }
      cnt = 0;
      if (w == "。") { cur = []; }
      continue;
    }
    // 「の」があるか確認 ---- (※6)
    if (it.surface_form == "の" && it.pos == "助詞") cnt++;
    cur.push(w);
  }
}

// 対応チェック
function checkTaiou(items,elem) {
  var heiritujosi = 0, cur = [], lineno = 1;
  var meisi = {};
  var setuzokusi = {}, oldCur = [];
  for (var i in items) {
    var it = items[i];
    var w = it.surface_form;
    if (w == "EOS") { // 改行
      lineno++;
      setuzokusi = {};
      oldCur = cur; cur = [];
      continue;
    }
    // 文末の処理 ----- (※8)
    if (w == "。") {
      if (heiritujosi == 1) {
          msg="[警告] 並立助詞「〜たり」が一度しか出現しません。";
          console.log(msg); elem.innerHTML +="<p>"+msg+"</p>";
          msg="\t("+i+"ワード目・" + lineno + "行目)" + cur.join("");
          console.log(msg); elem.innerHTML +=msg+"<hr/>";
      }
      oldCur = cur; cur = []; heiritujosi = 0;
      continue;
    }
    // 並立助詞「たり」のチェック --- (※9)
    if (it.pos_detail_1 == "並立助詞" && (w == "たり" || w == "だり")) {
      heiritujosi++;
    }
    // 接続詞のチェック(一行に同じ接続詞が出てこないようにする) --- (※10)
    if (it.pos == "接続詞") {
      if (typeof(setuzokusi[w]) == "undefined") {
        setuzokusi[w] = 1;
      } else {
          msg = "[警告] 一行に同じ接続詞「" + w + "」が複数回使われています。";
          console.log(msg); elem.innerHTML +="<p>"+msg+"</p>";
          msg = "\t("+i+"ワード目・" + lineno + "行目)" + oldCur.join("");
          console.log(msg); elem.innerHTML +=msg+"<hr/>";
      }
    }
    // 表記の揺れチェック --- (※11)
    if (it.pos == "名詞" && w.length >= 2) {
      var kana = it[8];
      if (kana == undefined) kana = it.surface_form; // 辞書にない単語対策
      kana = kana.replace(/ー/g, ''); // カタカナ対策
      if (meisi[kana] == undefined) {
        meisi[kana] = w;
      } else if (meisi[kana] != w) {
          msg ="[確認] 表記の揺れ: " + meisi[kana] + " != " + w;
          console.log(msg); elem.innerHTML +="<p>"+msg+"</p><hr/>";
      }
    }
    cur.push(w);
  }
}




