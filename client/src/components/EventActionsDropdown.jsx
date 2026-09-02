import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";

const EventActionsDropdown = ({
    event,
    isDeleting,
    isCompleting,
    onEdit,
    onComplete,
    onDelete,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const [menuPosition, setMenuPosition] = useState(null);

    useEffect(() => {
        const handleClickOutside = (clickEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(clickEvent.target) &&
                !clickEvent.target.closest(`[data-event-actions-menu="${event.id}"]`)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [event.id]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const updatePosition = () => {
            const rect = buttonRef.current?.getBoundingClientRect();
            if (!rect) {
                return;
            }

            setMenuPosition({
                top: rect.bottom + 4,
                left: rect.right - 144,
            });
        };

        updatePosition();
        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, true);

        return () => {
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [isOpen]);

    const handleAction = (action) => {
        action(event);
        setIsOpen(false);
    };

    const isCompleted = event.status === "completed";

    return (
        <div ref={dropdownRef} className="relative inline-flex justify-end">
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
                aria-label={`Open actions for ${event.name}`}
                title="Actions"
            >
                <MoreHorizontal size={18} />
            </button>

            {isOpen && menuPosition && createPortal(
                <div
                    data-event-actions-menu={event.id}
                    className="z-50 w-36 overflow-hidden rounded-md border border-zinc-200 bg-white shadow-lg"
                    style={{
                        position: "fixed",
                        top: menuPosition.top,
                        left: menuPosition.left,
                    }}
                >
                    <button
                        type="button"
                        onClick={() => handleAction(onEdit)}
                        className="block w-full px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
                    >
                        Edit
                    </button>

                    {!isCompleted && (
                        <button
                            type="button"
                            disabled={isCompleting}
                            onClick={() => handleAction(onComplete)}
                            className="block w-full px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isCompleting ? "Completing..." : "Complete"}
                        </button>
                    )}

                    <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => handleAction(onDelete)}
                        className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>,
                document.body
            )}
        </div>
    );
};

export default EventActionsDropdown;
