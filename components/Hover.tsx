import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HoverProps } from '@/types';

const Hover = ({ children, text, asChild = false }: HoverProps) => {
  if (!text) {
    return children; // just render children normally
  }

  return (
    <Tooltip>
      <TooltipTrigger className='cursor-pointer' asChild={asChild}>
        {children}
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  );
};

export default Hover;
