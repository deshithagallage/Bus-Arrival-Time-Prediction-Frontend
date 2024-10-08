import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function StopSearchBox({
  placeholder,
  searchPlaceHolder,
  notFoundPlaceHolder,
  stops,
  value,
  setValue,
}: {
  placeholder: string;
  searchPlaceHolder: string;
  notFoundPlaceHolder: string;
  stops: {
    name: string;
    id: string;
  }[];
  value: string;
  setValue: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-48 justify-between"
        >
          {value
            ? stops.find((stop) => stop.name === value)?.name
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-48 p-0">
        <Command>
          <CommandInput placeholder={searchPlaceHolder} />
          <CommandList>
            <CommandEmpty>{notFoundPlaceHolder}</CommandEmpty>
            <CommandGroup>
              {stops.map((stop) => (
                <CommandItem
                  key={stop.id}
                  value={stop.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === stop.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {stop.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
