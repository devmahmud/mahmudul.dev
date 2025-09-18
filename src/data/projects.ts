export type Project = {
  title: string;
  techs: string[];
  link: string;
  isComingSoon?: boolean;
};

const projects: Project[] = [
  {
    title: 'Django Poll App',
    techs: ['Django', 'Python', 'Bootstrap4'],
    link: 'https://github.com/devmahmud/Django-Poll-App',
  },
  {
    title: 'Material UI portfolio',
    techs: ['React', 'Material UI', 'Javascript'],
    link: 'https://github.com/devmahmud/material-ui-portfolio',
  },
  {
    title: 'DevConnector',
    techs: ['Django Rest Framework', 'React', 'Django'],
    link: 'https://github.com/devmahmud/DevConnector-Django',
    isComingSoon: false,
  },
  {
    title: 'Django Blog',
    techs: ['Django', 'Python', 'Bootstrap'],
    link: 'https://github.com/devmahmud/DjangoBlog',
  },
  {
    title: 'Next Drag & Drop Form Builder',
    techs: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'Shadcn UI'],
    link: 'https://github.com/devmahmud/next-dnd-formbuilder',
    isComingSoon: false,
  },
  {
    title: 'Express Prisma Typescript Boilerplate',
    techs: ['Express', 'Prisma', 'Typescript'],
    link: 'https://github.com/devmahmud/express-prisma-typescript-boilerplate',
    isComingSoon: false,
  },
]
  .sort((a, b) => a.title.localeCompare(b.title))
  .sort((a, b) => {
    if (a.isComingSoon && !b.isComingSoon) return 1;
    if (!a.isComingSoon && b.isComingSoon) return -1;
    return 0;
  });

export default projects;
