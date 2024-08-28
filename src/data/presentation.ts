type Social = {
  label: string;
  link: string;
};

type Presentation = {
  mail: string;
  title: string;
  description: string;
  socials: Social[];
};

const presentation: Presentation = {
  mail: 'expelmahmud@gmail.com',
  title: 'Hi, I’m <Mahmudul::Alam> 👋',
  description:
    "*Hyālō!* I'm a seasoned full-stack developer with 5+ years of experience in consumer-facing software development. I excel in designing and implementing solutions, including CRM and CMS for B2B clients. My expertise lies in JavaScript (ReactJS, React Native, NodeJS) and Python (Django, Web3.js, Ethers.js), and I prioritize clean, reusable code in a well-structured architecture. I'm also active in open-source contributions.",
  socials: [
    {
      label: 'Twitter',
      link: 'https://twitter.com/mahmudul__alam',
    },
    {
      label: 'Github',
      link: 'https://github.com/devmahmud',
    },
  ],
};

export default presentation;
