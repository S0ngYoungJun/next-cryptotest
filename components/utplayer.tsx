import ReactPlayer from "react-player";

export default function musics(){
  return(
    <main>
      <ReactPlayer
      url='https://www.youtube.com/watch?v=xeCsFtwVozo'
      controls={false} 
      playing={true}></ReactPlayer>
    </main>
  )
}