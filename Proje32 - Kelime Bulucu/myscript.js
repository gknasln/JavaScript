const radioButtons = document.querySelectorAll(".radios");
const wordField = document.querySelectorAll(".textArea")[0];
const mustHaveField = document.querySelectorAll(".textArea")[1];
const firstLetterField = document.querySelectorAll(".letterArea")[0];
const secondLetterField = document.querySelectorAll(".letterArea")[1];
const datas = [];

//fetch metodu ile veritabanındaki veriler çağırılıyor.
fetch("https://raw.githubusercontent.com/gknasln/gknasln/master/TurkishWords2.json")
.then(blob => blob.json())
.then(data => datas.push(...data) );


/*
var javaobj;
var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function(){
	if(xhttp.readyState == 4 && xhttp.status == 200) {
		 var javaobj = JSON.parse(xhttp.response);
		 datas = javaobj;	
	}
}
xhttp.open("GET", "https://raw.githubusercontent.com/gknasln/gknasln/master/TurkishWords2.json", true);
xhttp.send();
*/



/*Bütün işlem bu metod içerisinde gerçekleşiyor. Main metod bu */ 
function action(){
	resetStyle();  // bi önceki seferde yanlış giriildiyse borderler kırmızı olduğu için onları resetliyor. 
	let enteredWords = wordField.value.toLowerCase();
	const mustHave = mustHaveField.value.toLowerCase();
	const firstLetter = firstLetterField.value.toLowerCase();
	const secondLetter = secondLetterField.value.toLowerCase();
	const jokerNumber = getJokers(enteredWords);
	enteredWords = enteredWords.replace(/\*/g, "");
	const words = [];
	//deneme amaçlı doldurdum
	let foundedWords = [
		{word:"Merhaba", point: 0},
		{word:"M#e-rhaba", point: 0},
		{word:"Merh#a-ba", point: 0},
		{word:"Mer#h-aba", point: 0},
	];

	
	//Eğer aranacak kelime girilmediyse veya yanlış girildiyse diğer işlemleri yapmaya gerek olmadığı için metod bitirilecek
	if(!validateWordField()){
		return;
	}

	//içerisinde bir kelime içeren arama metodumu,  yoksa iki harf arasında yapılacak aramamı kontrol ediyor
	let searchPath = radioButtons[0].checked ? 0:1;

	//arama metodu hangisi ise o alanlara girilen değerleri kontrol ediyor. 
	if(searchPath === 0){
		if(!validateMustHaveField())
			return;
	}else{
		if(!validateLetterFields())
			return;
	}

	datas.forEach(index => {
		checkCurrentWord(index, searchPath, jokerNumber);
	});


	/*Kelimelerin oyunda toplam kaç puan eettiğini hesaplıyor. Oyunda her harfin  bir puanı vardır. 
	   oyunda joker karakterleri ile bulunan harfler 0 puan ediyor  ve programda jokerlerin solunda # 
	   sembolü var bu yüzden indeks içerisinde joker sembolü varsa bir sonraki harf jokerdir ve puanı 0'dır*/
	foundedWords.forEach(index => {
		let i =0;
		let joker = 0;
		for(; i < index.word.length; i++){
			if(index.word.charAt(i) === "#"){
				joker = i;
			}
			if(i !== joker+1) 
				index.point += charPoints(index.word.charAt(i));
		}
	})

	//En yüksek puanlıdan en düşük puanlıya sıralıyor.
	foundedWords.sort( (a,b)=> b.point - a.point );
 
	/* Jokerleri kırmızı, olması gerken kelimeleri ise mavi olarak ekrana yazdırmak istiyoruz. 
		replace metodunu kullanarak # yerine span etiketi açılışı - yerine span kapanışını yazıyoruz. */
	foundedWords = foundedWords.map(index => {
		let str = index;
		if(index.word.includes("#")){ // joker ise kırmızı
			str.word = index.word.replace("#", "<span style='font: red'>");
			str.word = index.word.replace("-", "</span>");
		}
		if(index.word.includes("€")){ // zaten tabloda olan harf ise mavi 
			str.word = index.word.replace("€", "<span = style='font: blue>");
			str.word = index.word.replace("-", "</span>");
		}
		return str;
	});

	// eksik olan metodlar var daha iki harf arasında kelime arama metodunu oluşturacağım, 
	// writeResults metodu yazmam lazım (sonuçları ikili liste halinde web sayfasına yazdırmak için)
}

var  x  =  "xxx";
/* Bu metod parametre olarak verilen word kelimesini verilen harfler ile karşılaştırıyor. 
	Eğer verilen harfler mevcut kelimeyi oluşturabiliyor ise bu kelimeyi foundedWords dizisine ekliyor. 
	Eğer joker kullanıldıysa joker kelimeden önce #simgesi koyuyor, mustHave kelimesi ise veya iki harf arasında
	metodunun harfleri ise bunları  - - ile kaplıyor ki ileride bu harfleri renklendirebilelim. */
