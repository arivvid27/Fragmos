import { Finale, Free, Principle } from "./Closing";
import { Demo } from "./Demo";
import { Entry } from "./Entry";
import { Features } from "./Features";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { Iris } from "./Iris";
import { Nav } from "./Nav";
import { Pricing } from "./Pricing";
import { Story } from "./Story";

export function Landing() {
  return (
    <>
      <Nav />
      <main className="overflow-x-clip">
        <Hero />
        <Entry />
        <Iris from="light" to="dark">
          <Principle />
        </Iris>
        <Story />
        <Demo />
        <Features />
        <Iris from="dark" to="light" shape="horizon">
          <Free />
        </Iris>
        <Pricing />
        <Iris from="light" to="dark" at="50% 72%" height="240vh">
          <Finale />
        </Iris>
      </main>
      <Footer />
    </>
  );
}
