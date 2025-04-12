import Image from "next/image";
import Link from "next/link";
import Hero from "./components/home/hero" 
import Section from "./components/home/section" 
import CTASection from "@/components/ghibliComponent";

export default function Home() {
  return (
    <>
    
    <Hero/>
    <CTASection/>
    <Section/>
    
    
    </>
  );
}
