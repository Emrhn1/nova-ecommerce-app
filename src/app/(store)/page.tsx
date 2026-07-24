import Hero from "@/components/store/Hero";
import CategorySection from "@/components/store/CategorySection";
import FeaturedProducts from "@/components/store/FeaturedProducts";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategorySection />
      <FeaturedProducts />
    </>
  );
}
