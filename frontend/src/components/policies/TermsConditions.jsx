import { NavLink } from "react-router-dom";
import { FileText, ArrowLeft, Phone, Mail, AlertTriangle, Scale, ShoppingBag, Globe, Ban } from "lucide-react";

const SECTIONS = [
  {
    icon: ShoppingBag,
    title: "Products & Pricing",
    content: [
      "All products listed on our website are subject to availability. We reserve the right to limit quantities or discontinue any product without prior notice.",
      "Prices displayed on the website are in Indian Rupees (₹) and may change without prior notice. The price at the time of order placement will be honored for that order.",
      "While we make every effort to display product images and descriptions accurately, actual products may vary slightly in color or appearance due to photography and screen settings.",
    ],
  },
  {
    icon: Scale,
    title: "Orders & Payments",
    content: [
      "By placing an order, you confirm that the information provided is accurate and that you are authorized to use the selected payment method.",
      "We reserve the right to cancel or refuse any order if we suspect fraudulent activity, pricing errors, or stock unavailability.",
      "Payment must be completed at the time of order placement for all orders.",
    ],
  },
  {
    icon: Globe,
    title: "Website Usage",
    content: [
      "All content on this website, including text, images, logos, and graphics, is the property of DemoMart and is protected under applicable copyright laws.",
      "You may not reproduce, distribute, or use any content from this website for commercial purposes without our written consent.",
      "You agree to use this website only for lawful purposes and in a manner that does not infringe upon the rights of others.",
    ],
  },
  {
    icon: Ban,
    title: "Restrictions & Termination",
    content: [
      "We reserve the right to restrict or terminate your access to the website if we believe you are misusing the platform or violating these terms.",
      "Any attempt to hack, disrupt, or interfere with the website's functionality may result in legal action.",
      "We may update these Terms & Conditions at any time. Continued use of the website constitutes acceptance of the revised terms.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Limitation of Liability",
    content: [
      "DemoMart shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products.",
      "Our liability is limited to the purchase price of the product in question. We are not responsible for delays caused by events beyond our control.",
      "These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Demo City, Maharashtra.",
    ],
  },
];

const TermsConditions = () => (
  <main className="min-h-screen bg-[var(--surface-border)] font-['Inter',system-ui,sans-]">

    {/* Header */}
    <div className="relative overflow-hidden border-b border-[rgba(99, 102, 241,0.10)] bg-slate-50">
      <div className="pointer-events-none absolute -right-16 -top-16 h-[360px] w-[360px]
                      rounded-full bg-[rgba(232,136,58,0.06)] blur-[70px]" />
      <div className="relative mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <NavLink to="/"
                 className="mb-4 inline-flex items-center gap-2 text-sm font-medium
                            text-[rgba(99, 102, 241,0.50)] transition-colors hover:text-[#6366F1]">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </NavLink>
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl
                          bg-[rgba(99, 102, 241,0.12)] ring-1 ring-[rgba(99, 102, 241,0.22)]">
            <FileText className="h-5 w-5 text-[#6366F1]" />
          </div>
          <h1 className="text-3xl font-medium tracking-tight text-[#0F172A] sm:text-4xl">
            Terms & Conditions
          </h1>
        </div>
        <p className="max-w-xl text-[13px] leading-relaxed text-[#475569] sm:text-sm">
          Please read these terms carefully before using our website or making a purchase.
        </p>
      </div>
    </div>

    {/* Content */}
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-10 rounded-2xl border border-[rgba(99, 102, 241,0.10)]
                      bg-slate-50 p-6 shadow-sm sm:p-10">

        {/* Intro */}
        <div className="space-y-3">
          <p className="text-[13px] leading-relaxed text-[#475569]">
            Welcome to{" "}
            <strong className="text-[#0F172A]">DemoMart</strong>.
            These Terms & Conditions govern your use of our website and the purchase of products
            from our store. By accessing or using our website, you agree to be bound by these terms.
          </p>
          <p className="text-[13px] leading-relaxed text-[#475569]">
            Our store is located at{" "}
            <strong className="text-[#0F172A]">
              Ekta Nagar, Akurdi Gaothan, Dattawadi, Demo City, Demo City, Maharashtra 411035
            </strong>{" "}
            and is owned and operated by{" "}
            <strong className="text-[#0F172A]">Demo Owner</strong>.
          </p>
        </div>

        {/* Sections */}
        {SECTIONS.map(({ icon: Icon, title, content }) => (
          <div key={title}>
            <h2 className="mb-4 flex items-center gap-2 text-[15px] font-medium text-[#0F172A]">
              <Icon className="h-4 w-4 text-[#6366F1]" /> {title}
            </h2>
            <ul className="space-y-2">
              {content.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[13px] leading-relaxed text-[#475569]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6366F1]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact box */}
        <div className="rounded-xl border border-[rgba(99, 102, 241,0.25)]
                        bg-[rgba(99, 102, 241,0.07)] p-5">
          <h3 className="mb-2 text-sm font-medium text-[#0F172A]">Questions about these terms?</h3>
          <p className="mb-3 text-[13px] leading-relaxed text-[#475569]">
            If you have any questions or concerns, please reach out:
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="tel:+919561878293"
               className="inline-flex items-center gap-2 text-sm font-medium
                          text-[#6366F1] hover:underline">
              <Phone className="h-4 w-4" /> +91 95618 78293
            </a>
            <a href="mailto:admin@demomart.com"
               className="inline-flex items-center gap-2 text-sm font-medium
                          text-[#6366F1] hover:underline">
              <Mail className="h-4 w-4" /> admin@demomart.com
            </a>
          </div>
        </div>

        <p className="border-t border-[rgba(99, 102, 241,0.08)] pt-4 text-center
                      text-xs text-[rgba(99, 102, 241,0.35)]">
          Last updated: March 2026 · DemoMart
        </p>
      </div>
    </div>
  </main>
);

export default TermsConditions;

