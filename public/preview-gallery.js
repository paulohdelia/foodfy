const ImageGallery = {
    previews: document.querySelectorAll('.card.recipe .preview-gallery img'),
    highlight: document.querySelector('.card.recipe > img'),
    setImage(event) {
        const {target} = event;

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'));
        console.log(this.previews)
        target.classList.add('active');

        ImageGallery.highlight.src = target.src;
    }
}