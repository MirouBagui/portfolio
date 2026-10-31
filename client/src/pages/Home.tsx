import { Hero } from '../components/Hero';
import { Skills } from '../components/Skills';
import { Projects } from '../components/Projects';
import { ArchitectureTeaser } from '../components/ArchitectureTeaser';
import { Contact } from '../components/Contact';
import { usePageMeta } from '../hooks/usePageMeta';

export function Home() {
  usePageMeta();

  return (
    <>
      <Hero />
      <Skills />
      <Projects />
      <ArchitectureTeaser />
      <Contact />
    </>
  );
}
