import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CakesPage() {
    return (
        <main className="min-h-screen bg-white pt-32">
            <Navbar />
            <div className="max-width-container section-padding">
                <h1 className="text-5xl md:text-7xl font-black mb-8">Our Cakes</h1>
                <p className="text-xl text-gray-500 mb-16">The premium collection.</p>
                <div className="h-[50vh] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 font-bold uppercase tracking-widest">
                    Content coming soon
                </div>
            </div>
            <Footer />
        </main>
    );
}
