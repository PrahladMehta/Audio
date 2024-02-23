import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { IoPlayBack } from "react-icons/io5";
function Player(props) {
  const isPlaying = props.isPlaying;
  const setIsPlaying = props.setIsPlaying;
  const title = props.title;
  const currAudioInfo = props.currAudioInfo;
  const currAudio = props.currAudio;
  const setCurrAudio = props.setCurrAudio;
  const length = props.length;

  function prev() {
    if (currAudio !== 0) {
      setCurrAudio((prev) => {
        return prev - 1;
      });
    } else {
      setCurrAudio(length - 1);
    }
  }

  function next() {
    if (currAudio !== length - 1) {
      setCurrAudio((prev) => {
        return prev + 1;
      });
    } else {
      setCurrAudio(0);
    }
  }

  const playPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-[500px] h-[70px] mx-auto mb-3 text-blue-500 flex flex-col gap-y-2">
      <div>
        <p className="text-center">{title}</p>
      </div>

      <div>
        <div className="h-[5px] w-full bg-gray-500">
          <div
            className={` bg-cyan-500 h-full w-[0] my-auto ease-in duration-100`}
            style={{ width: `${currAudioInfo.progress}` + "%" }}
          ></div>
          {}
        </div>
      </div>
      {/* Controler */}
      <div className="flex justify-evenly text-2xl">
        <div onClick={prev} className="cursor-pointer ">
          <IoPlayBack />
        </div>
        <div onClick={playPause} className="cursor-pointer"> {!isPlaying ? <FaPlay /> : <FaPause />}</div>

        <div onClick={next} className="cursor-pointer">
          <TbPlayerTrackNextFilled />
        </div>
      </div>
    </div>
  );
}

export default Player;
