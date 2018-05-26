  function setDate() {
  
    // saatin 3 kolunada js üzerinden kolayca ulaşabilmek  3 için obje oluşturuldu 
	const secondHand = document.querySelector('.second-hand');
	const minsHand = document.querySelector('.min-hand');
	const hourHand = document.querySelector('.hour-hand');
	
	//Mevcut zamanı barındıran obje oluşturuldu
    const now = new Date();
    const seconds = now.getSeconds();
	
	// +90 derece veriliyor çünkü varsayılan açı -90 derecede 
    const secondsDegrees = ((seconds / 60) * 360) + 90;
    secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
    const mins = now.getMinutes();
    const minsDegrees = ((mins / 60) * 360) + ((seconds/60)*6) + 90;
    minsHand.style.transform = `rotate(${minsDegrees}deg)`;
    const hour = now.getHours();
    const hourDegrees = ((hour / 12) * 360) + ((mins/60)*30) + 90;
    hourHand.style.transform = `rotate(${hourDegrees}deg)`;
  }
  
  //saniye başına setDate metodunu çağırması için setInterval metodunu yazıldı
  setInterval(setDate, 1000);
  setDate();
  
 