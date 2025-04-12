import Image from "next/image";
import Link from "next/link";



export default function Hero() {
  return (
    <>
   <div className="bg-white min-h-screen text-white flex flex-col items-center px-6">
      
      
      
   <div className="mt-20 flex flex-col items-center text-center">
  <h2 className="text-4xl font-bold text-black">
    Start Creating with <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">RegondAI</span>
  </h2>
  <p className="mt-4 text-lg text-gray-600">
    Generate stunning AI-powered images effortlessly.  
  </p>
  <div className="mt-6 flex flex-wrap justify-center gap-4">
    <button className="bg-black hover:bg-gray-500 text-white px-6 py-3 rounded-lg text-lg shadow-md">
      Get Started for Free
    </button>
    <button className="px-6 py-3 rounded-xl border border-gray-300 text-gray-800 hover:bg-gray-100 transition">
      See How It Works
    </button>
  </div>
</div>

       
        
    
      
        <h3 className="text-3xl font-bold text-center mb-4">Why Choose Us?</h3>
        <p className="text-gray-700 text-center">
          Our AI-powered platform automates your workflow, increases efficiency, and reduces costs.
        </p>
    
    </div>
    
    </>
  );
}
