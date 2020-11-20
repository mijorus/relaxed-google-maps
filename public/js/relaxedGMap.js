/*!
 * relaxedMap: Lazy load Google Maps with cookie consent placeholder
 * (c) 2020 mijorus, MIT License
 */
'use strict'

function setAttributes(attributes, el) {
    for (const a in attributes) {
        el.setAttribute(a, attributes[a])
    }
}

function inViewport(el) {
    const map = el.getBoundingClientRect();
    
    if (map.top <= (window.innerHeight || document.documentElement.clientHeight)) {
        return true
    } else {
        return false
    }
}

function checkData(param, target, value) {
    if (param !== undefined || (target.dataset !== undefined && target.dataset[`${value}`] !== undefined)) {
        return ((param) ? param : target.dataset[`${value}`])
    } else {
        return undefined
    }
}

const RelaxedMap = class {
    constructor (target = 'gmap', config = {
        src: '',
        alt: '',
        defaultMapStyle: false,
        placeholder: {
            text: undefined,
            subtitle: undefined,
            backgroundImage: undefined,
            backgroundColor: undefined,
            blurred: 3,
            grayscale: true,
        }
    }) {
        this.relaxedGMap = document.getElementById(target)
        this.config = config

        this.relaxedGMap.classList.add('relaxed-map')

        this.iframe;
        if (this.relaxedGMap.querySelector('iframe')) {
            this.iframe = this.relaxedGMap.querySelector('iframe')
        } else {
            this.createIframe()
        }

        return this
    }

    createIframe() {
        //We can proceed and create the iframe
        const defaultMapStyle = 'width: 600px; height: 450px; frameborder: 0; border:0;'

        const iframeAttr = {
            'allowfullscreen': 'false',
            'aria-hidden': 'false',
            'tabindex': '0',
            'style': this.config.defaultMapStyle ? defaultMapStyle : '',
            'class': 'relaxed-map-iframe',
        }

        this.iframe = document.createElement('iframe')
        const iframeContainer = document.createElement('div')
        iframeContainer.classList.add('relaxed-map-container')
        iframeContainer.style = `overflow: hidden`
        iframeContainer.appendChild(this.iframe)

        setAttributes(iframeAttr, this.iframe)
        this.relaxedGMap.appendChild(iframeContainer)
    }

    unloaded() {
        //If the user doesn't allow cookies, we can create a placeholder for the map iframe
        this.relaxedGMap.style.position = 'relative'

        const linkStyle = 'width: 100%; height: 100%; position: absolute; top: 0; display: flex; z-index: 50; justify-content: center; align-items: center; cursor: pointer;'
        const linkAttr = { 'target': '_blank', 'rel': 'noopener', 'style': linkStyle, 'class': 'relaxed-map-alt' }
        const link = document.createElement('a')

        // Shows a warming in the console if the alt param is not given
        const alt = checkData(this.config.alt, this.relaxedGMap, 'alt')
        const placeholder = this.config.placeholder || null
        if (!alt) {
            console.warn('Warning: alternative map link not set')
        } else {
            link.setAttribute('href', alt)


            if (placeholder && placeholder.text) {
                const placeholderText = checkData(placeholder.text, this.relaxedGMap, 'text')
                link.innerText = placeholderText
            } else {
                const defaultText = 'Open in Google Maps'
                link.innerText = defaultText
            }

            setAttributes(linkAttr, link)
            this.relaxedGMap.appendChild(link)
        }

        //Setting the placeholder's image cover if any
        if (placeholder && placeholder.backgroundImage) {
            const iframeStyle = `background-image: url("${this.config.placeholder.backgroundImage}"); background-position: center;`
            this.iframe.style = iframeStyle

            if (placeholder.blurred === undefined) {
                this.iframe.style.filter = `blur(3px)`
            } else {
                this.iframe.style.filter = `blur(${placeholder.blurred}px)`
            }

            if (placeholder.grayscale === undefined || placeholder.grayscale === true) {
                this.iframe.style.filter += `grayscale(1)`
            }
        } else {
            if (placeholder && placeholder.backgroundColor) {
                this.iframe.style.backgroundColor = this.config.placeholder.backgroundColor
            } else {
                this.iframe.style.backgroundColor = '#e9ecef'
            }
        }

        //Create the subtitle node
        const subtitle = document.createElement('div')
        const subtitleAttr = { 'style': 'text-align: center;', 'class': 'relaxed-map-subtitle' }
        setAttributes(subtitleAttr, subtitle)
        if (placeholder && placeholder.subtitle) {
            subtitle.innerText = this.config.placeholder.subtitle
        } else {
            const defaultSubtitle = 'Please, accept the cookie policy to use the map'
            subtitle.innerText = defaultSubtitle
        }

        this.relaxedGMap.appendChild(subtitle)

        return this
    }

    

    load() {
        const map = this
        this.src = checkData(this.config.src, this.relaxedGMap, 'src')
        function asyncMapLoad() {
            if (inViewport(map.relaxedGMap)) {
                document.removeEventListener('scroll', asyncMapLoad, { passive: true })
                const link = map.relaxedGMap.querySelector('.relaxed-map-alt')
                if (link) link.remove()
                map.iframe.style.backgroundImage = ''
                map.iframe.style.filter = ''
                map.iframe.setAttribute('src', map.src)

                const mapLoad = new Event('relaxedMapLoad')
                map.relaxedGMap.dispatchEvent(mapLoad)
            }
        }

        if (!this.src) {
            console.warn('Warning: map position not set.')
        } else {
            if (inViewport(this.relaxedGMap)) {
                asyncMapLoad()
            } else {
                document.addEventListener('scroll', asyncMapLoad, { passive: true })
            }
        }
    }

    
}

export default RelaxedMap