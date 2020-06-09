var images = ['diplomarbeit_hintergrund_aristoteles.jpg', 'diplomarbeit_hintergrund_augustinus.jpg'];
	$('.zufallsbild').css({'background-image': 'url(https://www.insignicom.de/files/insignicom/news-tech-blog/2018-03/' + images[Math.floor(Math.random() * images.length)] + ')'});
