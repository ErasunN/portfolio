type Project = {
    name: string
    description: string
    link: string | undefined
    video: string | null
    id: string
}

type WorkExperience = {
    company: string
    title: string
    start: string
    end: string
    link: string
    id: string
}

type SocialLink = {
    label: string
    link: string
}

export const PROJECTS: Project[] = [
    {
        name: 'Personal Digital Invitation',
        description:
            'Digital birthday party invitation.',
        link: 'https://invitacionxvsofi.vercel.app/',
        video:
            'videos/InvSofi.mp4',
        id: 'project1',
    },
    {
        name: 'Digital Invitation Maker',
        description: 'UI digital invitation builder. (Work in progress)',
        link: '',
        video: null,
        id: 'project2',
    },
]

export const WORK_EXPERIENCE: WorkExperience[] = [
    {
        company: 'RunnerPro',
        title: 'Full Stack Developer',
        start: 'NOV 2024',
        end: 'ENE 2025',
        link: 'https://www.runnerpro.app/en/',
        id: 'work1',
    },
    {
        company: 'USA Lawyers Startup',
        title: 'Full Stack Developer',
        start: 'ENE 2024',
        end: 'NOV 2024',
        link: '',
        id: 'work2',
    },
    {
        company: 'USA Food Startup',
        title: 'Full Stack Developer',
        start: 'ENE 2023',
        end: 'ENE 2024',
        link: '',
        id: 'work3',
    },
    {
        company: 'Taggify',
        title: 'Full Stack Developer',
        start: 'ENE 2021',
        end: 'ENE 2023',
        link: 'https://www.taggify.net/es',
        id: 'work4',
    },
]

export const SOCIAL_LINKS: SocialLink[] = [
    {
        label: 'Github',
        link: 'https://github.com/erasunn',
    },
    {
        label: 'LinkedIn',
        link: 'https://www.linkedin.com/in/nerasun',
    },
    {
        label: 'Instagram',
        link: 'https://www.instagram.com/nico-erasun',
    },
]

export const EMAIL = 'nicoerasun98@gmail.com'