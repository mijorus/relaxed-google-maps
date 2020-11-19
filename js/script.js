document.addEventListener('DOMContentLoaded', function () 
{
    function replaceStatus(target) {
        target.classList.replace('offline', 'online')
        target.innerText = 'Loaded'
    }

    document.getElementById('gmap').addEventListener('relaxedMapLoad', (event) => {
        console.log('Map Loaded')
        replaceStatus(document.getElementById('map-1-status'))
    })

    // Place the event listener before calling the function, otherwise you 
    // could miss the event

    document.getElementById('gmapp').addEventListener('relaxedMapLoad', (event) => {
        console.log('Map n#2 Loaded')
        replaceStatus(document.getElementById('map-2-status'))
    })

    document.getElementById('gmappp').addEventListener('relaxedMapLoad', (event) => {
        console.log('Map n#3 Loaded')
        replaceStatus(document.getElementById('map-3-status'))
    })
})

