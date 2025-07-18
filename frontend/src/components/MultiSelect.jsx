import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, X } from "lucide-react";

export default function MultiSelect({ options = [], placeholder = "Select items", onChange, value }) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        if (value && value.length > 0) {
            setSelected(value)
        }
    }, [options])


    const toggleSelect = (value) => {
        let updated = selected.includes(value)
            ? selected.filter((v) => v !== value)
            : [...selected, value];
        setSelected(updated);
        onChange?.(updated);
    };

    const removeItem = (value) => {
        const updated = selected.filter((v) => v !== value);
        setSelected(updated);
        onChange?.(updated);
    };

    return (
        <div className="w-full">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-full justify-between">
                        {selected.length > 0 ? `${selected.length} selected` : placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandInput placeholder="Search..." />
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    onSelect={() => toggleSelect(option.value)}
                                    className="flex justify-between"
                                >
                                    <span>{option.label}</span>
                                    {selected.includes(option.value) && <Check className="w-4 h-4 text-primary" />}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Selected items as tags */}
            <div className="flex flex-wrap gap-2 mt-2">
                {selected.map((val) => {
                    const label = options.find((opt) => opt.value === val)?.label || val;
                    return (
                        <span
                            key={val}
                            className="flex items-center gap-1 px-2 py-1 text-sm bg-muted rounded-full"
                        >
                            {label}
                            <button onClick={() => removeItem(val)} className="hover:text-red-500">
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
