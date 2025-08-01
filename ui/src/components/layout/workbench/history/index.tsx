import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import { useAsyncEffect } from 'ahooks';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon, ScanSearch } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Mousewheel, Navigation, Virtual } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useInfiniteWorkflowExecutionAllOutputs } from '@/apis/workflow/execution/output';
import { useVinesTeam } from '@/components/router/guard/team';
import { Button } from '@/components/ui/button';
import { checkImageUrlAvailable } from '@/components/ui/vines-image/utils';
import { VinesWorkflowExecutionOutputListItem } from '@/package/vines-flow/core/typings';
import { useOnlyShowWorkbenchIcon } from '@/store/showWorkbenchIcon';
import { ImagesResult } from '@/store/useExecutionImageResultStore';
import { cn } from '@/utils';
import { newConvertExecutionResultToItemList } from '@/utils/execution';

import { getThumbUrl } from '../../workspace/vines-view/form/execution-result/virtua/item/image';

import 'swiper/css';
import 'swiper/css/mousewheel';
import 'swiper/css/navigation';
import 'swiper/css/virtual';

const SwiperModules = [Virtual, Mousewheel, Navigation];
const SLIDE_THRESHOLD = 10;
interface HistoryResultProps {
  loading: boolean;
  images: ImagesResultWithOrigin[];

  className?: string;
  setSize: Dispatch<SetStateAction<number>>;
}