function checkCurrentWord(word, enteredWord, searchPath, jokerNumber, mustHave ){
	let currentEntereds = enteredWord;

	if( (enteredWord + jokerNumber) >= word.length) { return; } 
	// Eğer kelime içerisinde olması gereken bir kelime belirtiysek ve bu kelime cümlede yoksa metodu bitir. 
	if(mustHave !== null && !word.includes(mustHave)){
		return;
	}else if(mustHave !==null){
		currentEntereds += mustHave; //Eğer cümle uygun ise mustHave içeriği verilen harflere eklenmeli
	}
    let wordToAdd = "";
	let jokers= jokerNumber; 
    let flag = false;
    let i = 0;
	let j = 0;
	
	/* word kelimesinin  harf sayısı kadar bir döngü dönüyor ve bu döngünün her bir harfi için girilen harflerin 
		uzunluğu kadar bir iç döngü çalışıyor. Eğer word kelimesinin indeksindeki harfi, verilen harflerde var ise
		iç döngüden çıkılıyor, flag ture oluyor ve girilen harfler değişkeninden eşleşen  harf siliniyor. Çünkü word 
		kelimesinin sonraki harfleri için aynı harf tekrar karşılaştırılmasın. */  
    for(; i < word.length; i++){
		flag = false;
		j = 0;
 		for(; j < currentEntereds.length; j++){
			console.log(word.charAt(i) + currentEntereds.charAt(j));
			console.log(word.charAt(i) === currentEntereds.charAt(j))
    		if(word.charAt(i) === currentEntereds.charAt(j)){ 
				wordToAdd += word.charAt(i);
				console.log(wordToAdd);
				currentEntereds = deleteIndex(currentEntereds, j);
				flag = true;
				break; // kelime bulunursa iç döngüden çıkıyor.
			}
		 } //J loop
 		if(!flag && jokers >= 1){  
            wordToAdd += "#" + word.charAt(i) + "-";  //harfin solunda # sembolu var ise joker kullanılmış demektir.
        	jokers = jokers -1;
     	}else if(!flag){ //Eğer joker yok ise ve kelimelerde eşleşmemiş ise metod bitirilecek 
     		return;
		 }
		 console.log(i);
	} // i döngüsü bitimi
	
    /* iki döngüde bittiktten sonra flag  true kalır ise kelime girilen harflerin arasında var demektir.
        o zaman kelime  foundedWords dizisine eklenir */  
	if(flag){ console.log("Bulunan Kelime: " + wordToAdd)}; 
}// checkCurrentWord metodu bitimi  


function getJokers(word){
	let jokerNumber = 0;
	let i = 0;
	for(; i < word.length; i++){
		if(word.charAt(i) === '*')
			jokerNumber++;
	}
	return jokerNumber;
}

function deleteIndex(text, index){
	let returnVal = "";
	let i = 0;
	for(;i<text.length;i++){
		if(i !== index)
			returnVal += text.charAt(i);
	}
	return returnVal;
}


 function charPoints(char){
	let returnValue = 0;
	switch(char){
		case 'a' : returnValue = 1;
		break;
		case 'b' : returnValue = 3;
		break;
		case 'c' : returnValue = 4;
		break;
		case 'ç' : returnValue = 4;
		break;
		case 'd' : returnValue = 3;
		break;
		case 'e' : returnValue = 1;
		break;
		case 'f' : returnValue = 7;
		break;
		case 'g' : returnValue = 5;
		break;
		case 'ğ' : returnValue = 8;
		break;
		case 'h' : returnValue = 5;
		break;
		case 'ı' : returnValue = 2;
		break;
		case 'i' : returnValue = 1;
		break;
		case 'j' : returnValue = 10;
		break;
		case 'k' : returnValue = 1;
		break;
		case 'l' : returnValue = 1;
		break;
		case 'm' : returnValue = 2;
		break;
		case 'n' : returnValue = 1;
		break;
		case 'o' : returnValue = 2;
		break;
		case 'ö' : returnValue = 7;
		break;
		case 'p' : returnValue = 5;
		break;
		case 'r' : returnValue = 1;
		break;
		case 's' : returnValue = 2;
		break;
		case 'ş' : returnValue = 4;
		break;
		case 't' : returnValue = 1;
		break;
		case 'u' : returnValue = 2;
		break;
		case 'ü' : returnValue = 3;
		break;
		case 'v' : returnValue = 7;
		break;
		case 'y' : returnValue = 3;
		break;
		case 'z' : returnValue = 4;
		break;
		default : returnValue = 0;
		break;
	}
	return returnValue;
}


function validateWordField(){
	const text = wordField.value.toLowerCase();
	switch(validate(text)){ //if yapısı koysaydım metodu birden fazla çağıracaktım
		case -1 : 
			wordField.style.border = "1px solid red";
			window.alert("Hiçbir harf girilmedi!");
			return false;
			break;
		case 0 : 
			wordField.style.border = "1px solid red";
			window.alert("Lütfen sadece 'a' ve 'z' arasındaki karakterleri veya Joker('*') giriniz...");
			return false;
		break;
		case 2:
			wordField.style.border = "1px solid red";
			window.alert("En fazla iki adet joker girilebilir!");
			return false;
		break;
		default: 
			return true;

	}
}

