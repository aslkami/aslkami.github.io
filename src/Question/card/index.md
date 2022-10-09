---
title: SwiperCard
---

```js
// swiper.tsx

import React, { useEffect, useState, useRef } from 'react';
import { View } from '@tarojs/components';
import './swiper.less';
import useRefs from './hooks/useRefs';
import useTouch from './hooks/useTouch';

type PropsSwiper = {
  showIndicatorDot?: boolean;
  children: React.ReactNode;
  swiperOffset?: number;
  onLast?: () => void;
};

export default function Swiper({
  showIndicatorDot = true,
  children,
  swiperOffset = 30,
  onLast = () => {},
}) {
  const [current, setCurrent] = useState(0);
  const [swiperItemRef, setSwiperItemRefs] = useRefs();
  const [cardList, setCardList] = useState<any[]>(children);
  const [removeCardList, setRemoveCardList] = useState<any[]>([]);
  const touch = useTouch();
  const isAnimating = useRef(false);

  const onTouchStart = (e) => {
    touch.start(e);
  };

  const onTouchMove = (e) => {
    e.preventDefault();
    touch.move(e);
    // const delta = touch.getDelta().deltaX;
    // swiperItemRef[0].translateX(delta);
  };

  const onTouchEnd = () => {
    const { deltaX, deltaY } = touch.end();
    if (Math.abs(deltaY) >= swiperOffset + 20) return;
    if (Math.abs(deltaX) <= swiperOffset) return;

    if (deltaX < -swiperOffset) {
      if (cardList.length > 1) {
        onNext();
      } else {
        onLast?.();
      }
    } else {
      if (removeCardList.length > 0) {
        onPrev();
      }
    }
  };

  const onPrev = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    swiperItemRef.forEach((item) => item?.clearClass());

    requestAnimationFrame(() => {
      let lastRemoveCard = removeCardList.pop();
      lastRemoveCard = React.cloneElement(lastRemoveCard, {
        className: 'first-reverse',
      });
      swiperItemRef[0]?.addClass('second-reverse');
      swiperItemRef[1]?.addClass('third-reverse');
      cardList.unshift(lastRemoveCard);
      new Promise((resolve) => {
        setTimeout(() => {
          setCurrent(current - 1);
          setCardList([...cardList]);
          setRemoveCardList([...removeCardList]);
          isAnimating.current = false;
          resolve('reset');
        }, 550);
      });
    });
  };

  const onNext = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    swiperItemRef.forEach((item) => item?.clearClass());

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          swiperItemRef[0]?.addClass('first');
          swiperItemRef[1]?.addClass('second');
          swiperItemRef[2]?.addClass('third');
          new Promise((resolve) => {
            setTimeout(() => {
              setCurrent(current + 1);
              const removeCard = cardList.shift();
              removeCardList.push(removeCard);
              setRemoveCardList([...removeCardList]);
              setCardList([...cardList]);
              isAnimating.current = false;
              swiperItemRef.forEach((item) => item?.clearClass());
              resolve('reset');
            }, 550);
          });
        });
      });
    });
  };

  return (
    <>
      <View
        className="swiper-container"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        catchMove
      >
        {React.Children.map(cardList, (item, index) => {
          return React.cloneElement(item, {
            style: {
              color: 'white',
            },
            ref: setSwiperItemRefs(index),
            sourceIndex: index,
          });
        })}
      </View>
      <View onClick={onPrev}>上一张</View>
      <View onClick={onNext}>下一张</View>
    </>
  );
}
```

```js
// swiper-item

import { View } from '@tarojs/components';
import React, { useImperativeHandle, useRef } from 'react';

type PropsSwiperItem = {
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
};

const SwiperItem = React.forwardRef<any, PropsSwiperItem>((props, ref) => {
  const { children, style, className } = props;
  const itemRef = useRef<any>();

  useImperativeHandle(ref, () => {
    return {
      addClass(classname) {
        itemRef.current.classList.add(classname);
      },
      clearClass() {
        if (itemRef.current) {
          const classList = ['first', 'second', 'third'];
          classList.forEach((name) => {
            if (itemRef.current.classList.contains(name)) {
              itemRef.current.classList.remove(name);
            }
            if (itemRef.current.classList.contains(name + '-reverse')) {
              itemRef.current.classList.remove(name + '-reverse');
            }
          });
        }
      },
      translateX(offset) {
        itemRef.current.style.transform = `translateX(${offset}px)`;
      },
    };
  });

  return (
    <View className={`swiper-item-container ${className}`} ref={itemRef} style={style}>
      {children}
    </View>
  );
});

export default SwiperItem;
```

