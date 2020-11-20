// Real world example
import RelaxedMap from './js/relaxedGMap.js'
document.addEventListener('DOMContentLoaded', function () 
{
    const location = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d158858.182370726!2d-0.10159865000000001!3d51.52864165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondra%2C%20Regno%20Unito!5e0!3m2!1sit!2sit!4v1605344840356!5m2!1sit!2sit'

    const alternativeLink = 'https://www.google.com/maps/place/Londra,+Regno+Unito/@51.5286416,-0.1015987,11z/data=!3m1!4b1!4m5!3m4!1s0x47d8a00baf21de75:0x52963a5addd52a99!8m2!3d51.5073509!4d-0.1277583'

    //First map
    new RelaxedMap('gmap', {
        src: location
    }).load()

    //Second map
    if (sessionStorage.getItem('cookie') === null) {
        sessionStorage.setItem('cookie', 'false')
    }

    const mapConfig = {
        src: location,
        alt: alternativeLink,
        placeholder: {
            subtitle: 'Come on dude, accept the cookies',
            backgroundImage: 'img/london.jpg',
        }
    }

    const secondMap = new RelaxedMap('gmapp', mapConfig)
    function cookieConsent(event) {
        event.target.removeEventListener('click', cookieConsent)
        secondMap.load()
    }

    if (sessionStorage.getItem('cookie') === 'true') {
        secondMap.load()
    } else if (sessionStorage.getItem('cookie') === 'false') {
        secondMap.unloaded()
        document.getElementById('gmapp-cookie-accept')
            .addEventListener('click', cookieConsent)
    }

    //Third map
    const thirdMap = new RelaxedMap('gmappp', {
        alt: 'https://www.here.com'
    }).unloaded()

    function anotherCookieConsent(event) {
        event.target.removeEventListener('click', anotherCookieConsent)
        thirdMap.load()
    }

    document.getElementById('gmappp-cookie-accept')
        .addEventListener('click', anotherCookieConsent)
})