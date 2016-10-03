var msg="";

function checkHindo2(items,elem) {
  // 語句をオブジェクトに格納し頻度を調べる
  var words = {}; // --- (※2)
  for (var i in items) {
    var it = items[i];
    var w = it.surface_form;
    var h = it.pos;
    // 意味のない語句を除外する ---- (※3)
    if (h != "名詞" && h != "動詞" && h != "形容詞") continue;
    if (words[w] == undefined) {
      words[w] = 1;
    } else {
      words[w]++;
    }
  }
  // 語句を出現頻度にソートするため配列にコピー --- (※4)
  var list = [];
  for (var key in words) {
    list.push({
      "word":key,
      "nums":words[key]
    });
  }
  // ソートする --- (※5)
  list.sort(function(a, b){
    return b.nums - a.nums;
  });
  // 頻出上位の語句を画面に出力する
  for (var i = 0; i < list.length; i++) {
    var it = list[i];
      if(it !==undefined){
        msg=(i + 1) + ":" + it.word + "(" + it.nums + " counts)";
        console.log(msg);
        elem.innerHTML +="<p>"+msg+"</p><hr/>";
      }
  }
}
