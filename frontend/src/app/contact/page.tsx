import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-white pt-32">
            <Navbar />
            <div className="max-width-container section-padding">
                <h1 className="text-5xl md:text-7xl font-black mb-8">Contact Us</h1>
                <p className="text-xl text-gray-500 mb-16">Reach out to us on WhatsApp for custom orders.</p>
                <div className="h-[50vh] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 font-bold uppercase tracking-widest gap-6">
                    <a
                        href="https://wa.me/9324790894"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-whatsapp px-8 py-4 rounded-full font-bold flex items-center gap-3"
                    >
                        Message on WhatsApp
                    </a>
                    <span className="text-xs">Content coming soon</span>
                </div>
            </div>
            <Footer />
        </main>
    );
}
