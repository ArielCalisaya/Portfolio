/* eslint-disable max-len */
import { useEffect } from 'react';
import PropTypes from 'prop-types';

function ScrollSpy({
  className,
  offsetTop,
  autoScrollOffsetTop,
  offsetLeft,
  duration,
  children,
}) {
  let currentChild = 0;
  let scrollSpyNavContainer;
  let viewportWidth;

  useEffect(() => {
    viewportWidth = window.innerWidth;

    if (typeof document !== 'undefined' && viewportWidth <= 768) {
      scrollSpyNavContainer = document.querySelector('.scroll-spy-container');
    }
  });

  const handleAutoScrollX = () => {
    if (scrollSpyNavContainer !== null) {
      scrollSpyNavContainer.scrollTo({
        left: (scrollSpyNavContainer.children.item(currentChild).offsetLeft) - 25,
        behavior: 'smooth',
      });
    }
  };

  const handleAutoScrollY = (targetOffsetTop) => {
    window.scrollTo({
      top: targetOffsetTop + autoScrollOffsetTop,
    });
  };

  useEffect(() => {
    const sourceElements = [];
    const targetElements = [];

    const throttle = (fn, wait = 100) => {
      let timer;
      let time = Date.now();

      return (params) => {
        clearTimeout(timer);

        if (time + wait - Date.now() < 0) {
          fn(params);
          time = Date.now();
        } else {
          timer = setTimeout(fn, wait / 5);
        }
      };
    };

    const isBetween = (curr, next, value) => {
      if (next !== undefined) {
        return value >= Math.min(curr, next) && value < Math.max(curr, next);
      }
      return value >= curr;
    };

    const onScrollHandler = throttle(() => {
      const scrollElement = document.scrollingElement || document.documentElement;

      const center = {
        x: scrollElement.scrollLeft + window.innerWidth / 2,
        y: scrollElement.scrollTop + offsetTop,
      };

      sourceElements.map((source, i) => {
        const target = targetElements[i];
        source.classList.add('tw-inactive');

        const visibleHorizontal = target.offsetLeft >= 0
          && center.x >= target.offsetLeft
          && center.x < target.offsetLeft + target.offsetWidth;

        const visibleVertical = isBetween(target.offsetTop, targetElements[i + 1]?.offsetTop, center.y);

        if (visibleVertical && visibleHorizontal) {
          if (viewportWidth <= 768) {
            return handleAutoScrollX();
          }
          currentChild = i;
          source.classList.remove('tw-inactive');
          return source.classList.add(className);
        }
        return source.classList.remove(className);
      });
    });

    children.map((el) => {
      const href = el.props && el.props.href;
      const self = el.ref && el.ref.current;

      if (!self || !href || href.charAt(0) !== '#') {
        return false;
      }

      const targetElement = href === '#' ? document.body : document.querySelector(href);

      self.addEventListener('click', () => {
        if (targetElement !== undefined || targetElement !== null) {
          handleAutoScrollY(targetElement.offsetTop);
          // window.scrollTo({
          //   top: targetElement.offsetTop + autoScrollOffsetTop,
          // });
        }
        return null;
      });

      if (targetElement) {
        targetElements.push(targetElement);
        sourceElements.push(self);
      }

      return true;
    });

    if (targetElements.length) {
      const ScrollEvent = new Event('scroll');
      window.addEventListener('scroll', onScrollHandler, { passive: true });
      window.dispatchEvent(ScrollEvent);
    }

    return () => {
      window.removeEventListener('scroll', onScrollHandler);
    };
  }, [children, className, duration, offsetTop, autoScrollOffsetTop, offsetLeft, handleAutoScrollX]);

  return children;
}

ScrollSpy.propTypes = {
  className: PropTypes.string,
  offsetTop: PropTypes.number,
  autoScrollOffsetTop: PropTypes.number,
  offsetLeft: PropTypes.number,
  duration: PropTypes.number,
  children: PropTypes.node.isRequired,
};

ScrollSpy.defaultProps = {
  className: 'active',
  offsetTop: 0,
  autoScrollOffsetTop: 0,
  offsetLeft: 0,
  duration: 1000,
};

export default ScrollSpy;
