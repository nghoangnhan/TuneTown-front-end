import HappyNewYear from '../../assets/music/HappyNewYear.mp3';
import WaveSurfer from 'wavesurfer.js';
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const AudioWaveSurfer = ({ audio }) => {
    const wavesurfer = useRef(null);
    const wavesurferRef = useRef(null);

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
    return <div ref={wavesurferRef} />;
};

AudioWaveSurfer.propTypes = {
    audio: PropTypes.string.isRequired,
};

export default AudioWaveSurfer;