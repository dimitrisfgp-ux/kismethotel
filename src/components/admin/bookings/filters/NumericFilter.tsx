"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { FilterModal } from "../FilterModal";

export type NumericOperator = "=" | ">=" | "<=" | "between";

export interface NumericFilterValue {
    operator: NumericOperator;
    value: number;
    value2?: number;
}

interface NumericFilterProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    value: NumericFilterValue | null;
    onChange: (value: NumericFilterValue | null) => void;
    /** Parse values as integers (default) or floats */
    parseAs?: 'int' | 'float';
    /** Prefix to show before input (e.g., "€") */
    prefix?: string;
    /** Placeholder text for inputs */
    placeholder?: string;
    /** Minimum value allowed */
    min?: number;
    /** Step for number input */
    step?: number;
}

const OPERATORS: { value: NumericOperator; label: string }[] = [
    { value: "=", label: "Equals" },
    { value: ">=", label: "At least" },
    { value: "<=", label: "At most" },
    { value: "between", label: "Between" }
];

export function NumericFilter({
    title,
    isOpen,
    onClose,
    value,
    onChange,
    parseAs = 'int',
    prefix,
    placeholder = "Value",
    min = 0,
    step = 1
}: NumericFilterProps) {
    const [operator, setOperator] = useState<NumericOperator>(value?.operator || ">=");
    const [num1, setNum1] = useState<string>(value?.value?.toString() || "");
    const [num2, setNum2] = useState<string>(value?.value2?.toString() || "");

    useEffect(() => {
        if (value) {
            setOperator(value.operator);
            setNum1(value.value.toString());
            setNum2(value.value2?.toString() || "");
        } else {
            setOperator(">=");
            setNum1("");
            setNum2("");
        }
    }, [value]);

    const parseValue = (str: string): number => {
        return parseAs === 'float' ? parseFloat(str) : parseInt(str);
    };

    const handleApply = () => {
        const v1 = parseValue(num1);
        if (isNaN(v1)) {
            onChange(null);
            onClose();
            return;
        }

        const result: NumericFilterValue = {
            operator,
            value: v1
        };

        if (operator === "between") {
            const v2 = parseValue(num2);
            if (!isNaN(v2)) {
                result.value2 = v2;
            }
        }

        onChange(result);
        onClose();
    };

    const handleClear = () => {
        setOperator(">=");
        setNum1("");
        setNum2("");
        onChange(null);
    };

    const inputClassName = prefix ? "pl-7 text-center" : "text-center";

    const renderInput = (value: string, onChange: (v: string) => void) => (
        <div className={prefix ? "relative flex-1" : "flex-1"}>
            {prefix && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-charcoal)]/40">
                    {prefix}
                </span>
            )}
            <Input
                type="number"
                min={min}
                step={step}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={inputClassName}
            />
        </div>
    );

    return (
        <FilterModal title={title} isOpen={isOpen} onClose={onClose} onClear={handleClear}>
            <div className="space-y-4">
                {/* Operator Select */}
                <div className="grid grid-cols-4 gap-1">
                    {OPERATORS.map(op => (
                        <button
                            key={op.value}
                            onClick={() => setOperator(op.value)}
                            className={`py-2 px-1 text-xs font-semibold rounded transition-colors ${operator === op.value
                                ? "bg-[var(--color-aegean-blue)] text-white"
                                : "bg-[var(--color-warm-white)] hover:bg-[var(--color-sand)]"
                                }`}
                        >
                            {op.label}
                        </button>
                    ))}
                </div>

                {/* Value Inputs */}
                <div className="flex items-center gap-2">
                    {renderInput(num1, setNum1)}
                    {operator === "between" && (
                        <>
                            <span className="text-sm text-[var(--color-charcoal)]/50">to</span>
                            {renderInput(num2, setNum2)}
                        </>
                    )}
                </div>

                <button
                    onClick={handleApply}
                    className="w-full py-2 bg-[var(--color-aegean-blue)] text-white rounded-[var(--radius-subtle)] font-semibold hover:bg-[var(--color-aegean-blue)]/90 transition-colors"
                >
                    Apply Filter
                </button>
            </div>
        </FilterModal>
    );
}
