
// 形態素解析する --- (※4)
function furigana(items,elem) {
  var res = "";
  for (var i in items) {
    var k = items[i];
    var word = k.surface_form;
    var h= k.pos;
    var kana = k.reading;

    if (k == "EOS" || k == "\n" || k=="\r" || kana == undefined) continue;
    // フリガナが必要なときを判定 --- (※5)
    if (word == kana || isHiragana(word)) {
      res += word;
    } else {
      res += word + '(' + kana + ' / '+h+')';
    }
  }
  console.log(res);
  elem.innerHTML +="<p>"+res+"</p><hr/>";
}

// ひらがな判定
function isHiragana(s) {
  return (s.match(/^[あ-ん]+$/));
}