function validateMustHaveField(){
	const  text = mustHaveField.value.toLowerCase();
	if(text.includes('*')){
		mustHaveField.style.border = "1px solid red";
		window.alert("Sadece harf kısmına joker yazılabilir.");
		return false;
	}else if(validate(text) === 0){
		mustHaveField.style.border = "1px solid red";
		window.alert("Lütfen sadece 'a' ve 'z' arasındaki karakterleri giriniz...");
		return false;
	}else{
		return true;
	}

}
/* Bu metod ilk harf kutusunu ve ikinci harf kutusunu kontrol ediyor. Koşullar uymadığı takdirde 
	hata verip, hangi harf kutusunun değeri yanlış girilmiş ise onun borderini kırmızı yapıyor. */
function validateLetterFields(){
	const firstLetter = firstLetterField.value.toLowerCase();
	const secondLetter = secondLetterField.value.toLowerCase();

	if(firstLetter.length > 1){
		firstLetterField.style.border = "1px solid red";
		window.alert("İki harf arasında arama yapabilmek için harf alanlarına en fazla 'bir' harf girmeniz gerekmektedir...");
		return false;
	}else if(firstLetter.includes("*")){
		firstLetterField.style.border = "1px solid red";
		window.alert("Sadece harf kısmına joker yazılabilir.");
		return false;
	}else{
		firstLetterValidation = true;
	}

	switch(validate(firstLetter)){ //if yapısı koysaydım metodu birden fazla çağıracaktım
		case -1 : 
			firstLetterField.style.border = "1px solid red";
			window.alert("İki harf arasında arama metodu seçili ise, harf alanları boş bırakılamaz!");
			return false;
			break;
		case 0 : 
			firstLetterField.style.border = "1px solid red";
			window.alert("Lütfen sadece 'a' ve 'z' arasındaki karakterleri giriniz...");
			return false;
		break;
	}

	if(secondLetter.length > 1){
		secondLetterField.style.border = "1px solid red";
		window.alert("İki harf arasında arama yapabilmek için harf alanlarına en fazla 'bir' harf girmeniz gerekmektedir...");
		return false;
	}else if(secondLetter.includes("*")){
		secondLetterField.style.border = "1px solid red";
		window.alert("Sadece harf kısmına joker yazılabilir.");
		return false;
	}

	switch(validate(secondLetter)){ //if yapısı koysaydım metodu birden fazla çağıracaktım
		case -1 : 
			secondLetterField.style.border = "1px solid red";
			window.alert("İki harf arasında arama metodu seçili ise, harf alanları boş bırakılamaz!");
			return false;
			break;
		case 0 : 
			secondLetterField.style.border = "1px solid red";
			window.alert("Lütfen sadece 'a' ve 'z' arasındaki karakterleri giriniz...");
			return false;
		break;
		default: 
			return true;  //metod zaten buraya kadar gelebilmişse true  ve bu switch den de geçerse true dönücek
	}

}

/*ascıı da küçük a=97 küçük z=122 çarpım sembolüde (joker) 42 olduğu için bu
	char karakterleri dışındaki karakterlere denk gelirse metod 0 değeri vericek çünkü
	kullanıcının a ile z arasında ve * dışında char karakteri girmemesi gerekiyor.
	Aynı zamanda 2' den fazla joker girilirse 2 değeri vericek buda fazla joker hatası olucak.
	hiç değer girilmeyiyse -1 dönecek */ 
function validate(text){
	if(text.length === 0){ return -1};
    let jokerNumber = 0;
    let ch;
    let i = 0;
    for(; i < text.length; i++){
		ch = text.charCodeAt(i); 
		if( ((ch >= 97 && 122 >= ch) || ch == 42) ){
			if(ch == 42) { jokerNumber++ };
		}else{
			return 0;
		}
	}
	if(jokerNumber > 2){
		return 2;
	}else{
		return 1;
   }
}

function resetStyle(){
	console.log("stil resetlendi");
	wordField.style.border = "1px solid gray";
	mustHaveField.style.border = "1px solid gray";
	firstLetterField.style.border = "1px solid gray";
	secondLetterField.style.border = "1px solid gray";
}

document.querySelector("#searchButton").addEventListener("click", action);


radioButtons[0].addEventListener('click',() => {
	mustHaveField.disabled =false;
	firstLetterField.disabled = true;
	secondLetterField.disabled = true;
	document.querySelector("#optionBox").style.disabled = "disabled";
});

radioButtons[1].addEventListener('click', () =>{
	mustHaveField.disabled= true;
	firstLetterField.disabled = false;
	secondLetterField.disabled = false;
});


