import React, { useState, useEffect, useRef } from "react";
import uniqid from "uniqid";
import addMusic from "../../public/add-music.svg";
import thumbnail from "../../public/thumbnail.svg";
import { SiYoutubemusic } from "react-icons/si";
import { TiDeleteOutline } from "react-icons/ti";

const Player = () => {
  const [playlist, setPlaylist] = useState(() => {
    const storedPlaylist = JSON.parse(localStorage.getItem("playlist")) || [];
    return storedPlaylist;
  });
  const [currentTrack, setCurrentTrack] = useState(() => {
    const lastTrack = JSON.parse(localStorage.getItem("currentTrack")) || null;
    return lastTrack;
  });
  const [isLoading, setIsLoading] = useState(false);
  const audioPlayerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("playlist", JSON.stringify(playlist));
  }, [playlist]);

  useEffect(() => {
    localStorage.setItem("currentTrack", JSON.stringify(currentTrack));
  }, [currentTrack]);

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const newTracks = Array.from(files).map((file) => ({
        id: uniqid("AUD-"),
        name: file.name,
        file: URL.createObjectURL(file),
      }));
      setPlaylist([...playlist, ...newTracks]);
    }
  };

  const handleTrackSelect = (track) => {
    setCurrentTrack(track);
    if (audioPlayerRef.current) {
      setIsLoading(true);
      audioPlayerRef.current.src = track.file;
      audioPlayerRef.current.onloadedmetadata = () => {
        audioPlayerRef.current.play();
        setIsLoading(false);
      };
    }
  };

  const handleAudioEnded = () => {
    const currentIndex = playlist.findIndex(
      (track) => track.id === currentTrack.id
    );
    if (currentIndex < playlist.length - 1) {
      const nextTrack = playlist[currentIndex + 1];
      setCurrentTrack(nextTrack);
      if (audioPlayerRef.current) {
        setIsLoading(true);
        audioPlayerRef.current.src = nextTrack.file;
        audioPlayerRef.current.onloadedmetadata = () => {
          audioPlayerRef.current.play();
          setIsLoading(false);
        };
      }
    } else {
      setCurrentTrack(null); // No more tracks to play
    }
  };

  const handleDeleteTrack = (trackId) => {
    const updatedPlaylist = playlist.filter((track) => track.id !== trackId);
    setPlaylist(updatedPlaylist);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="max-w-screen-md md:max-w-screen-xl border border-[#c9c9c8] shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-opacity-20 backdrop-blur-sm rounded-xl grid md:grid-cols-2 ">
        <div className="order-2 md:order-1 md:w-full flex flex-col pl-3 items-center border-t md:border-r md:border-t-0 border-[#c9c9c8] p-5">
          <h2 className="text-xl font-semibold mb-4">Playlist</h2>
          {playlist.length > 0 ? (
            <ul className="w-full grow mt-5 shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] bg-opacity-20 backdrop-blur-sm py-4 rounded-lg">
              {playlist.map((track) => (
                <li
                  key={track.id}
                  className="hover:bg-[#dcdcdc47] px-3 cursor-pointer py-2 text-sm flex items-center justify-between gap-3"
                  onClick={() => handleTrackSelect(track)}
                >
                  <div className="flex items-center gap-3">
                    <div className="grow-0">
                      <SiYoutubemusic size={30} />
                    </div>
                    <div className="w-[50%] grow has-tooltip">
                      <span class="tooltip rounded shadow-lg p-1 bg-[#05426b] text-[#dddbcb] mt-10 mr-5">
                        {track.name}
                      </span>
                      <span className="whitespace-wrap">
                        {track.name.length > 26
                          ? `${track.name.slice(0, 26)}.....`
                          : track.name}
                      </span>
                    </div>
                  </div>
                  <TiDeleteOutline
                    className="hover:animate-spin"
                    color="#c9c9c8"
                    size={30}
                    onClick={() => handleDeleteTrack(track.id)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <p className="text-gray-500 text-sm">
                Add some tracks in Playlist.
              </p>
            </div>
          )}
          <div className="relative">
            <label
              htmlFor="upload"
              className="hover:bg-[#dcdcdc32] hover:tracking-wide transition-all duration-00 cursor-pointer flex items-center gap-1 border border-[#c9c9c8] mt-5 py-1 px-3 rounded-[60px]"
            >
              <img
                src={addMusic}
                alt="add-music"
                className="w-7 cursor-pointer"
              />
              <span className="text-sm font-semibold">Add Music</span>
            </label>
            <input
              id="upload"
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              multiple
              className="hidden"
            />
          </div>
        </div>
        <div className="order-1 md:order-2 md:w-full p-5 flex flex-col pl-3 items-center gap-5">
          <h2 className="text-xl font-semibold">Now Playing</h2>
          {currentTrack ? (
            <div className="flex flex-col justify-center items-center mt-5 shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] bg-opacity-20 backdrop-blur-sm p-5 rounded-lg w-full">
              <img src={thumbnail} alt="thumbnail" className={`w-[10rem]`} />
              <p className="mt-4 text-center">{currentTrack.name}</p>
              <audio
                className="my-4 w-full"
                ref={audioPlayerRef}
                src={currentTrack.file}
                controls
                autoPlay
                onEnded={handleAudioEnded}
              />
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center gap-5">
              <p className="text-gray-500 text-sm">Select something to play</p>
              {/* <img
                className="w-16"
                src="public/add-any-music.gif"
                alt="image"
              /> */}
            </div>
          )}
          {isLoading && (
            <div className="flex flex-row gap-2">
              <div className="w-4 h-4 rounded-full bg-[##0ce6ea] animate-bounce [animation-delay:.7s]"></div>
              <div className="w-4 h-4 rounded-full bg-[##0ce6ea] animate-bounce [animation-delay:.3s]"></div>
              <div className="w-4 h-4 rounded-full bg-[##0ce6ea] animate-bounce [animation-delay:.7s]"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Player;
