import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";

const Index = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      <Navbar />
      <main className="h-screen">
        <Hero />
      </main>
    </div>
  );
};

export default Index;
