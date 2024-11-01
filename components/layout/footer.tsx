import Link from "next/link";
import { Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-secondary">
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="w-full flex flex-col items-start justify-start gap-8 md:flex-row md:justify-between md:items-center">
          {/* Site Info */}
          <div className="w-full md:w-max space-y-3">
            <h2 className="text-2xl font-bold">Opinion Trading</h2>
            <p className="text-sm">Trade Your Market Predictions</p>
          </div>

          {/* Creator Info */}
          <div className="w-full md:w-max space-y-3">
            <h3 className="text-lg font-semibold">Created by Anurag Kochar</h3>
            <div className="flex space-x-4">
              <Link href="https://twitter.com/anurag__kochar" target="_blank">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://github.com/anurag-kochar-1" target="_blank">
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://linkedin.com/in/anurag-kochar-527696242/"
                target="_blank"
              >
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary/50 text-sm text-center">
          © {new Date().getFullYear()} Opinion Trading. No rights reserved.
        </div>
      </div>
    </footer>
  );
}