```less
.swiper-container {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  perspective: 1400px;
  perspective-origin: 300% 50%;
  pointer-events: none;
  touch-action: auto;

  .swiper-item-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
        user-select
    user-select: none;
    pointer-events: auto;
  }

  .swiper-item-container.moveNext {
    transform: translateX(-100%);
    transition: all 0.5s ease;
  }

  .swiper-item-container:nth-child(1) {
    z-index: 3;
    transform: translateX(0);
    opacity: 1;
  }
  .swiper-item-container:nth-child(2) {
    z-index: 2;
    transform: scale(0.9) translate3d(0, 0, -50px);
    opacity: 1;
  }
  .swiper-item-container:nth-child(3) {
    z-index: 1;
    transform: scale(0.8) translate3d(0, 0, -100px);
    opacity: 1;
  }

  .swiper-item-container.first {
    // transform: translateX(-100%);
    // transition: all 0.8s linear;
    // z-index: -1;
    animation: first 0.5s linear;
  }
  .swiper-item-container.first-reverse {
    animation: first 0.2s ease-in reverse;
  }

  @keyframes first {
    from {
      transform: translateX(0);
    }
    to {
      z-index: 9;
      transform: translateX(-100%);
    }
  }

  .swiper-item-container.second {
    // transition: all 0.8s linear;
    // transform: scale(1) translate3d(0, 0, 0);
    // z-index: 3;
    animation: second 0.5s ease forwards;
  }
  .swiper-item-container.second-reverse {
    animation: second 0.5s linear forwards reverse;
  }

  @keyframes second {
    from {
      z-index: 2;
      transform: scale(0.9) translate3d(0, 0, -50px);
    }
    to {
      z-index: 3;
      transform: scale(1) translate3d(0, 0, 0);
    }
  }

  .swiper-item-container.third {
    // transition: all 0.8s linear;
    // transform: scale(0.9) translate3d(0, 0, -50px);
    // z-index: 2;
    animation: third 0.5s ease forwards;
  }
  .swiper-item-container.third-reverse {
    animation: third 0.5s linear forwards reverse;
  }

  @keyframes third {
    from {
      z-index: 1;
      transform: scale(0.8) translate3d(0, 0, -100px);
    }
    to {
      z-index: 2;
      transform: scale(0.9) translate3d(0, 0, -50px);
    }
  }
}
```

```js
// /hooks/useTouch.ts

import { useRef } from 'react';

const useTouch = () => {
  const startX = useRef < number > 0;
  const startY = useRef < number > 0;
  const deltaX = useRef < number > 0;
  const deltaY = useRef < number > 0;
  const time = useRef < number > 0;

  const reset = () => {
    startX.current = 0;
    startY.current = 0;
    deltaX.current = 0;
    deltaY.current = 0;
    time.current = 0;
  };

  const start = (event: React.TouchEvent | TouchEvent) => {
    reset();
    time.current = new Date().getTime();
    startX.current = event.touches[0].clientX;
    startY.current = event.touches[0].clientY;
  };

  const move = (event: React.TouchEvent | TouchEvent) => {
    if (!time.current) return;
    deltaX.current = event.touches[0].clientX - startX.current;
    deltaY.current = event.touches[0].clientY - startY.current;
  };

  const end = () => {
    const tempDeltaX = deltaX.current;
    const tempDeltaY = deltaY.current;
    const timediff = new Date().getTime() - time.current;
    reset();
    return {
      deltaX: tempDeltaX,
      deltaY: tempDeltaY,
      time: timediff,
    };
  };

  const getDelta = () => {
    return {
      deltaX: deltaX.current,
      deltaY: deltaY.current,
    };
  };

  return {
    move,
    start,
    end,
    getDelta,
  };
};

export default useTouch;
```

```js
// /hooks/useRefs.ts

import { useRef } from 'react';

const useRefs = <T = any>(): [typeof refs.current, (index: number) => (el: T) => void] => {
  const refs = useRef<T[]>([]);

  const setRefs = (index: number) => (el: T) => {
    refs.current[index] = el;
  };

  return [refs.current, setRefs];
};

export default useRefs;
```
