import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.entry';

// ✅ Configure PDF.js Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// ✅ Parse Resume Function
export const parseResume = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      const typedarray = new Uint8Array(event.target.result);

      try {
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;

        let fullText = '';

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const content = await page.getTextContent();

          const pageText = content.items.map(item => item.str).join(' ');
          fullText += pageText + ' ';
        }

        console.log("✅ Extracted PDF Text:", fullText);

        // Extract skills and projects from full text
        const skills = extractSkills(fullText);
        const projects = extractProjects(fullText);

        resolve({ skills, projects });
      } catch (error) {
        console.error('❌ Error parsing PDF:', error);
        reject(error);
      }
    };

    reader.onerror = (err) => {
      reject(err);
    };

    reader.readAsArrayBuffer(file);
  });
};

// ✅ Extract Skills Function
const extractSkills = (text) => {
  const skillKeywords = [
    'React', 'Node.js', 'JavaScript', 'Python', 'Machine Learning',
    'AI', 'SQL', 'MongoDB', 'Express', 'Java', 'C++', 'AWS', 'Docker'
  ];

  const foundSkills = [];

  skillKeywords.forEach(skill => {
    const regex = new RegExp(`\\b${skill}\\b`, 'i');
    if (regex.test(text)) {
      foundSkills.push(skill);
    }
  });

  console.log('✅ Extracted Skills:', foundSkills);
  return foundSkills;
};

// ✅ Extract Projects Function
const extractProjects = (text) => {
  const projectPattern = /project\s*[:\-]*\s*(.+?)(?:\.|\n|$)/gi;
  const projects = [];

  let match;
  while ((match = projectPattern.exec(text)) !== null) {
    projects.push({ title: match[1].trim() });
  }

  console.log('✅ Extracted Projects:', projects);
  return projects;
};
