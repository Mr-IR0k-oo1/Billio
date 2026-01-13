import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { TextEffect } from '@/components/motion-primitives/text-effect'
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import { HeroHeader } from "@/components/home/Header"
import { Problem } from '@/components/home/Problem'
import { Features } from '@/components/home/Features'
import { Audience } from '@/components/home/Audience'
import { InteractiveDemo } from '@/components/home/InteractiveDemo'
import { HowItWorks } from '@/components/home/HowItWorks'
import { Testimonials } from '@/components/home/Testimonials'
import { Pricing } from '@/components/home/Pricing'
import { FinalCTA } from '@/components/home/FinalCTA'
import { FAQ } from '@/components/home/FAQ'
import { Footer } from '@/components/home/Footer'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background">
            <HeroHeader />
            <main className="overflow-hidden">
                <div
                    aria-hidden
                    className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block">
                    <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
                </div>

                {/* Hero Section */}
                <section className="relative">
                    <div className="relative pt-24 md:pt-36">
                        <div
                            aria-hidden
                            className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
                        />

                        <div className="mx-auto max-w-7xl px-6">
                            <div className="flex flex-col items-center text-center">
                                <div>
                                    <div
                                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/10">
                                        <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                                        <span className="text-blue-400">Introducing</span>
                                        <span className="h-3 w-px bg-white/20" />
                                        <span>AI Invoice Intelligence</span>
                                        <ChevronRight className="ml-1 size-3.5 text-white/50" />
                                    </div>
                                </div>

                                <TextEffect
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    as="h1"
                                    className="mt-8 max-w-4xl text-balance text-5xl font-bold tracking-tight text-white md:text-7xl lg:mt-12 xl:text-8xl">
                                    Professional Invoices, Sent in Seconds.
                                </TextEffect>
                                
                                <TextEffect
                                    per="line"
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    delay={0.5}
                                    as="p"
                                    className="mt-8 max-w-2xl text-balance text-lg text-muted-foreground leading-relaxed md:text-xl">
                                    Stop wasting hours on admin work. Billio uses AI to write your descriptions, track payments, and get you paid 3x faster.
                                </TextEffect>

                                <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
                                    <Link to="/register">
                                        <HoverBorderGradient
                                            containerClassName="rounded-2xl"
                                            className="h-14 px-8 text-lg font-bold flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors"
                                        >
                                            Try for Free <ArrowRight size={20} />
                                        </HoverBorderGradient>
                                    </Link>
                                    <Link to="/login">
                                        <HoverBorderGradient
                                            containerClassName="rounded-2xl"
                                            className="h-14 px-8 text-lg font-bold flex items-center gap-2 bg-transparent hover:bg-white/5 transition-colors border border-white/10"
                                        >
                                            View Demo
                                        </HoverBorderGradient>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="mask-b-from-55% relative mt-8 px-2 sm:mt-12 md:mt-24 lg:-mx-12">
                            <div className="bg-card/50 relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/5 p-3 shadow-2xl shadow-black/50 backdrop-blur-xl ring-1 ring-white/10">
                                <img
                                    className="bg-card aspect-16/9 relative hidden rounded-xl dark:block object-cover"
                                    src="/mail2.png"
                                    alt="app screen"
                                    width="2700"
                                    height="1440"
                                />
                                <img
                                    className="z-2 border-border/25 aspect-16/9 relative rounded-xl border dark:hidden object-cover"
                                    src="/mail2-light.png"
                                    alt="app screen"
                                    width="2700"
                                    height="1440"
                                />
                            </div>
                        </div>
                    </div>
                </section>
                <Problem />
                <Features />
                <Audience />
                <InteractiveDemo />
                <HowItWorks />
                <Testimonials />
                <Pricing />
                <FAQ />
                <FinalCTA />
            </main>
            <Footer />
        </div>
    )
}