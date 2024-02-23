import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
function Upload(props) {
  const length = props.length;
  const getPlaylist = props.getPlaylist;

  const [audio, setAudio] = new useState();
  const [audioName, setAudioName] = new useState("");

  const idb = window.indexedDB;

  function addAudio(e) {
    if (audio) {
      const request = idb.open("DataBase", 3);

      request.onerror = (e) => {
        console.error("Error in connectivity");
        console.error(e);
      };

      request.onsuccess = (e) => {
        const db = request.result;
        const tx = db.transaction("PlayList", "readwrite");
        const userData = tx.objectStore("PlayList");
        console.log(length + 1);
        const user = userData.put({
          id: length + 1,
          music: audio,
          name: audioName,
        });

        user.onsuccess = () => {
          toast.success("Audio Added");
          tx.oncomplete = () => {
            db.close();
            getPlaylist();
          };
        };

        user.onerror = (err) => {
          console.error(err);
          alert("Error");
        };
      };
    }
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div>
        <Toaster />
      </div>
      <h1 className="text-5xl text-center ">Upload Audio</h1>

      <div className="flex flex-col mt-24 gap-y-10 items-center ">
        {" "}
        <input
          type="file"
          accept=".mp3,audio/*"
          className="cursor-pointer "
          onChange={(e) => {
            const fr = new FileReader();
            fr.readAsDataURL(e.target.files[0]);
            fr.onload = () => {
              setAudio(fr.result);
              console.log(fr.result);
              setAudioName(e.target.files[0].name);
              console.log(typeof e.target.files[0].name);
            };
            // setAudio(e.target.value);
            // console.log(e.target.files);
            // setAudioName(e.target.files[0].name);
            // console.log(typeof e.target.files[0].name);
          }}
        />
        <button
          onClick={addAudio}
          className=" px-3 py-1 bg-[#0096c7] hover:bg-[#0077b6] rounded-lg text-white hover:shadow-lg select-none"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default Upload;
