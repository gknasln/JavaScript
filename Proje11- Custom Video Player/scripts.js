 /* -------------------------------------Elementleri çağırma-------------------------------------- */ 
 const player = document.querySelector(".player");
 const video = player.querySelector(".viewer");
 const progress = player.querySelector(".progress");
 const progressBar = player.querySelector(".progress__filled");
 const toggle = player.querySelector(".toggle");
 const skipButtons = player.querySelectorAll("[data-skip]");
 const ranges = player.querySelectorAll(".player__slider");
 const fullScreen = player.querySelector(".fullscreen");
 
 /*---------------------------------------Fonksiyonları oluşturma---------------------------------*/ 
 
 function togglePlay() {
	// metodu köşeli parantezler içerisinde string değer ile çağırabiliyoruz.
	video[video.paused ? "play":"pause"]();
 }
 
 function updateButton(){
	//if koşulu ile videonun durumuna göre butondaki içeriği güncelliyor.
	toggle.textContent = this.paused ? '►' : '❚ ❚' ;
 }
 
 function skip(){
	/* html kısmında butonun dataset kısmına skip özelliği ekleyip o özelliğe ileri için 25, 
		geri butonu için 10sn eklenmişti. Bu dataset sayesinde elementin içerisinde butonun 
		işlev yapacağı değer bir enum gibi ekleniyor ve fonksiyon içerisinde this.dataset.skip yazarak
		o değere erişebiliyoruz. Böylece hem ileri hemde geri için ayrı ayrı fonksiyon yapmaya gerek kalmıyor. */ 
	video.currentTime += parseFloat(this.dataset.skip);
 }
 
 function handleRangeUpdate(){
	/*html kısmında ranger elementlerine bu metodların isimleri verildi. Bu sayede metod hangi element için
		çağırıldı ise this.name o elementin name değerini veriyor ve name ise aslında o elementin jsdeki metodunun adı
		yani ses çubuğun için video[this.name] demek video[volume]  oluyor ve volume metodunu çağırıp this.value ile rangerin 
		değerini yanstıyor. Köşeli parantez ile metod çağırdığımız için hem volume hemde playBackRate için ayrı ayrı metod 
		oluşturmaya gerek kalmıyor */ 
	video[this.name]= this.value;
 }
 
 function handleProgress(){
	/*video çubuğu flexBasis özelliği özeründen % oranı ile gösterildiğinden  (zaman/toplam zaman) * 100
	  bize mevcut zamanın yüzdesel değeriini veriyor ve bunuda flexBasis' e veriyoruz.*/
	const percent = (video.currentTime / video.duration) * 100;
	progressBar.style.flexBasis = percent+"%";
 }
 
 function scrub(e){
	/*offsetX element içerisinde, element başlangıcından kaç piksel sağa tıkladığımızı 
		veriyor offsetWidth ise toplam genişliğini  seçilen boyut ile toplam element boyutu bölündükten sonra
		video süresi ile çarpılır ise seçilen boyutun videonun ne kadar zamana denk  geldiğini hesaplamış oluruz. */
	const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
	video.currentTime = scrubTime;
 }
 
 /*-----------------------------------------------------------EventListenerleri bağlama -----------------------------------------------*/ 
 
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));

/*burda yine flag yapısını kullanıp videoyu sardırırken tıklanıyormu diye bu değişkeni kullanıyoruz
   Çünkü mousemove metodu mausenin tıklanmış olmasını kontrol etmiyor */
let mousedown = false; 
progress.addEventListener('click', scrub);
//mousedown && scrub(e) yapısı if yapısının kısaltılmışı Eğer mousedown true ise scrub çağırılır, değil ise çağırılmaz.
progress.addEventListener('mousemove', (e)=> mousedown && scrub(e) );
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

fullScreen.addEventListener('click',() => { 
	video.webkitRequestFullScreen();
 } );
	
