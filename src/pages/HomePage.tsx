import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TextEffect } from '@/components/motion-primitives/text-effect'
import { AnimatedGroup } from '@/components/motion-primitives/animated-group'
import { HeroHeader } from "@/components/home/Header"
import { Problem } from '@/components/home/Problem'
import { Features } from '@/components/home/Features'
import { Audience } from '@/components/home/Audience'
import { InteractiveDemo } from '@/components/home/InteractiveDemo'
import { HowItWorks } from '@/components/home/HowItWorks'
import { Testimonials } from '@/components/home/Testimonials'
import { Pricing } from '@/components/home/Pricing'
import { motion } from 'framer-motion';
import { FinalCTA } from '@/components/home/FinalCTA'
import { FAQ } from '@/components/home/FAQ'
import { Footer } from '@/components/home/Footer'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

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
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            delayChildren: 0.5,
                                        },
                                    },
                                },
                                item: {
                                    hidden: {
                                        opacity: 0,
                                        y: 20,
                                        filter: 'blur(10px)',
                                    },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        filter: 'blur(0px)',
                                        transition: {
                                            type: 'spring',
                                            bounce: 0.3,
                                            duration: 1.5,
                                        },
                                    },
                                },
                            }}
                            className="mask-b-from-35% mask-b-to-90% absolute inset-0 top-56 -z-20 lg:top-32 overflow-hidden">
                            <img
                                src="https://ik.imagekit.io/lrigu76hy/tailark/night-background.jpg?updatedAt=1745733451120"
                                alt="background"
                                className="hidden size-full dark:block object-cover opacity-40"
                                width="3276"
                                height="4095"
                            />
                        </AnimatedGroup>

                        <div
                            aria-hidden
                            className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
                        />

                        <div className="mx-auto max-w-7xl px-6">
                            <div className="flex flex-col items-center text-center">
                                <AnimatedGroup variants={transitionVariants}>
                                    <div
                                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/10">
                                        <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                                        <span className="text-blue-400">Introducing</span>
                                        <span className="h-3 w-px bg-white/20" />
                                        <span>AI Invoice Intelligence</span>
                                        <ChevronRight className="ml-1 size-3.5 text-white/50" />
                                    </div>
                                </AnimatedGroup>

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

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.1,
                                                    delayChildren: 1,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="h-14 rounded-2xl px-8 text-lg font-semibold shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                        <Link to="/register">
                                            Try for Free <ArrowRight className="ml-2 size-5" />
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="outline"
                                        className="h-14 rounded-2xl px-8 text-lg font-semibold backdrop-blur-sm border-white/10">
                                        <Link to="/login">
                                            View Demo
                                        </Link>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>


                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}>
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
                        </AnimatedGroup>
                    </div>
                </section>

                {/* Partners Section */}
                <section className="py-24 border-y border-white/5 bg-black">
                    <div className="home-container">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="flex flex-col items-center"
                        >
                            <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-bold mb-12">Trusted by teams at</p>
                            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 md:gap-x-20 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
                                <img className="h-4 md:h-5 w-auto" src="https://html.tailus.io/blocks/customers/nvidia.svg" alt="Nvidia" />
                                <img className="h-3 md:h-4 w-auto" src="https://html.tailus.io/blocks/customers/column.svg" alt="Column" />
                                <img className="h-3 md:h-4 w-auto" src="https://html.tailus.io/blocks/customers/github.svg" alt="GitHub" />
                                <img className="h-4 md:h-5 w-auto" src="https://html.tailus.io/blocks/customers/nike.svg" alt="Nike" />
                                <img className="h-4 md:h-5 w-auto" src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg" alt="Lemon Squeezy" />
                                <img className="h-3 md:h-4 w-auto" src="https://html.tailus.io/blocks/customers/laravel.svg" alt="Laravel" />
                                <img className="h-5 md:h-6 w-auto" src="https://html.tailus.io/blocks/customers/openai.svg" alt="OpenAI" />
                            </div>
                        </motion.div>
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