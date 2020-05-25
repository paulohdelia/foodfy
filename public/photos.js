const PhotosUpload = {
    input: '',
    preview: document.querySelector('#photos'),
    uploadLimit: 5,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target;
        PhotosUpload.input = event.target;
        
        if (PhotosUpload.hasLimit(event)) return

        Array.from(fileList).forEach( file => {

            PhotosUpload.files.push(file)

            const reader = new FileReader();

            reader.onload = () => {
                const image = new Image();
                image.src = String(reader.result);

                const div = PhotosUpload.getDivImage(image);

                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file);
        });

        PhotosUpload.input.files = PhotosUpload.getAllFiles();
    },
    hasLimit(event) {
        const { uploadLimit, input, preview} = PhotosUpload;
        const { files: fileList } = input;

        if(fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault();
            return true;
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == 'photo') {
                photosDiv.push(item);
            }
        });

        const totalPhotos = fileList.length + photosDiv.length;
        if (totalPhotos > uploadLimit) {
            alert('Você atingiu o limite máximo de fotos')
            event.preventDefault();
            return true;
        }

        return false;
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer();

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file));

        return dataTransfer.files;
    },
    getDivImage(image) {
        const div = document.createElement('div');
            div.classList.add('photo');

            div.onclick = PhotosUpload.removePhoto;

            div.appendChild(image);

            div.appendChild(PhotosUpload.getRemoveButton());

            return div;
    },
    getRemoveButton() {
        const button = document.createElement('i');
        button.classList.add('material-icons');
        button.innerHTML = "close"
        return button;
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode;
        const photosArray = Array.from(PhotosUpload.preview.children);
        const index = photosArray.indexOf(photoDiv);

        PhotosUpload.files.splice(index, 1);
        PhotosUpload.input.files = PhotosUpload.getAllFiles();

        photoDiv.remove();
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode;

        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"');
            if(removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove();
    }
}

const AvatarUpload = {
    input: '',
    preview: document.querySelector('#avatar-preview'),
    uploadLimit: 1,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target;
        AvatarUpload.input = event.target;
        
        if (AvatarUpload.hasLimit(event)) return

        Array.from(fileList).forEach( file => {

            AvatarUpload.files.push(file)

            const reader = new FileReader();

            reader.onload = () => {
                const image = new Image();
                image.src = String(reader.result);

                const div = AvatarUpload.getDivImage(image);

                AvatarUpload.preview.appendChild(div);
                AvatarUpload.preview.classList.add('on');
            }

            reader.readAsDataURL(file);
        });

        AvatarUpload.input.files = AvatarUpload.getAllFiles();
    },
    hasLimit(event) {
        const { uploadLimit, input, preview} = AvatarUpload;
        const { files: fileList } = input;

        if(fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault();
            return true;
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList == 'photo') {
                photosDiv.push(item);
            }
        });

        const totalPhotos = fileList.length + photosDiv.length;
        if (totalPhotos > uploadLimit) {
            alert('Você atingiu o limite máximo de fotos')
            event.preventDefault();
            return true;
        }

        return false;
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer();

        AvatarUpload.files.forEach(file => dataTransfer.items.add(file));

        return dataTransfer.files;
    },
    getDivImage(image) {
        const div = document.createElement('div');
            div.classList.add('photo');

            div.onclick = AvatarUpload.removePhoto;

            div.appendChild(image);
            div.appendChild(AvatarUpload.getRemoveButton());

            return div;
    },
    getRemoveButton() {
        const button = document.createElement('i');
        button.classList.add('material-icons');
        button.innerHTML = "close"
        return button;
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode;
        const photosArray = Array.from(AvatarUpload.preview.children);
        const index = photosArray.indexOf(photoDiv);

        AvatarUpload.files.splice(index, 1);
        AvatarUpload.input.files = AvatarUpload.getAllFiles();

        photoDiv.remove();
        AvatarUpload.preview.classList.remove('on');
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode;
        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]');
            if(removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove();
    }
}

