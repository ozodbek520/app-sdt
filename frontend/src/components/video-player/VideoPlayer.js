import React from 'react';
import YouTube from 'react-youtube';
import styled from 'styled-components';

const StyledDiv = styled.div`
  iframe {
    border-radius: 8px;
  }
`;
const opts = {
  height: '390',
  width: '100%',
  borderRadius: '10px',
};
const VideoPlayer = ({ videoUrl }) => {
  if (!videoUrl || typeof videoUrl !== 'string' || videoUrl.trim() === '') {
    return null;
  }

  try {
    const url = new URL(videoUrl);
    const searchParams = new URLSearchParams(url.search);
    const videoId = searchParams.get('v');

    if (videoId) {
      return (
        <StyledDiv>
          <YouTube videoId={videoId} opts={opts} />
        </StyledDiv>
      );
    } else {
      return <div>No video available</div>;
    }
  } catch (error) {
    return <div>Error loading video</div>;
  }
};

export default VideoPlayer;
