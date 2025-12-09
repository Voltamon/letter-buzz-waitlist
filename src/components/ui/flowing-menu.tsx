"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export interface FlowingMenuItem {
  id: string;
  label: string;
  number: string;
}

interface FlowingMenuProps {
  items: FlowingMenuItem[];
  activeItem: string;
  onItemClick: (id: string) => void;
  className?: string;
}

export const FlowingMenu = ({ 
  items, 
  activeItem, 
  onItemClick, 
  className 
}: FlowingMenuProps) => {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Function to update indicator position
  const updateIndicator = () => {
    const activeIndex = items.findIndex(item => item.id === activeItem);
    const activeElement = itemRefs.current[activeIndex];
    
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
    }
  };

  useEffect(() => {
    updateIndicator();
  }, [activeItem, items]);

  // Add resize listener to adjust indicator on window resize
  useEffect(() => {
    const handleResize = () => {
      updateIndicator();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [activeItem, items]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative flex items-center justify-between bg-card border border-border rounded-full",
        "w-full p-1 md:p-2 gap-0.5 md:gap-1",
        className
      )}
    >
      {/* Flowing background indicator */}
      <motion.div
        className="absolute h-[calc(100%-8px)] md:h-[calc(100%-16px)] bg-primary rounded-full"
        initial={false}
        animate={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      />

      {/* Menu items */}
      {items.map((item, index) => {
        const isActive = item.id === activeItem;
        
        return (
          <button
            key={item.id}
            ref={(el) => (itemRefs.current[index] = el)}
            onClick={() => onItemClick(item.id)}
            className={cn(
              "relative z-10 rounded-full transition-colors duration-300 font-medium flex-1",
              "px-2 py-1.5 text-[10px] md:px-6 md:py-3 md:text-base",
              "active:scale-95 transition-transform",
              isActive 
                ? "text-primary-foreground" 
                : "text-foreground hover:text-foreground/80"
            )}
          >
            <span className="flex items-center justify-center gap-1 md:gap-2">
              <span className={cn(
                "font-mono text-[9px] md:text-xs",
                isActive ? "text-primary-foreground/70" : "text-muted-foreground"
              )}>
                {item.number}
              </span>
              <span className="hidden sm:inline truncate">{item.label}</span>
              <span className="sm:hidden truncate">{item.label.split(' ')[0]}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
};