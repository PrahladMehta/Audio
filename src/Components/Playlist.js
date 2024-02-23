function Playlist(props) {
  const allAudio = props.allAudio;
  const setCurrAudio = props.setCurrAudio;
  // const currAudio = props.currAudio;
  const setIsPlaying = props.setIsPlaying;

  return (
    <div className=" flex flex-col gap-7 w-full pr-1">
      <h1 className="text-5xl text-center">PlayList</h1>

      <div className="w-full h-[230px] border-y-2 border-x-2 border-x-[#06d6a0] border-y-[#06d6a0] overflow-y-scroll cursor-pointer ">
        {allAudio.map((audio) => {
          return (
            <div
              key={audio.id}
              onClick={() => {
                setCurrAudio(audio.id - 1);
                setIsPlaying(true);
              }}
              className="flex justify-between gap-x-16 p-1 px-5 border-b-2 border-b-[#86f3d6c7]"
            >
              <div>{audio.id}</div>
              <div>{audio.name}</div>
              <div></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Playlist;
