import "./App.css";
import { useEffect, useRef } from "react";
import music1 from "./assests/music1.mp3";
import { useState } from "react";
import Upload from "./Components/Upload";
import Playlist from "./Components/Playlist";
import { Routes, Route, useNavigate } from "react-router-dom";
import { PiMusicNotesPlusThin } from "react-icons/pi";
import { RiPlayListLine } from "react-icons/ri";
import Player from "./Components/Player";

const idb = window.indexedDB;
function App() {
  const [currAudio, setCurrAudio] = new useState(0);
  const [currAudioInfo, setCurrAudioInfo] = new useState({});
  const [allAudio, setAllAudio] = new useState([]);
  const [isPlaying, setIsPlaying] = new useState(false);

  const audioElem = useRef();

  const nav = useNavigate();

  useEffect(() => {
    if (!idb) {
      console.error("Not IndexedDb");
      return;
    }

    const request = idb.open("DataBase", 3);

    request.onerror = (event) => {
      console.log(`Error:${event}`);
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;

      if (!db.objectStoreNames.contains("PlayList")) {
        db.createObjectStore("PlayList", { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      console.log("SuccessFully Run");
      const dbe = request.result;
      const tx = dbe.transaction("PlayList", "readwrite");
      const userData = tx.objectStore("PlayList");

      console.log("music");
      console.log(music1);

      const user = userData.put({
        id: 1,
        music: music1,
        name: "demo music",
      });

      const alldata = userData.getAll();
      alldata.onsuccess = (event) => {
        getPlaylist(event.srcElement.result);
        console.log(event.srcElement.result);
      };

      user.onsuccess = (query) => {
        tx.oncomplete = () => {
          dbe.close();
        };
      };
    };

    if (sessionStorage.getItem("song data") !== null) {
      const info = sessionStorage.getItem("song data");
      console.log(info);
      const data = JSON.parse(info);
      setCurrAudio(data.currAudio);
      setCurrAudioInfo({
        progress: data.progress,
        length: data.length,
        ct: data.ct,
      });
      audioElem.current.currentTime = data.ct;
      console.log("Session Storage");
      console.log(data.progress);
    }
  }, []);

  useEffect(() => {
    if (isPlaying) {
      audioElem.current.play();
    } else {
      audioElem.current.pause();
    }
    
  }, [isPlaying, currAudio]);

  function getPlaylist(e) {
    const request = idb.open("DataBase", 3);

    request.onerror = (e) => {
      console.error("Error in connectivity");
      console.error(e);
    };

    request.onsuccess = (e) => {
      const db = request.result;
      const tx = db.transaction("PlayList", "readonly");
      const userData = tx.objectStore("PlayList");
      const user = userData.getAll();

      user.onsuccess = (query) => {
        setAllAudio(query.srcElement.result);

        console.log("Add Audio Featch from database");
        console.log(allAudio);
      };

      user.onerror = (err) => {
        console.error(err);
        alert("Error");
      };

      tx.oncomplete = () => {
        db.close();
      };
    };
  }

  function onPlaying() {
    const duration = audioElem.current.duration;
    const ct = audioElem.current.currentTime;

    setCurrAudioInfo({
      ...currAudioInfo,
      progress: (ct / duration) * 100,
      length: duration,
      ct: ct,
    });

    const data = {
      currAudio: currAudio,
      progress: (ct / duration) * 100,
      length: duration,
      ct: ct,
    };

    if (data.progress > 99) {
      if (currAudio !== allAudio.length - 1) {
        setCurrAudio((prev) => {
          return prev + 1;
        });
      } else {
        if (allAudio.length === 1) {
          setIsPlaying(false);
        }
        setCurrAudio(0);
      }
    }
   
    sessionStorage.setItem("song data", JSON.stringify(data));
   
  }

  return (
    <div className="h-[100vh] select-none overflow-x-hidden overflow-y-hidden ">
      <div className="flex  h-full bg-blue-50 ">
        {/* Left Section */}
        <div className="w-[10%] h-full text-[#2ec4b6] text-5xl font-extrabold flex flex-col  justify-center items-center gap-y-10 border-r  bg-green-100">
          {" "}
          <div
            className="cursor-pointer "
            onClick={() => {
              nav("/");
            }}
          >
            <PiMusicNotesPlusThin />
          </div>{" "}
          <div onClick={() => nav("/playlist")} className="cursor-pointer">
            <RiPlayListLine />
          </div>{" "}
        </div>

        {/* Right-Section */}

        <div className="w-full relative">
          <Routes>
            <Route
              path="/"
              element={
                <Upload
                  length={allAudio.length}
                  getPlaylist={getPlaylist}
                ></Upload>
              }
            ></Route>
            <Route
              path="/playlist"
              element={
                <Playlist
                  allAudio={allAudio}
                  setCurrAudio={setCurrAudio}
                  currAudio={currAudio}
                  // currAudioInfo={currAudioInfo}
                  setIsPlaying={setIsPlaying}
                ></Playlist>
              }
            ></Route>
          </Routes>

          <div className="absolute bottom-1 left-[20%]">
            <audio
              src={`${allAudio[currAudio]?.music}`}
              ref={audioElem}
              onTimeUpdate={onPlaying}
            ></audio>

            <Player
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              audioElem={audioElem}
              title={allAudio[currAudio]?.name}
              currAudioInfo={currAudioInfo}
              currAudio={currAudio}
              setCurrAudio={setCurrAudio}
              length={allAudio.length}
            ></Player>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
