const axios = require('axios')
const getComponentForEl = require('marko/components').getComponentForEl

function calculateSidebarButtonMode(sectionElements) {
    const buttonSidebarElement = document.querySelector('.button-sidebar')
    buttonSidebarComponent = getComponentForEl(buttonSidebarElement)

    function calculateTopIntersector() {
        const scrollOffset = window.pageYOffset
        const minTopValue = 30 // this is the padding of the button in px
        let currentElement = null

        for(var i = 0; i < sectionElements.length; ++i) {
            const element = sectionElements[i]
            const topValue = element.getBoundingClientRect().top

            if(topValue <= minTopValue) {
                currentElement = element
            }
        }

        if(currentElement) {
            const darkMode = currentElement.dataset.dark == 'true' | false
            buttonSidebarComponent.setDarkMode(!darkMode)
        }
    }

    const debounce = (cb) => () => window.requestAnimationFrame(cb)
    const handleScroll = debounce(() => {
        calculateTopIntersector()
    })

    window.addEventListener('scroll', handleScroll)
    calculateTopIntersector()
}

function capitalizeFirstLetter(text) {
    if(!text.length) return text
    return text.charAt(0).toUpperCase() + text.slice(1)
}

function convertToHtmlText(text) {
    let htmlText = text
    htmlText = htmlText.replace(/\r\n/g, '<br>')
    htmlText = htmlText.replace(/\n/g, '<br>')
    return htmlText
}

function deleteContent(category, content, component) {
    axios.delete('/' + category, {
        params: {
            id: content._id,
            _csrf: component.state.csrf
        }
    })
    .then(function (response) {
        if(response.data.code == 0) {
            const contents = component.state.content
            for(var i = 0; i < contents.length; ++i) {
                if(contents[i]._id == content._id) {
                    component.state.content.splice(i, 1)
                    component.setStateDirty('content')
                    return
                }
            }
        }
        console.log(response.data)
    })
    .catch(function (error) {
        console.log(error)
    })
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b
    })

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null
}

function setupDropzone(
    maxMediaCount,
    mediaDropElement,
    messageElement,
    addImagesElement,
    csrf
) {
    function parameterNameDropzone() {
        return 'image'
    }

    function initDropzone() {
        this.on('addedfile', function(file) {
            // Update thumbnail size
            const previews = mediaDropElement.querySelectorAll('.dz-preview')
            const lastPreview = previews[previews.length - 1]
            const widthDivision = maxMediaCount > 5 ? 5 : maxMediaCount

            lastPreview.style.width = (100 / widthDivision) + '%'

            mediaDropElement.insertBefore(addImagesElement, this.children)

            const removeButton = Dropzone.createElement(
                '<a class=\'button-remove\'><span>X</span></a>'
            )
            removeButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                axios.delete('/upload-media', {
                    params: { id: file.upload.uuid }
                })
                .then((response) => {
                    this.removeFile(file)
                })
                .catch((error) => {
                })
            })

            // Add the button to the file preview element.
            file.previewElement.appendChild(removeButton);

            if(this.files.length >= this.options.maxFiles) {
                addImagesElement.classList.add('hidden')
            }
        })

        this.on('removedfile', function(file) {
            if(this.files.length < this.options.maxFiles) {
                addImagesElement.classList.remove('hidden')
            }
        })

        this.on('maxfilesexceeded', function(file) {
            this.removeFile(file)
        })

        this.on('successmultiple', function() {
            const args = Array.prototype.slice.call(arguments);

            for(let i = 0; i < args[1].length; ++i) {
                const fileUploaded = args[1][i]

                for(let j = 0; j < this.files.length; ++j) {
                    if(this.files[j].name == fileUploaded.originalName) {
                        this.files[j].upload.uuid = fileUploaded.fileName;
                    }
                }
            }
        })

        this.on('totaluploadprogress', function(uploadProgress) {
            console.log(uploadProgress)
        })

        this.on('error', function(file, errorMessage) {
            //TODO when server error, what should happen? Popup and remove?
            console.log(errorMessage)
            if (!file.accepted) this.removeFile(file)
        })
    }

    mediaDropElement.classList.add('dropzone')
    messageElement.classList.add('dz-message')
    messageElement.classList.add('dz-default')
    addImagesElement.classList.add('dz-clickable')

    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf

    Sortable.create(mediaDropElement, {
        animation: 150,
        ghostClass: 'ghost',
        chosenClass: 'dragging',
        filter: '.add-image',
        onMove: function (event) {
            return addImagesElement !== event.related;
        }
    })

    Dropzone.autoDiscover = false
    return new Dropzone(mediaDropElement, {
        acceptedFiles: '.png,.jpg,.jpeg',
        autoProcessQueue: true,
        clickable: '.add-image, .dropzone',
        createImageThumbnails: true,
        dictMaxFilesExceeded: 'Maximum upload limit reached',
        headers: { 'x-csrf-token': csrf },
        init: initDropzone,
        maxFiles: maxMediaCount,
        maxFilesize: 20,
        parallelUploads: 10,
        paramName: parameterNameDropzone,
        timeout: 3000000,
        thumbnailHeight: 200,
        thumbnailMethod: 'crop',
        thumbnailWidth: 200,
        uploadMultiple: true,
        url: '/upload-media'
    })
}

exports.calculateSidebarButtonMode = calculateSidebarButtonMode
exports.capitalizeFirstLetter = capitalizeFirstLetter
exports.convertToHtmlText = convertToHtmlText
exports.deleteContent = deleteContent
exports.hexToRgb = hexToRgb
exports.setupDropzone = setupDropzone
