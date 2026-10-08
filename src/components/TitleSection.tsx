import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import ActionCard from "@/components/ActionCard";
import type { dashboardCards } from "@/constants/dashboardCardMap";

type DashboardCard = (typeof dashboardCards)[number];

export interface TitleSectionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  cards: DashboardCard[];
  delay?: number;
}

export default function TitleSection({
  title,
  description,
  icon: Icon,
  cards,
  delay = 0,
}: TitleSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      className="space-y-5"
      aria-labelledby={`section-${title}`}
    >
      <div className="flex items-end justify-between gap-4 border-b border-base-300 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon size={18} strokeWidth={2} />
          </div>
          <div>
            <h2
              id={`section-${title}`}
              className="text-base font-semibold leading-tight text-base-content"
            >
              {title}
            </h2>
            <p className="text-xs text-base-content/60">{description}</p>
          </div>
        </div>

        <span className="rounded-md border border-base-300 bg-base-100 px-2.5 py-1 text-xs font-medium tabular-nums text-base-content/70">
          {cards.length} modul
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <ActionCard key={card.title} {...card} />
        ))}
      </div>
    </motion.section>
  );
}
