import HappyNewYear from '../../assets/music/HappyNewYear.mp3';
import WaveSurfer from 'wavesurfer.js';
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import useIconUtils from '../../utils/useIconUtils';

const AudioWaveSurfer = ({ audio }) => {
    // Sử dụng để lưu trữ đối tượng WaveSurfer được tạo bởi thư viện wavesurfer.js. 
    // Đối tượng WaveSurfer này được sử dụng để tạo và quản lý sóng âm thanh, cũng như điều khiển phát/pause của âm thanh.
    const wavesurfer = useRef(null);
    // wavesurferRef được sử dụng để định vị vị trí mà WaveSurfer sẽ render vào trên giao diện người dùng.
    const wavesurferRef = useRef(null);
    const { PauseButton, PlayButton } = useIconUtils();
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayPause = () => {
        wavesurfer.current.playPause();
    };

    useEffect(() => {
        wavesurfer.current = WaveSurfer.create({
            container: wavesurferRef.current,
            waveColor: 'violet',
            progressColor: 'purple',
            barWidth: 3,
            cursorWidth: 1,
            height: 100,
            barGap: 2,
            url: HappyNewYear,
        });
        wavesurfer.current.load(audio);
        return () => wavesurfer.current.destroy();
    }, [audio]);

    useEffect(() => {
        wavesurfer.current.on('play', () => setIsPlaying(true));
        wavesurfer.current.on('pause', () => setIsPlaying(false));
        wavesurfer.current.on('finish', () => setIsPlaying(false));
    }, []);
    return (
        <div className='flex flex-row items-center gap-5'>
            {isPlaying == false &&
                <div onClick={handlePlayPause}>
                    <PlayButton></PlayButton>
                </div>
            }
            {isPlaying == true &&
                <div onClick={handlePlayPause}>
                    <PauseButton></PauseButton>
                </div>
            }
            <div className='min-w-[200px] w-full' ref={wavesurferRef} />
        </div>
    )
};

AudioWaveSurfer.propTypes = {
    audio: PropTypes.string.isRequired,
};

export default AudioWaveSurfer;