"use client";

import { useModalStore } from "@/stores/modalStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function GlobalModal() {
    const { isOpen, closeModal, title, body } = useModalStore();

    return (
        <Dialog
            open={isOpen}
            onOpenChange={closeModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                {body}
            </DialogContent>
        </Dialog>
    );
}
