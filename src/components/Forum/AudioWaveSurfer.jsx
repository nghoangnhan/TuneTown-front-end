// import HappyNewYear from '../../assets/music/HappyNewYear.mp3';
import WaveSurfer from 'wavesurfer.js';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import useIconUtils from '../../utils/useIconUtils';
import { useMusicAPIUtils } from "../../utils/useMusicAPIUtils";

const AudioWaveSurfer = ({ song, mp3Link }) => {
    // Sử dụng để lưu trữ đối tượng WaveSurfer được tạo bởi thư viện wavesurfer.js. 
    // Đối tượng WaveSurfer này được sử dụng để tạo và quản lý sóng âm thanh, cũng như điều khiển phát/pause của âm thanh.
    const wavesurfer = useRef(null);
    // wavesurferRef được sử dụng để định vị vị trí mà WaveSurfer sẽ render vào trên giao diện người dùng.
    const wavesurferRef = useRef(null);
    const { PauseButton, PlayButton } = useIconUtils();
    const [isPlaying, setIsPlaying] = useState(false);
    const { combineData } = useMusicAPIUtils();
    const [audio, setAudio] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const getAudioSrc = async () => {
        try {
            let data = '';
            if (!song) {
                console.log("!song");
                data = await combineData(-1);
            }
            else {
                data = await combineData(song.id);
            }
            console.log(data);
            const audioBlob = new Blob([data], { type: 'audio/mp3' });
            const audioURL = URL.createObjectURL(audioBlob);
            setAudio(audioURL);
        } catch (error) {
            console.error("Error combining audio data:", error);
        } finally {
            setIsLoading(false); // Set loading state to false when data fetching completes
        }
    }


    const handlePlayPause = () => {
        wavesurfer.current.playPause();
    };

    useEffect(() => {
        if (!audio) {
            getAudioSrc();
        }
    }, [audio]);

    useEffect(() => {
        if (!audio || isLoading) return;
        wavesurfer.current = WaveSurfer.create({
            container: wavesurferRef.current,
            waveColor: "#6aca72",
            progressColor: "#00cc00",
            barWidth: 1.7,
            cursorWidth: 0.2,
            height: 45,
            barGap: 3,
            url: audio,
        });
        wavesurfer.current.load(audio);
        return () => wavesurfer.current.destroy();
    }, [audio, isLoading]);

    useEffect(() => {
        if (!audio || isLoading) return;

        wavesurfer.current.load(audio);
        wavesurfer.current.on('play', () => setIsPlaying(true));
        wavesurfer.current.on('pause', () => setIsPlaying(false));
        wavesurfer.current.on('finish', () => setIsPlaying(false));
        return () => {
            // Cleanup function to stop audio playback when component unmounts
            wavesurfer.current.stop();
            setIsPlaying(false);
            wavesurfer.current.destroy();
        };
    }, [audio, isLoading]);

    useEffect(() => {
        if (mp3Link != null) {
            setAudio(mp3Link);
        }
    }, [mp3Link]);
    return (
        <div className='flex flex-row items-center gap-5'>
            {isLoading ? ( // Render loading indicator if still loading
                <div>
                    <img src="/src/assets/img/logo/logo.png" alt="Loading..." width={50} height={50} className="zoom-in-out" />
                    <span>Generating song data...</span>
                </div>
            ) : (
                <>
                    {isPlaying ? (
                        <div onClick={handlePlayPause}>
                            <PauseButton />
                        </div>
                    ) : (
                        <div onClick={handlePlayPause}>
                            <PlayButton />
                        </div>
                    )}
                    <div className='min-w-[200px] w-full' ref={wavesurferRef} />
                </>
            )}
        </div>
    )
};

AudioWaveSurfer.propTypes = {
    song: PropTypes.shape({
        id: PropTypes.number.isRequired,
    }),
    mp3Link: PropTypes.string.isRequired,
};

export default AudioWaveSurfer;