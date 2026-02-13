"use client";

import { useState } from "react";
import { Room } from "@/types";
import { Button } from "@/components/ui/Button";
import { Save } from "lucide-react";
import { useRoomForm } from "@/hooks/useRoomForm";
import { RoomBasicInfo } from "./RoomBasicInfo";
import { RoomLayoutEditor } from "./RoomLayoutEditor";
import { RoomMediaManager } from "./RoomMediaManager";

interface RoomFormProps {
    initialRoom?: Room;
    isNew?: boolean;
}

export function RoomForm({ initialRoom, isNew = false }: RoomFormProps) {
    const {
        room, isLoading, errors, availableAmenities, availableFeatures,
        attachedMedia, isMediaPickerOpen, setIsMediaPickerOpen, pickingCategory,
        featurePickerState, setFeaturePickerState, pickerState, setPickerState,
        handleSubmit, updateField, getBedCount, updateBedCount,
        addSection, removeSection, updateSection,
        handleAddAmenity, removeAmenityFromSection,
        handleAddFeature, removeFeatureFromSection,
        getMediaByCategory, handleAddMediaToCategory, removeMedia, openPickerFor
    } = useRoomForm({ initialRoom, isNew });

    // Tabs
    const [activeTab, setActiveTab] = useState<'details' | 'media'>('details');

    return (
        <div className="space-y-6">
            {/* Header */}
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-[var(--color-sand)] pb-4 bg-white p-4 md:p-6 rounded-lg shadow-sm gap-4">
                <div>
                    <h2 className="text-xl font-bold font-montserrat text-[var(--color-charcoal)]">
                        {isNew ? "Create Room" : "Edit Room"}
                    </h2>
                    <p className="text-sm text-gray-500">{room.name || "New Room"}</p>
                </div>
                <Button type="button" onClick={handleSubmit} isLoading={isLoading} className="gap-2 w-full md:w-auto justify-center">
                    <Save className="h-4 w-4" />
                    Save Room
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
                <button
                    type="button"
                    onClick={() => setActiveTab('details')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'details' ? 'border-[var(--color-aegean-blue)] text-[var(--color-aegean-blue)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Room Details
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('media')}
                    className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'media' ? 'border-[var(--color-aegean-blue)] text-[var(--color-aegean-blue)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Media Config
                </button>
            </div>

            {/* ERROR SUMMARY */}
            {Object.keys(errors).length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                    <p className="font-bold">Please fix field errors:</p>
                    <ul className="list-disc list-inside text-sm mt-1">
                        {Object.entries(errors).map(([k, v]) => <li key={k}>{v}</li>)}
                    </ul>
                </div>
            )}

            {/* DETAILS TAB */}
            {activeTab === 'details' && (
                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 bg-white p-3 md:p-6 rounded-lg border border-[var(--color-sand)] shadow-sm animate-in fade-in duration-300">
                    <RoomBasicInfo
                        room={room}
                        errors={errors}
                        updateField={updateField}
                        getBedCount={getBedCount}
                        updateBedCount={updateBedCount}
                    />

                    <RoomLayoutEditor
                        room={room}
                        availableAmenities={availableAmenities}
                        availableFeatures={availableFeatures}
                        addSection={addSection}
                        removeSection={removeSection}
                        updateSection={updateSection}
                        featurePickerState={featurePickerState}
                        setFeaturePickerState={setFeaturePickerState}
                        pickerState={pickerState}
                        setPickerState={setPickerState}
                        handleAddAmenity={handleAddAmenity}
                        removeAmenityFromSection={removeAmenityFromSection}
                        handleAddFeature={handleAddFeature}
                        removeFeatureFromSection={removeFeatureFromSection}
                    />
                </form>
            )}

            {/* MEDIA TAB */}
            {activeTab === 'media' && (
                <RoomMediaManager
                    attachedMedia={attachedMedia}
                    getMediaByCategory={getMediaByCategory}
                    removeMedia={removeMedia}
                    openPickerFor={openPickerFor}
                    isMediaPickerOpen={isMediaPickerOpen}
                    setIsMediaPickerOpen={setIsMediaPickerOpen}
                    pickingCategory={pickingCategory}
                    handleAddMediaToCategory={handleAddMediaToCategory}
                />
            )}
        </div>
    );
}


