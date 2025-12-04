
export interface Todo {
  id: string;
  text: string;
  time: string;
  completed: boolean;
  priority: Priority;
}

export enum Priority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export enum TodoCategory {
  Personal = 'Personal',
  Professional = 'Professional',
}

export interface WordOfTheDay {
  word: string;
  definition: string;
}

export interface StudyTopic {
  topic: string;
  explanation: string;
}

export interface StudyPlan {
  mathTopic: StudyTopic;
  scienceTopic: StudyTopic;
}

export interface TechConcept {
  topic: string;
  explanation: string;
}

export interface DailyContent {
  wordOfTheDay: WordOfTheDay;
  thoughtOfTheDay: string;
  studyPlan: StudyPlan;
  techConcept: TechConcept;
}
