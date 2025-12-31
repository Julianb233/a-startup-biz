/**
 * Type definitions for infographic components
 */

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface BaseChartProps {
  data: ChartDataPoint[];
  title: string;
  duration?: number;
  className?: string;
}

export interface BarChartAnimationProps extends BaseChartProps {
  showGridLines?: boolean;
  showAxisLabels?: boolean;
  barGradient?: {
    start: string;
    end: string;
  };
  highlightLastBar?: boolean;
}

export interface AnimationConfig {
  duration: number;
  stagger: number;
  ease: string;
  scrollTrigger?: {
    start: string;
    end?: string;
    toggleActions?: string;
  };
}
