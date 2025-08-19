import React from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/common/header";
import { useNavigate } from "react-router";
import { ArrowRight, Rocket } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Header />
      <main className="overflow-hidden">
        <section className="relative">
          <div className="relative py-24 lg:py-28">
            <div className="mx-auto max-w-7xl px-6 md:px-12">
              <div className="text-center sm:mx-auto sm:w-10/12 lg:mr-auto lg:mt-0 lg:w-4/5">
                <div className="mx-auto flex w-fit items-center gap-2 border rounded-full p-1 pr-3 mb-8">
                  <span className="bg-muted rounded-full px-2 py-1 text-xs">New</span>
                  <span className="text-sm">Assessment Platform</span>
                  <span className="block h-4 w-px bg-border"></span>
                  <ArrowRight className="size-4" />
                </div>

                <h1 className="mt-8 text-4xl font-semibold md:text-5xl xl:text-5xl xl:leading-tight">
                  Test Your Knowledge <br /> with Smart Assessments
                </h1>
                <p className="mx-auto mt-8 hidden max-w-2xl text-wrap text-lg sm:block">
                  Comprehensive assessment platform for evaluating skills and knowledge with detailed analytics and instant results.
                </p>
                <p className="mx-auto mt-6 max-w-2xl text-wrap sm:hidden">
                  Smart assessment platform with detailed analytics and instant results.
                </p>

                <div className="mt-8">
                  <Button
                    size="lg"
                    onClick={() => navigate("/test-entry")}
                  >
                    <Rocket className="relative size-4" />
                    <span className="text-nowrap">Start Assessment</span>
                  </Button>
                </div>
              </div>
              <div className="relative mx-auto mt-8 max-w-lg sm:mt-12">
                <div className="absolute inset-0 -top-8 left-1/2 -z-20 h-56 w-full -translate-x-1/2 [background-image:linear-gradient(to_bottom,transparent_98%,hsl(var(--border)/75%)_98%),linear-gradient(to_right,transparent_94%,hsl(var(--border)/75%)_94%)] [background-size:16px_35px] [mask:radial-gradient(black,transparent_95%)] dark:opacity-10"></div>
                <div className="absolute inset-x-0 top-12 -z-[1] mx-auto h-1/3 w-2/3 rounded-full bg-primary/20 blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
