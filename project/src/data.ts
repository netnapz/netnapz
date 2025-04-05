import { Question, Character } from './types';

export const questions: Question[] = [
  { id: 1, text: "Is your character real (not fictional)?" },
  { id: 2, text: "Is your character female?" },
  { id: 3, text: "Is your character associated with sports?" },
  { id: 4, text: "Is your character primarily known for music?" },
  { id: 5, text: "Is your character currently active in their field?" },
  { id: 6, text: "Is your character from the United States?" },
  { id: 7, text: "Is your character over 40 years old?" },
  { id: 8, text: "Has your character won major awards in their field?" },
  { id: 9, text: "Is your character known for comedy?" },
  { id: 10, text: "Does your character have their own business empire?" },
  { id: 11, text: "Is your character involved in politics?" },
  { id: 12, text: "Has your character appeared in movies?" },
  { id: 13, text: "Is your character known for philanthropy?" },
  { id: 14, text: "Does your character have more than 10M social media followers?" },
  { id: 15, text: "Has your character been in the public eye for over 20 years?" }
];

export const characters: Character[] = [
  {
    id: 1,
    name: "Taylor Swift",
    category: "Music",
    description: "A multi-Grammy winning artist known for her songwriting and evolution from country to pop music.",
    attributes: {
      1: true,  // real
      2: true,  // female
      3: false, // sports
      4: true,  // music
      5: true,  // active
      6: true,  // US
      7: false, // over 40
      8: true,  // awards
      9: false, // comedy
      10: true, // business
      11: false, // politics
      12: true, // movies
      13: true, // philanthropy
      14: true, // social media
      15: true  // 20 years
    }
  },
  {
    id: 2,
    name: "LeBron James",
    category: "Sports",
    description: "An NBA legend known for his extraordinary basketball career and philanthropy.",
    attributes: {
      1: true,  // real
      2: false, // female
      3: true,  // sports
      4: false, // music
      5: true,  // active
      6: true,  // US
      7: false, // over 40
      8: true,  // awards
      9: false, // comedy
      10: true, // business
      11: false, // politics
      12: true, // movies
      13: true, // philanthropy
      14: true, // social media
      15: true  // 20 years
    }
  },
  {
    id: 3,
    name: "Elon Musk",
    category: "Technology",
    description: "A tech entrepreneur known for Tesla, SpaceX, and various other ventures.",
    attributes: {
      1: true,  // real
      2: false, // female
      3: false, // sports
      4: false, // music
      5: true,  // active
      6: false, // US
      7: true,  // over 40
      8: true,  // awards
      9: false, // comedy
      10: true, // business
      11: false, // politics
      12: false, // movies
      13: true, // philanthropy
      14: true, // social media
      15: true  // 20 years
    }
  }
];