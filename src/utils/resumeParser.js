import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.entry';

// ✅ Set the worker source from the CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const parseResume = async (file) => {
  try {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        const typedarray = new Uint8Array(reader.result);

        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;

        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map(item => item.str).join(' ');
          fullText += pageText + ' ';
        }

        console.log('Raw Resume Text:', fullText);

        // Extract skills (basic example)
        const skillKeywords = ['React', 'Node.js', 'JavaScript', 'Python', 
          'Machine Learning', 'CSS', 'HTML', 'MongoDB', 'SQL', 'Java', 'Core Java', 'Express.js',
           'Versal', 'Next.js','TypeScript', 'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Django',
           'REST API', 'Docker','DevOps', 'CI/CD', 'Git', 'Version Control', 'Microservices', 
           'Cloud Computing', 'Data Structures', 'Algorithms','Postman', 'GraphQL', 'Redux','Angular', 'Tailwind CSS',];
        const skills = skillKeywords.filter(skill => fullText.toLowerCase().includes(skill.toLowerCase()));

        // Extract project titles (basic example)
        const projectMatches = fullText.match(/project\s*[:\-]\s*(.*?)(?=[\.\n]|$)/gi) || [];
        const projects = projectMatches.map((proj, index) => {
          const title = proj.split(/[:\-]/)[1]?.trim() || `Project ${index + 1}`;
          return { title };
        });

        resolve({
          skills,
          projects,
        });
      };

      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  } catch (err) {
    console.error('Error parsing resume:', err);
    return {
      skills: [],
      projects: [],
    };
  }
};
