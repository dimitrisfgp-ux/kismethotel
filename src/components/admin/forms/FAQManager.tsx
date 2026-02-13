"use client";

import { useState } from "react";
import { FAQ } from "@/types";
import { updateFAQsAction } from "@/app/actions/content";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/admin/TextArea";
import { Select } from "@/components/ui/admin/Select";
import { useToast } from "@/contexts/ToastContext";
import { Save, Plus, Trash2, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQManagerProps {
    initialFAQs: FAQ[];
}

const FAQ_CATEGORIES = ["General", "Booking", "Services", "Dining", "Policies", "Location"];

export function FAQManager({ initialFAQs }: FAQManagerProps) {
    const [faqs, setFaqs] = useState<FAQ[]>(initialFAQs);
    const [isLoading, setIsLoading] = useState(false);
    const [expandedIds, setExpandedIds] = useState<number[]>([]);
    const { showToast } = useToast();

    // Toggle accordion
    const toggleExpand = (id: number) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    // Update local state
    const updateFAQ = (id: number, field: keyof FAQ, value: string) => {
        setFaqs(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f));
    };

    // Add new blank FAQ
    const addFAQ = () => {
        const newId = Math.max(0, ...faqs.map(f => f.id)) + 1;
        const newFAQ: FAQ = {
            id: newId,
            question: "",
            answer: "",
            category: "General"
        };
        setFaqs([...faqs, newFAQ]);
        setExpandedIds(prev => [...prev, newId]); // Auto-expand
    };

    // Delete FAQ
    const deleteFAQ = (id: number) => {
        setFaqs(prev => prev.filter(f => f.id !== id));
    };

    // Save to server
    const handleSave = async () => {
        setIsLoading(true);
        try {
            const success = await updateFAQsAction(faqs);
            if (success) {
                showToast("FAQs updated successfully", "success");
            } else {
                showToast("Failed to update FAQs", "error");
            }
        } catch (_error) {
            showToast("An error occurred", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 md:space-y-8 bg-white p-3 md:p-6 rounded-lg border border-[var(--color-sand)] shadow-sm mt-4 md:mt-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-[var(--color-sand)] pb-4 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--color-aegean-blue)]/10 rounded-full shrink-0">
                        <HelpCircle className="h-5 w-5 text-[var(--color-aegean-blue)]" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold font-montserrat text-[var(--color-charcoal)]">Frequently Asked Questions</h2>
                        <p className="text-sm text-[var(--color-charcoal)]/60">Manage the Q&A displayed on the home page.</p>
                    </div>
                </div>
                <Button onClick={handleSave} isLoading={isLoading} className="gap-2 w-full md:w-auto justify-center">
                    <Save className="h-4 w-4" />
                    Save FAQs
                </Button>
            </div>

            <div className="space-y-4">
                {faqs.length === 0 ? (
                    <div className="text-center py-8 text-[var(--color-charcoal)]/40 italic">
                        No FAQs added yet. Start by adding one below.
                    </div>
                ) : (
                    faqs.map((faq, index) => (
                        <div key={faq.id} className="border border-[var(--color-sand)] rounded-md overflow-hidden transition-all bg-white hover:border-[var(--color-aegean-blue)]/30">
                            <div
                                className={cn(
                                    "flex flex-col md:flex-row items-start md:items-center justify-between p-3 md:p-4 cursor-pointer hover:bg-[var(--color-warm-white)]/50 gap-3 md:gap-0",
                                    expandedIds.includes(faq.id) ? "bg-[var(--color-warm-white)]" : ""
                                )}
                                onClick={() => toggleExpand(faq.id)}
                            >
                                <div className="flex items-center gap-2 md:gap-4 flex-1 w-full md:w-auto">
                                    <span className="text-[var(--color-aegean-blue)] font-bold font-montserrat text-sm w-6 hidden md:inline">#{index + 1}</span>
                                    <span className={cn("font-medium text-sm flex-1 break-words", !faq.question && "text-red-400 italic")}>
                                        {faq.question || "New Question (Click to edit)"}
                                    </span>
                                    <span className="text-[10px] md:text-xs uppercase tracking-wider px-2 py-0.5 md:py-1 bg-[var(--color-sand)]/20 rounded text-[var(--color-charcoal)]/60 shrink-0">
                                        {faq.category}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 ml-auto md:ml-4">
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); deleteFAQ(faq.id); }}
                                        className="p-2 text-[var(--color-charcoal)]/40 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        title="Delete FAQ"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    {expandedIds.includes(faq.id) ? (
                                        <ChevronUp className="h-4 w-4 text-[var(--color-charcoal)]/40" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 text-[var(--color-charcoal)]/40" />
                                    )}
                                </div>
                            </div>

                            {/* Edit Form */}
                            {expandedIds.includes(faq.id) && (
                                <div className="p-4 border-t border-[var(--color-sand)] space-y-4 bg-white animate-slide-down">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="md:col-span-2">
                                            <Input
                                                label="Question"
                                                value={faq.question}
                                                onChange={(e) => updateFAQ(faq.id, 'question', e.target.value)}
                                                placeholder="e.g. What is the check-in time?"
                                            />
                                        </div>
                                        <div>
                                            <Select
                                                label="Category"
                                                value={faq.category}
                                                onChange={(e) => updateFAQ(faq.id, 'category', e.target.value)}
                                                options={FAQ_CATEGORIES.map(c => ({ value: c, label: c }))}
                                            />
                                        </div>
                                    </div>
                                    <TextArea
                                        label="Answer"
                                        value={faq.answer}
                                        onChange={(e) => updateFAQ(faq.id, 'answer', e.target.value)}
                                        rows={3}
                                        placeholder="Provides a helpful answer..."
                                    />
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <Button
                variant="outline"
                onClick={addFAQ}
                className="w-full py-4 border-dashed border-2 hover:border-[var(--color-aegean-blue)] hover:text-[var(--color-aegean-blue)] transition-colors"
            >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
            </Button>
        </div>
    );
}
