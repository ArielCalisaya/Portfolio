/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
import { forwardRef, useEffect } from 'react';

function Canvas({ style }, ref) {
  const { current } = ref;
  const onWindowResize = () => {
    current.style.height = style.height;
    current.style.width = style.width;
  };

  useEffect(() => {
    window.addEventListener('resize', onWindowResize);
    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  return (
    <canvas ref={ref} height={style?.height || '100%'} width={style?.width || '100%'} style={style} />
  );
}

export default forwardRef(Canvas);
