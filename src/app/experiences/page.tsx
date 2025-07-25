'use client';

import AnimatedSection from '@/components/AnimatedSection';
import { motion } from 'framer-motion';
import { FaBriefcase, FaRunning, FaUsers, FaHandsHelping } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { useState } from 'react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

enum ExperienceType {
  WORK = 'Work',
  SPORTS = 'Sports',
  LEADERSHIP = 'Leadership',
  VOLUNTEER = 'Volunteer'
}

interface Experience {
  title: string;
  role: string;
  date: string;
  type: ExperienceType;
  points: string[];
}

const typeIcons: Record<ExperienceType, IconType> = {
  [ExperienceType.WORK]: FaBriefcase,
  [ExperienceType.SPORTS]: FaRunning,
  [ExperienceType.LEADERSHIP]: FaUsers,
  [ExperienceType.VOLUNTEER]: FaHandsHelping
};

const experiences: Experience[] = [
  {
    title: "AltHQ",
    role: "Mobile Software Engineer",
    date: "May - August 2024",
    type: ExperienceType.WORK,
    points: [
      "Developed the mobile app MVP from scratch, leading development",
      "Collaborated with mentors to solve complex technical challenges",
      "Contributed to the web app development, supporting cross-platform functionality",
      "Practiced agile methodologies in a fast-paced startup environment",
      "Demonstrated adaptability by learning new technologies quickly",
      "Fostered a collaborative work environment through team discussions and code reviews"
    ]
  },
  {
    title: "Cross Country",
    role: "Cross Country Captain",
    date: "2019-2024",
    type: ExperienceType.SPORTS,
    points: [
      "Led team to district championships in freshman and sophomore years",
      "Individual district champion and team district champions in 2024",
      "Helped team achieve 3rd place at UIL 3A State Championships (sophomore year)",
      "Led team to 1st place at UIL 3A State Championships (junior year)",
      "Earned All-State honors junior and senior year (16th and 19th place)",
      "Received Teammate Award in freshman and junior years",
      "Recruited 30+ middle school athletes to the program",
      "Organized Subway meetups every Friday to promote team camaraderie"
    ]
  },
  {
    title: "Track and Field",
    role: "Track Team Captain",
    date: "2019-Present",
    type: ExperienceType.SPORTS,
    points: [
      "Qualified for Area and Regional meets in sophomore year",
      "Received Teammate Award in sophomore year",
      "Mentored 8th grade distance runners",
      "Recruited 8th graders for the program"
    ]
  },
  {
    title: "Duke Cross Country Camp",
    role: "Camper",
    date: "June 2023",
    type: ExperienceType.SPORTS,
    points: [
      "Attended Duke University in Durham NC to learn about collegiate running",
      "Gained valuable insights into collegiate athletics and training methods"
    ]
  },
  {
    title: "Model UN at GHNO",
    role: "Model UN Co-Leader",
    date: "2021-Present",
    type: ExperienceType.LEADERSHIP,
    points: [
      "Participated in 4 conferences (MUNSA and AUSMUN)",
      "Represented countries Namibia, Russian Federation, Iceland, and Mexico",
      "Participated in various committees including HRC, WHO, Habitat, and General Assembly",
      "Received Best Small School Delegation award at MUNSA '24",
      "Actively engaged in discussions and draft resolutions",
      "Helped recruit new students for the 2024 school year"
    ]
  },
  {
    title: "AI Camp",
    role: "Programmer/Ambassador",
    date: "July 2023",
    type: ExperienceType.LEADERSHIP,
    points: [
      "Created NeuroScanAI to detect benign vs. malignant brain tumors",
      "Worked with a team of 5 to develop and train the AI over 3 weeks",
      "Successfully implemented machine learning algorithms for tumor classification"
    ]
  },
  {
    title: "Piano Club",
    role: "Piano Club Co-Leader",
    date: "2022-2024",
    type: ExperienceType.LEADERSHIP,
    points: [
      "Co-founded the club with cross country teammate",
      "Performed at a hospice for elderly residents",
      "Organized regular practice sessions and performances"
    ]
  },
  {
    title: "SEWA International",
    role: "Volunteer",
    date: "2021-2022",
    type: ExperienceType.VOLUNTEER,
    points: [
      "Worked 20 hours at Aum Ashram summer school",
      "Helped set up and close down the school",
      "Created flyers for a Rubik's cube tournament"
    ]
  },
  {
    title: "Camp Invention",
    role: "Camp Counselor",
    date: "July 2022",
    type: ExperienceType.VOLUNTEER,
    points: [
      "Provided mentorship and inspiration to children",
      "Supervised 30+ kids aged 5-12",
      "Ensured a safe and supportive environment",
      "Collaborated with six counselors to coordinate activities"
    ]
  },
  {
    title: "Mentorship Committee at GHNO",
    role: "Mentorship Committee Member",
    date: "2022-2023",
    type: ExperienceType.VOLUNTEER,
    points: [
      "Mentored a group of six 7th graders weekly",
      "Taught study habits and provided academic advice",
      "Helped manage events for 7th graders"
    ]
  },
  {
    title: "Service Committee at GHNO",
    role: "Service Committee Member",
    date: "2022-2023",
    type: ExperienceType.VOLUNTEER,
    points: [
      "Co-led a Book Drive that donated over 200 books",
      "Organized a pizza party for the winning grade",
      "Helped organize books in the library",
      "Worked on the Reading Buddies program"
    ]
  }
];

