'use client';

import { FaDiscord, FaMusic } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Project {
  title: string;
  description: string;
  points: string[];
  icon: IconType;
  technologies: string[];
}

const projects: Project[] = [
  {
    title: "Zewo",
    description: "A multipurpose Discord chatbot built with JavaScript",
    points: [
      "Created a versatile Discord bot capable of handling various commands",
      "Implemented entertainment features like 8ball and poll commands",
      "Integrated gaming APIs to fetch player statistics for games like Fortnite and Apex Legends",
      "Designed an intuitive command structure for easy user interaction"
    ],
    icon: FaDiscord,
    technologies: ["JavaScript", "Discord.js", "REST APIs", "Node.js"]
  },
  {
    title: "Musica",
    description: "A Discord bot for music recommendations and tracking",
    points: [
      "Developed using Discord.js, Express.js, and Axios",
      "Integrated Last.fm API for personalized music recommendations",
      "Implemented music scrobbling and data retrieval features",
      "Created real-time music insights with user-specific data",
      "Enabled seamless interaction with personalized playlists and music stats"
    ],
    icon: FaMusic,
    technologies: ["Discord.js", "Express.js", "Axios", "Last.fm API", "Node.js"]
  }
];

export default function Projects() {
  return (
    <section className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">
          <span className="text-foreground">Projects</span>
        </h2>

        <div className="max-w-4xl mx-auto grid gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-foreground p-3 rounded-lg text-background">
                    <project.icon size={24} />
                  </div>
                  <h3 className="text-2xl font-semibold">{project.title}</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {project.description}
                </p>

                <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                  {project.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="text-sm">
                      <span className="break-words">{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
