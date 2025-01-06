console.log('lets write some javascript')
let currentSong = new Audio()
let songs;
let currFolder;

function formatTime(totalSeconds) {
    // if(isNaN(seconds)||seconds<0){
    //     return "00:00"
    // }
    const minutes = Math.floor(totalSeconds / 60); // Calculate minutes
    const seconds = Math.floor(totalSeconds % 60); // Calculate seconds

    // Add leading zeros to minutes and seconds
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs(folder) {
    currFolder=folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text()
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")


    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }

     //show all the songs in the playlist
     let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
     songUL.innerHTML=""
     for (const song of songs) {
         songUL.innerHTML = songUL.innerHTML + `
           <li><img class="invert" src="music.svg" alt="">
                             <div class="info">
                                 <div>${song.replaceAll("%20", " ")}</div>
                                 <div>Sumant</div>
                             </div>
                             <div class="playnow">
                                 <span>Play now</span>
                                 <img class="invert" src="pause.svg" alt="">
                             </div>
                         
         </li>`;
     }
     //attach an event listener to each songs
     Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
         e.addEventListener("click", element => {
             console.log(e.querySelector(".info").firstElementChild.innerHTML)
             playMusic(e.querySelector(".info").firstElementChild.innerHTML)
         })
     })
}
const playMusic = (track, pause = false) => {
    // let audio=new Audio("/Songs/" + track)
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src="play.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
    
}

async function main() {
    //list all the songs
     await getSongs("songs/cs")
    playMusic(songs[0], true)
    console.log(songs)

    //display all the songs on the page
    // displayAlbums()
  

    //attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "play.svg"
        }
        else {
            currentSong.pause()
            play.src = "pause.svg"
        }
    })
    //add event listener for timeupdate
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".CircleSeek").style.left=(currentSong.currentTime/currentSong.duration)*100+"%";  
    })
    //add event listener to Circleline
    document.querySelector(".circleline").addEventListener("click",(e)=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
       document.querySelector(".CircleSeek").style.left=percent+"%";
       currentSong.currentTime=((currentSong.duration)*percent)/100;
    })
    //add event listener to hambargar
    document.querySelector(".hambarger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0px"
    })
    //add event listener to close the left
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-389px"
    })
    //add event listener to previous and next
    previous.addEventListener("click",()=>{
        console.log("Next clicked")
        console.log("Previous clicked")

       let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(songs,index,length)
        if ((index-1)>=0){
            playMusic(songs[index-1])
        }
    })
     //add event listener to previous and next
    next.addEventListener("click",()=>{
        currentSong.pause()
        console.log("Next clicked")

        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(songs,index,length)
        if ((index+1)<songs.length){
            playMusic(songs[index+1])
        }
    })

    //add event listener to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log(e,e.target,e.target.value)
        currentSong.volume=parseInt(e.target.value)/100
    })
    
    //add event listener whenenver we want to load the playlists
    Array.from(document.getElementsByClassName("image")).forEach(e=>{
        console.log(e)
        e.addEventListener("click",async item=>{
            console.log(item,item.currentTarget.dataset)
            songs=await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })
}
main()
