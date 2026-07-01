import { Hero } from '../components/Hero';
import { Skills } from '../components/Skills';
import { Projects } from '../components/Projects';
import { Contact } from '../components/Contact';
import { usePortfolioStore } from '../stores/portfolioStore';
import { usePageMeta } from '../hooks/usePageMeta';

export function Home() {
  const { name, config } = usePortfolioStore();
  usePageMeta(`${name} — ${config.meta.role}`);

  return (
    <>
      <Hero />
      <Skills />
      <Projects />
      <Contact />
    </>
  );
}