export default function Experiences() {
  const [selectedType, setSelectedType] = useState<ExperienceType | 'ALL'>('ALL');
  const [isExpanded, setIsExpanded] = useState<Record<number, boolean>>({});

  const filteredExperiences = experiences.filter(exp => 
    selectedType === 'ALL' || exp.type === selectedType
  );

  return (
    <section className="min-h-screen py-12 sm:py-20">
      <AnimatedSection className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center">
          <span className="text-foreground">Experience Timeline</span>
        </h2>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-1">
          <FilterButton
            type="ALL"
            selected={selectedType === 'ALL'}
            onClick={() => setSelectedType('ALL')}
          />
          {Object.values(ExperienceType).map(type => (
            <FilterButton
              key={type}
              type={type}
              selected={selectedType === type}
              onClick={() => setSelectedType(type)}
              icon={typeIcons[type]}
            />
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto pl-4 sm:pl-0">
          {filteredExperiences.map((experience, index) => (
            <motion.div 
              key={index}
              className="relative pl-6 sm:pl-8 pb-8 sm:pb-12 border-l-2 border-border last:border-l-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="absolute left-[-14px] sm:left-[-16px] top-0 w-7 h-7 sm:w-8 sm:h-8 bg-foreground rounded-full flex items-center justify-center text-background">
                {React.createElement(typeIcons[experience.type], { size: 14 })}
              </div>
              
              <Card className="ml-2 sm:ml-4 hover:shadow-lg transition-shadow">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-semibold mb-1">{experience.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary" className="flex items-center gap-1 sm:gap-2">
                      {React.createElement(typeIcons[experience.type], { size: 12 })}
                      {experience.role}
                    </Badge>
                    <Badge variant="outline">
                      {experience.date}
                    </Badge>
                  </div>
                  
                  <div className={`overflow-hidden transition-all duration-300 ${isExpanded[index] ? 'max-h-[1000px]' : 'max-h-[100px]'}`}>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      {experience.points.map((point, pointIndex) => (
                        <li key={pointIndex} className="text-sm">
                          <span className="break-words">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {experience.points.length > 2 && (
                    <Button
                      variant="ghost"
                      onClick={() => setIsExpanded(prev => ({ ...prev, [index]: !prev[index] }))}
                      className="mt-4 p-0 h-auto text-sm font-medium"
                    >
                      {isExpanded[index] ? 'Show less' : 'Show more'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
}

interface FilterButtonProps {
  type: ExperienceType | 'ALL';
  selected: boolean;
  onClick: () => void;
  icon?: IconType;
}

function FilterButton({ type, selected, onClick, icon }: FilterButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant={selected ? "default" : "outline"}
      size="sm"
      className="flex items-center gap-1.5 sm:gap-2"
    >
      {icon && React.createElement(icon, { size: 14 })}
      {type}
    </Button>
  );
} 