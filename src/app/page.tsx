'use client'
import { motion } from 'motion/react'
import { EMAIL, PROJECTS, SOCIAL_LINKS, WORK_EXPERIENCE } from './data';
import { MorphingModal, MorphingModalTrigger, MorphingModalContainer, MorphingModalContent, MorphingModalClose } from '@/components/ui/Modal'
import { XIcon, ImageIcon } from 'lucide-react';
import { Spotlight } from '@/components/ui/Spotlight';
import MagneticLink from '@/components/ui/MagneticLink';


const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

const TRANSITION_SECTION = {
  duration: 0.3,
}

type ProjectVideoProps = {
  src: string | null
}

const ProjectVideo = ({ src }: ProjectVideoProps) => {
  const videoSrc = src ? `/${src}` : undefined

  return (
    <MorphingModal
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.3,
      }}
    >
      <MorphingModalTrigger>
        {videoSrc ? (
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            className="aspect-video w-full cursor-zoom-in rounded-xl"
            onError={(e) => {
              const target = e.target as HTMLVideoElement;
              target.style.display = 'none';
              target.parentElement?.classList.add('fallback-container');
            }}
          />
        ) : (
          <div className="aspect-video w-full cursor-zoom-in rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-zinc-400" />
          </div>
        )}
      </MorphingModalTrigger>
      <MorphingModalContainer>
        <MorphingModalContent className="relative aspect-video rounded-2xl bg-zinc-50 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950 dark:ring-zinc-800/50">
          {videoSrc ? (
            <video
              src={videoSrc}
              autoPlay
              loop
              muted
              className="aspect-video h-[50vh] w-full rounded-xl md:h-[70vh]"
              onError={(e) => {
                const target = e.target as HTMLVideoElement;
                target.style.display = 'none';
                target.parentElement?.classList.add('fallback-container');
              }}
            />
          ) : (
            <div className="aspect-video h-[50vh] w-full rounded-xl md:h-[70vh] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <ImageIcon className="h-20 w-20 text-zinc-400" />
            </div>
          )}
        </MorphingModalContent>
        <MorphingModalClose
          className="fixed top-6 right-6 h-fit w-fit rounded-full bg-white p-1"
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: { delay: 0.3, duration: 0.1 },
            },
            exit: { opacity: 0, transition: { duration: 0 } },
          }}
        >
          <XIcon className="h-5 w-5 text-zinc-500" />
        </MorphingModalClose>
      </MorphingModalContainer>
    </MorphingModal>
  )
}

export default function Home() {
  return (
    <motion.main
      className="space-y-24"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <div className="flex-1">
          <p className="text-zinc-600 dark:text-zinc-300">
            Focused on creating intuitive and performant web experiences.
            Bridging the gap between front and back development.
          </p>
        </div>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-5 text-lg font-medium text-zinc-900 dark:text-zinc-100">Selected Projects</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {PROJECTS.map((project) => (
            <div key={project.name} className="space-y-2">
              <div className="relative rounded-2xl bg-zinc-50/40 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50">
                <ProjectVideo src={project.video} />
              </div>
              <div className="px-1">
                <a
                  className="font-base group relative inline-block font-[450] text-zinc-900 dark:text-zinc-100"
                  href={project.link}
                  target="_blank"
                >
                  {project.name}
                  <span className="absolute bottom-0.5 left-0 block h-[1px] w-full max-w-0 bg-zinc-900 transition-all duration-200 group-hover:max-w-full"></span>
                </a>
                <p className="text-base text-zinc-600 dark:text-zinc-400">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-5 text-lg font-medium text-zinc-900 dark:text-zinc-100">Work Experience</h3>
        <div className="flex flex-col space-y-2">
          {WORK_EXPERIENCE.map((job) => (
            job.link ? (
              <a
                className="relative overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-900/30"
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                key={job.id}
              >
                <Spotlight
                  className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-300"
                  size={96}
                />
                <div className="relative h-full w-full rounded-[15px] bg-white p-4 dark:bg-zinc-950">
                  <div className="relative flex w-full flex-row justify-between">
                    <div>
                      <h4 className="font-normal text-zinc-900 dark:text-zinc-100">
                        {job.title}
                      </h4>
                      <p className="text-zinc-500 dark:text-zinc-400">
                        {job.company}
                      </p>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {job.start} - {job.end}
                    </p>
                  </div>
                </div>
              </a>
            ) : (
              <div key={job.id} className="relative overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-900/30">
                <Spotlight
                  className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-300"
                  size={96}
                />
                <div className="relative h-full w-full rounded-[15px] bg-white p-4 dark:bg-zinc-950">
                  <div className="relative flex w-full flex-row justify-between">
                    <div>
                      <h4 className="font-normal text-zinc-900 dark:text-zinc-100">
                        {job.title}
                      </h4>
                      <p className="text-zinc-500 dark:text-zinc-400">
                        {job.company}
                      </p>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {job.start} - {job.end}
                    </p>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-5 text-lg font-medium text-zinc-900 dark:text-zinc-100">Connect</h3>
        <p className="mb-5 text-zinc-700 dark:text-zinc-300">
          Feel free to contact me at{' '}
          <a className="underline text-slate-700 dark:text-slate-300 font-semibold" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
        </p>
        <div className="flex items-center justify-start space-x-3">
          {SOCIAL_LINKS.map((link) => (
            <MagneticLink key={link.label} href={link.link} className="px-4 py-2 rounded-md bg-stone-800 text-stone-100 font-semibold dark:bg-zinc-950 dark:text-zinc-100">
              {link.label}
            </MagneticLink>
          ))}
        </div>
      </motion.section>
    </motion.main>
  );
}
