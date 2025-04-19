import prismaClient from './db';

const damoDataUser = {
  role: 'user',
  content:
    'Clear the default content from `src/App.tsx`, `src/main.tsx`, `src/index.css`, and `src/App.css`. In `src/App.tsx`, create a functional component that renders only an `<h1>` heading. Update `src/main.tsx` to render this `App` component.',
};

const damoDataAssistant = {
  role: 'assistant',
  content: {
    startingContent:
      'Okay, I will create a stylish to-do list application using React, Tailwind CSS, and Framer Motion.\n\n1.  Greetings!\n2.  The following files will be created or modified:\n\n    *   `src/App.tsx`\n    *   `src/components/TodoList.tsx`\n    *   `src/components/TodoItem.tsx`\n    *   `src/components/AddTodoForm.tsx`\n3.  This application will allow you to add, remove, and mark todos as complete, with smooth animations provided by Framer Motion.\n\n',
    projectFiles: {},
    endingContent:
      'I have completed the task. You can now view the to-do list application in the preview.',
    updatedFiles: [
      {
        action: 'Updating',
        filePath: 'src/App.tsx',
      },
      {
        action: 'Updating',
        filePath: 'src/components/TodoItem.tsx',
      },
      {
        action: 'Updating',
        filePath: 'src/newcomponents/TodoList.tsx',
      },
    ],
  },
};

const damoData1 = async () => {
  await prismaClient.message.create({
    data: {
      message: damoDataUser,
      projectId: 55,
    },
  });
};

const damoData2 = async () => {
  await prismaClient.message.create({
    data: {
      message: damoDataAssistant,
      projectId: 55,
    },
  });
};

damoData1();
damoData2();