const HistoryResultInner: React.FC<HistoryResultProps> = ({ loading, images, className, setSize }) => {
  const [slidesPerView, setSlidesPerView] = useState(1);
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const onlyShowWorkbenchIcon = useOnlyShowWorkbenchIcon();
  // 计算 slidesPerView 的函数
  const calculateSlidesPerView = (containerWidth: number) => {
    const slideWidth = 90; // slide width
    const spaceBetween = 10; // space between
    const calculated = Math.floor((containerWidth + spaceBetween) / (slideWidth + spaceBetween));
    return Math.max(1, Math.min(calculated, images?.length || 1));
  };
  // 监听容器宽度变化
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        const newSlidesPerView = calculateSlidesPerView(width);
        setSlidesPerView(newSlidesPerView);
      }
    });

    resizeObserver.observe(container);

    // 初始计算
    const initialWidth = container.offsetWidth;
    if (initialWidth > 0) {
      setSlidesPerView(calculateSlidesPerView(initialWidth));
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [images?.length]);

  const handleDragStart = (e: React.DragEvent, item: ImagesResultWithOrigin, src: string) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.render.origin);
    e.dataTransfer.setData('text/uri-list', src);
  };

  const slideLeftRef = useRef<HTMLButtonElement>(null);
  const slideRightRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    window.addEventListener(
      'keydown',
      (e) => {
        if (e.key === 'ArrowLeft') {
          slideLeftRef.current?.click();
        } else if (e.key === 'ArrowRight') {
          slideRightRef.current?.click();
        } else if (e.key === 'ArrowUp') {
          slideLeftRef.current?.click();
        } else if (e.key === 'ArrowDown') {
          slideRightRef.current?.click();
        }
      },
      { signal },
    );
    return () => abortController.abort();
  }, []);
  return (
    <AnimatePresence>
      <div
        className={cn('h-[calc(90px+2rem)] rounded-xl border border-input bg-slate-1 p-0 shadow-sm', className)}
        ref={containerRef}
        style={{
          width: onlyShowWorkbenchIcon
            ? 'calc(100vw - 2rem - 4.8rem - 4.8rem - 1rem)'
            : 'calc(100vw - 2rem - 11rem - 14rem - 1rem)',
          maxWidth: onlyShowWorkbenchIcon
            ? 'calc(100vw - 2rem - 4.8rem - 4.8rem - 1rem)'
            : 'calc(100vw - 2rem - 11rem - 14rem - 1rem)',
        }}
      >
        {images.length > 0 ? (
          <motion.div
            key="vines-history-content"
            className="flex size-full items-center justify-center gap-2 overflow-hidden p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3 } }}
            exit={{ opacity: 0 }}
          >
            <Button icon={<ArrowLeftIcon />} variant="outline" size="icon" ref={slideLeftRef}></Button>
            <Swiper
              virtual
              allowTouchMove={false}
              spaceBetween={12}
              direction={'horizontal'}
              modules={SwiperModules}
              freeMode={false}
              grabCursor={false}
              slidesPerGroup={3}
              mousewheel={{
                forceToAxis: false,
                releaseOnEdges: true,
                sensitivity: 2000,
                thresholdDelta: 0.2,
                thresholdTime: 10,
                enabled: true,
              }}
              navigation={{
                prevEl: slideLeftRef.current,
                nextEl: slideRightRef.current,
              }}
              slidesPerView={slidesPerView}
              onSlideChange={(swiper) => {
                // 当滑动到接近最后几个slide时触发加载
                // 提前3个slide开始加载
                if (swiper.activeIndex + slidesPerView >= images.length - SLIDE_THRESHOLD) {
                  // console.log('requesting more');

                  setSize((size) => size + 1);
                }
              }}
              className={cn('', className)}
              // onSwiper={(swiper) => {}}
            >
              {images.length > 0
                ? images.map((item, index) => (
                    <SwiperSlide key={item.render.key} className={cn('basis-auto')}>
                      <div className={cn('h-[90px] w-[90px] cursor-grab overflow-hidden rounded-md')}>
                        {/*                 {item.render.type === 'image' && (
                  <img
                    draggable
                    onPointerDown={(e) => e.stopPropagation()}
                    onDragStart={(e) => handleDragStart(e, item)}
                    src={item.render.data as string}
                    alt={typeof item.render.alt === 'string' ? item.render.alt : `Image ${index + 1}`}
                    className="h-full w-full select-none object-cover"
                  />
                )} */}
                        <CarouselItemImage
                          image={item as ImagesResultWithOrigin}
                          index={index}
                          handleDragStart={handleDragStart}
                        />
                      </div>
                    </SwiperSlide>
                  ))
                : null}
              {/* <CarouselPrevious className="h-8.5 w-9.5 absolute -left-8 top-1/2 -translate-y-1/2 rounded-md border border-slate-300 bg-white px-2.5" />
        <CarouselNext className="h-8.5 w-9.5 absolute -right-8 top-1/2 -translate-y-1/2 rounded-md border border-slate-300 bg-white px-2.5" /> */}
            </Swiper>
            <Button icon={<ArrowRightIcon />} variant="outline" size="icon" ref={slideRightRef}></Button>
          </motion.div>
        ) : (
          <motion.div
            key="vines-history-empty"
            className="vines-center size-full flex-col gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3 } }}
            exit={{ opacity: 0 }}
          >
            <ScanSearch size={48} />
            <div className="flex flex-col text-center">
              <h2 className="text-sm font-bold">{t('workbench.history.empty')}</h2>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

const convertInfiniteDataToNormal = (data: VinesWorkflowExecutionOutputListItem[][] | undefined): ImagesResult[] => {
  if (!data) return [];
  return data.flat().flatMap((result) =>
    result.output.flatMap((item, index) => {
      const res = [];
      if (item.type === 'image') {
        // @ts-ignore
        res.push({
          ...item,
          render: {
            type: 'image',
            // data: getThumbUrl(item.data as string),
            data: item.data,
            key: result.instanceId + '-' + result.status + '-' + index,
          },
        });
      }
      return res;
    }),
  );
};

type ImagesResultWithOrigin = ImagesResult & {
  render: {
    origin: string;
  };
};

const HistoryResultOg = () => {
  const { teamId } = useVinesTeam();
  const { data: imagesResult, setSize, mutate: RefreshAll } = useInfiniteWorkflowExecutionAllOutputs({ limit: 20 });
  /*   const { data: imagesResult, setSize } = useInfinitaeWorkflowExecutionOutputs('67f4e64da6376c12a3b95f9a', {
    limit: 30,
  }); */
  // const { dataa}

  const lastTeamId = useRef<string | null>(null);
  useEffect(() => {
    if (teamId !== lastTeamId.current) {
      RefreshAll();
      lastTeamId.current = teamId;
    }
  }, [teamId]);

  const executionResultList = newConvertExecutionResultToItemList(imagesResult?.flat() ?? []);
  const allImages = executionResultList.filter((item) => item.render.type.toLowerCase() === 'image');
  // const filerMap = new Map<string, any>();
  const thumbImages: ImagesResultWithOrigin[] = [];
  for (const image of allImages) {
    const url = image.render.data as string;
    const thumbUrl = getThumbUrl(url);

    thumbImages.push({ ...image, render: { ...image.render, data: thumbUrl, origin: url } } as ImagesResultWithOrigin);
  }

  return <HistoryResultInner loading={false} images={thumbImages} setSize={setSize} />;
};

export default function HistoryResultDefault() {
  return React.memo(HistoryResultOg);
}

export const HistoryResult = React.memo(HistoryResultOg);

function CarouselItemImage({
  image,
  index,
  handleDragStart,
}: {
  image: ImagesResultWithOrigin;
  index: number;
  handleDragStart: (e: React.DragEvent, item: ImagesResultWithOrigin, src: string) => void;
}) {
  const [shouldUseThumbnail, setShouldUseThumbnail] = useState(true);
  useAsyncEffect(async () => {
    const res = await checkImageUrlAvailable(image.render.data as string);
    setShouldUseThumbnail(res);
  }, [image]);

  return (
    <img
      draggable
      onPointerDown={(e) => e.stopPropagation()}
      onDragStart={(e) => handleDragStart(e, image, image.render.origin as string)}
      src={shouldUseThumbnail ? (image.render.data as string) : (image.render.origin as string)}
      alt={typeof image.render.alt === 'string' ? image.render.alt : `Image ${index + 1}`}
      className="h-full w-full select-none object-cover"
    />
  );
}
