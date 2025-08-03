"use client"
import { IconArrowNarrowRight } from "@tabler/icons-react"
import { useState, useRef, useId, useEffect } from "react"
import { Youtube, Github, ExternalLink } from "lucide-react"
import Image from "next/image"

interface SlideData {
  title: string
  src: string
  youtube: string
  live: string
  github: string
}

interface SlideProps {
  slide: SlideData
  index: number
  current: number
  handleSlideClick: (index: number) => void
}

const Slide = ({ slide, index, current, handleSlideClick }: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null)

  const xRef = useRef(0)
  const yRef = useRef(0)
  const frameRef = useRef<number>()

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return

      const x = xRef.current
      const y = yRef.current

      slideRef.current.style.setProperty("--x", `${x}px`)
      slideRef.current.style.setProperty("--y", `${y}px`)

      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current
    if (!el) return

    const r = el.getBoundingClientRect()
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2))
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2))
  }

  const handleMouseLeave = () => {
    xRef.current = 0
    yRef.current = 0
  }

  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1"
  }

  const handleIconClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation()
    if (url) {
      window.open(url, "_blank")
    }
  }

  const { src, title, youtube, github, live } = slide

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="relative z-10 mx-[4vmin] flex h-[70vmin] w-[70vmin] flex-1 flex-col items-center justify-center text-center text-white opacity-100 transition-all duration-300 ease-in-out"
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform:
            current !== index
              ? "scale(0.98) rotateX(8deg)"
              : "scale(1) rotateX(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom",
        }}
      >
        <div
          className="relative left-0 top-0 h-full w-full overflow-hidden rounded-[1%] bg-[#1D1F2F] transition-all duration-150 ease-out"
          style={{
            transform:
              current === index
                ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)"
                : "none",
          }}
        >
          <Image
            className="duration-600 absolute inset-0 h-[120%] w-[120%] object-cover opacity-100 transition-opacity ease-in-out"
            style={{
              opacity: current === index ? 1 : 0.5,
            }}
            fill
            alt={title}
            src={src}
            onLoad={imageLoaded}
            loading="eager"
            decoding="sync"
          />
          {current === index && (
            <div className="absolute inset-0 bg-black/30 transition-all duration-1000" />
          )}
          {current === index && (
            <div className="absolute right-4 top-4 flex flex-col space-y-3 duration-500 animate-in slide-in-from-right">
              {youtube && (
                <button
                  onClick={(e) => handleIconClick(e, youtube)}
                  className="group relative transform rounded-full bg-red-600/80 p-3 backdrop-blur-sm transition-all delay-100 duration-300 animate-in zoom-in-50 hover:scale-110 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/25"
                  title="Watch on YouTube"
                >
                  <Youtube className="h-5 w-5 text-white transition-transform duration-200 group-hover:scale-110" />
                  <div className="absolute inset-0 animate-ping rounded-full bg-red-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </button>
              )}

              {github && (
                <button
                  onClick={(e) => handleIconClick(e, github)}
                  className="group relative transform rounded-full bg-gray-800/80 p-3 backdrop-blur-sm transition-all delay-200 duration-300 animate-in zoom-in-50 hover:scale-110 hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-500/25"
                  title="View on GitHub"
                >
                  <Github className="h-5 w-5 text-white transition-transform duration-200 group-hover:scale-110" />
                  <div className="absolute inset-0 animate-ping rounded-full bg-gray-800/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </button>
              )}

              {live && (
                <button
                  onClick={(e) => handleIconClick(e, live)}
                  className="group relative transform rounded-full bg-green-600/80 p-3 backdrop-blur-sm transition-all delay-300 duration-300 animate-in zoom-in-50 hover:scale-110 hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/25"
                  title="View Live Demo"
                >
                  <ExternalLink className="h-5 w-5 text-white transition-transform duration-200 group-hover:scale-110" />
                  <div className="absolute inset-0 animate-ping rounded-full bg-green-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </button>
              )}
            </div>
          )}
        </div>

        <article
          className={`relative p-[4vmin] transition-opacity duration-1000 ease-in-out ${
            current === index ? "visible opacity-100" : "invisible opacity-0"
          }`}
        >
          <h2 className="relative text-lg font-semibold md:text-2xl lg:text-4xl">
            {title}
          </h2>
        </article>
      </li>
    </div>
  )
}

interface CarouselControlProps {
  type: string
  title: string
  handleClick: () => void
}

const CarouselControl = ({
  type,
  title,
  handleClick,
}: CarouselControlProps) => {
  return (
    <button
      className={`border-3 mx-2 flex h-10 w-10 items-center justify-center rounded-full border-transparent bg-neutral-200 transition duration-200 hover:-translate-y-0.5 focus:border-[#6D64F7] focus:outline-none active:translate-y-0.5 dark:bg-neutral-800 ${
        type === "previous" ? "rotate-180" : ""
      }`}
      title={title}
      onClick={handleClick}
    >
      <IconArrowNarrowRight className="text-neutral-600 dark:text-neutral-200" />
    </button>
  )
}

interface CarouselProps {
  slides: SlideData[]
}

export function Carousel({ slides }: CarouselProps) {
  const [current, setCurrent] = useState(0)

  const handlePreviousClick = () => {
    const previous = current - 1
    setCurrent(previous < 0 ? slides.length - 1 : previous)
  }

  const handleNextClick = () => {
    const next = current + 1
    setCurrent(next === slides.length ? 0 : next)
  }

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setCurrent(index)
    }
  }

  const id = useId()

  return (
    <div
      className="relative mx-auto h-[70vmin] w-[70vmin]"
      aria-labelledby={`carousel-heading-${id}`}
    >
      <ul
        className="absolute mx-[-4vmin] flex transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${current * (100 / slides.length)}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <Slide
            key={index}
            slide={slide}
            index={index}
            current={current}
            handleSlideClick={handleSlideClick}
          />
        ))}
      </ul>

      <div className="absolute top-[calc(100%+1rem)] flex w-full justify-center">
        <CarouselControl
          type="previous"
          title="Go to previous slide"
          handleClick={handlePreviousClick}
        />

        <CarouselControl
          type="next"
          title="Go to next slide"
          handleClick={handleNextClick}
        />
      </div>
    </div>
  )
}
