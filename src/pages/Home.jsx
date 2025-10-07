import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import About from '../components/About'
import Skills from '../components/Skills'
import Projects from '../components/Projects'
import Certificates from '../components/Certificates'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import { ContentProvider } from '../hooks/useContentManagement'

const Home = () => {
  return (
    <ContentProvider>
      <div className="relative">
        <Header />
        <main>
          {/* Ensure Hero section has the home ID and is properly structured */}
          <section id="home" className="relative">
            <Hero />
          </section>
          <About />
          <Skills />
          <Projects />
          <Certificates />
          <Contact />
        </main>
        <Footer />
      </div>
    </ContentProvider>
  )
}

export default Home