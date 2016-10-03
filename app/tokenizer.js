var DIC_URL     = "node_modules/kuromoji/dist/dict/";
var tokenizer   = null;
var dl_button   = document.querySelector('a#export_csv');
var proof_btn   = document.querySelector('a#proof');
var proofed_list= document.querySelector('div#proofed_list');
var wordcountbtn= document.querySelector('a#wordcount');
const BUTTON_CLASSNAME = ''
//const BUTTON_CLASSNAME = 'btn btn-default'


var vm = new Vue({
    el  : "#tokenizing",
    data: {
        inputText : "",
        tokens    : [],
        isLoading : true,
        message   : "Loading dictionaries ...",
        svgStyle  : "hidden",
        showmode : "tokenize"
    },
    methods: {
        tokenize: function () {
            if (vm.inputText == "" || tokenizer == null) {
                vm.tokens = [];
                // lattice = null;
                return;
            }
            try {
                // lattice = tokenizer.getLattice(vm.inputText);
                var txt = vm.inputText;
                //txt = txt.replace( /[\r|\n]/g , "＠" ) ;
                //var n = txt.match(/[\r|\n]/g);
                //var len = 0;
                //if (n) len = n.length + 1; else len = 1;
                //console.log(len);
                vm.tokens = tokenizer.tokenize(txt);
                //console.log(vm.tokens);
            } catch (e) {
                console.log(e);
                // lattice = null;
                vm.tokens = [];
            }
        }
    }
});

// フォームの内容が変化したらtokenizeする
vm.$watch("inputText", function (value) {
    vm.svgStyle = "hidden";
    vm.tokenize();
    var button_classname = (vm.tokens.length == 0) ? BUTTON_CLASSNAME + ' disabled' : BUTTON_CLASSNAME;
    dl_button.className = button_classname;
    if(vm.showmode === "proof"){
        proofing();
    }

});


// Load and prepare tokenizer
kuromoji.builder({ dicPath: DIC_URL }).build(function (error, _tokenizer) {
    if (error != null) {
        console.log(error);
    }
    tokenizer       = _tokenizer;
    vm.inputText    = "例えば、こんな感じで文章が解析されます。";
    vm.isLoading    = false;
    vm.message      = "Ready";
    dl_button.className= BUTTON_CLASSNAME;
});

dl_button.onclick = function() {
    vm.showmode = "tokenize";
    var content = build_csv();
    var blob = new Blob([ content ], { type: "text/csv;charset=utf-16;" });
    this.href = window.URL.createObjectURL(blob);
    this.download = vm.tokens[0].surface_form + "_tokens.csv";
};

proof_btn.onclick = function(){
    vm.showmode = "proof";
    proofing();
};

wordcountbtn.onclick = function(){
    vm.showmode = "wordcount";
    wordcounting();
}

function proofing(){
    proofed_list.innerHTML ="";
    console.log(vm.tokens,proofed_list);
    checkJosiNo(vm.tokens,proofed_list);
    checkTaiou(vm.tokens,proofed_list);

}

function wordcounting(){
    proofed_list.innerHTML ="";
    checkHindo2(vm.tokens,proofed_list);
}

function build_csv() {
  var csv_string = "";

  var header = ['表層形','品詞','品詞細分類1','品詞細分類2','品詞細分類3','活用型','活用形','基本形','読み','発音']

  csv_string += header;
  csv_string += '\r\n';

  for(var i = 0; i < vm.tokens.length; i++) {
    var token = vm.tokens[i];
    csv_string += ([token.surface_form, token.pos, token.pos_detail_1, token.pos_detail_2, token.pos_detail_3, token.conjugated_type, token.conjugated_form, token.basic_form, token.reading, token.pronunciation])
    csv_string += '\r\n';
  }

  // BOM追加
  csv_string = "\ufffe" + csv_string;

  // if (isLittleEndian()) {

  //   //実行環境のエンディアンがLEならTypedArrayを利用
  //   var array = [];
  //   for (var i=0; i<csv_string.length; i++){
  //       array.push(csv_string.charCodeAt(i));
  //   }
  //   var csv_contents = new Uint16Array(array);

  // } else {

  //   //LEでない場合はDataViewでUTF-16LEのArrayBufferを作成
  //   var array_buffer = new ArrayBuffer(csv_string.length * 2);
  //   var data_view = new DataView(array_buffer);
  //   for (var i=0,j=0; i<csv_string.length; i++,j=i*2) {
  //       data_view.setUint16( j, csv_string.charCodeAt(i), true ); //第3引数にtrueを渡すとLEになる
  //   }
  //   var csv_contents = array_buffer
  // }

  return csv_string;
}

function isLittleEndian(){
    if ((new Uint8Array((new Uint16Array([0x00ff])).buffer))[0]) return true;
    return false;
}
