import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const FinalCTA = () => (
  <section className="cta-section relative overflow-hidden">
     <div className="home-container relative z-10">
        <h2 className="home-h2 mb-6">Stop wasting time on invoices</h2>
        <Link to="/register" className="btn-cta inline-flex items-center gap-2 text-lg px-8 py-4">
          Create your first invoice <ArrowRight />
        </Link>
        <p className="mt-4 text-gray-500">Takes less than a minute.</p>
     </div>
  </section>
);
