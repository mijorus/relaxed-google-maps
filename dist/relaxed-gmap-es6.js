/*!
 * relaxedMap: Lazy load Google Maps with cookie consent placeholder
 * (c) 2020 mijorus, MIT License
 */

function setAttributes(attributes, el) {
    for (const a in attributes) {
        el.setAttribute(a, attributes[a])
    }
}

function inViewport(el) {
    const map = el.getBoundingClientRect();
    return map.top <= (window.innerHeight || document.documentElement.clientHeight)
};

function checkData(param, target, value) {
    if (param !== undefined || (target.dataset !== undefined && target.dataset[`${value}`] !== undefined)) {
        return ((param) ? param : target.dataset[`${value}`])
    } else {
        return undefined
    }
}

const relaxedMap = function (config = {
    target: 'gmap',
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
}, cookieStatus = false) {
    const relaxedGMap = document.getElementById(config.target)
    relaxedGMap.classList.add('relaxed-map')

    var iframe;
    if (relaxedGMap.querySelector('iframe')) {
        iframe = relaxedGMap.querySelector('iframe')
    } else {
        //We can proceed and create the iframe
        const defaultMapStyle = 'width: 600px; height: 450px; frameborder: 0; border:0;'

        const iframeAttr = {
            'allowfullscreen': 'false',
            'aria-hidden': 'false',
            'tabindex': '0',
            'style': config.defaultMapStyle ? defaultMapStyle : '',
            'class': 'relaxed-map-iframe',
        }

        iframe = document.createElement('iframe')
        const iframeContainer = document.createElement('div')
        iframeContainer.classList.add('relaxed-map-container')
        iframeContainer.style = `overflow: hidden`
        iframeContainer.appendChild(iframe)

        setAttributes(iframeAttr, iframe)
        relaxedGMap.appendChild(iframeContainer)
    }

    if (cookieStatus) {
        const src = checkData(config.src, relaxedGMap, 'src')
        if (!src) {
            console.warn('Warning: map position not set.')
        } else {

            function asyncMapLoad() {
                if (inViewport(relaxedGMap)) {
                    document.removeEventListener('scroll', asyncMapLoad, { passive: true })
                    const link = relaxedGMap.querySelector('.relaxed-map-alt')
                    if (link) link.remove()
                    iframe.style.backgroundImage = ''
                    iframe.style.filter = ''
                    iframe.setAttribute('src', src)

                    const mapLoad = new Event('relaxedMapLoad')
                    relaxedGMap.dispatchEvent(mapLoad)
                }
            }

            if (inViewport(relaxedGMap)) {
                asyncMapLoad()
            } else {
                document.addEventListener('scroll', asyncMapLoad, { passive: true })
            }
        }
    } else {
        //If the user doesn't allow cookies, we can create a placeholder for the map iframe
        relaxedGMap.style.position = 'relative'

        const linkStyle = 'width: 100%; height: 100%; position: absolute; top: 0; display: flex; z-index: 50; justify-content: center; align-items: center; cursor: pointer;'
        const linkAttr = { 'target': '_blank', 'rel': 'noopener', 'style': linkStyle, 'class': 'relaxed-map-alt' }
        const link = document.createElement('a')

        // Shows a warming in the console if the alt param is not given
        const alt = checkData(config.alt, relaxedGMap, 'alt')
        const placeholder = config.placeholder || null
        if (!alt) {
            console.warn('Warning: alternative map link not set')
        } else {
            link.setAttribute('href', alt)


            if (placeholder && placeholder.text) {
                const placeholderText = checkData(placeholder.text, relaxedGMap, 'text')
                link.innerText = placeholderText
            } else {
                const defaultText = 'Open in Google Maps'
                link.innerText = defaultText
            }

            setAttributes(linkAttr, link)
            relaxedGMap.appendChild(link)
        }

        //Setting the placeholder's image cover if any
        if (placeholder && placeholder.backgroundImage) {
            const iframeStyle = `background-image: url("${config.placeholder.backgroundImage}"); background-position: center;`
            iframe.style = iframeStyle

            if (placeholder.blurred === undefined) {
                iframe.style.filter = `blur(3px)`
            } else {
                iframe.style.filter = `blur(${placeholder.blurred}px)`
            }

            if (placeholder.grayscale === undefined || placeholder.grayscale === true) {
                iframe.style.filter += `grayscale(1)`
            }
        } else {
            if (placeholder && placeholder.backgroundColor) {
                iframe.style.backgroundColor = config.placeholder.backgroundColor
            } else {
                iframe.style.backgroundColor = '#e9ecef'
            }
        }

        //Create the subtitle node
        const subtitle = document.createElement('div')
        const subtitleAttr = { 'style': 'text-align: center;', 'class': 'relaxed-map-subtitle' }
        setAttributes(subtitleAttr, subtitle)
        if (placeholder && placeholder.subtitle) {
            subtitle.innerText = config.placeholder.subtitle
        } else {
            const defaultSubtitle = 'Please, accept the cookie policy to use the map'
            subtitle.innerText = defaultSubtitle
        }

        relaxedGMap.appendChild(subtitle)
    }
}

export default relaxedMap
